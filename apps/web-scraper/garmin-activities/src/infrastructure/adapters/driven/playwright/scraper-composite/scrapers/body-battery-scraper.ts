import {
  BodyBatteryOutput,
  DisplayMode,
  IBodyBatteryScraper,
} from '@application/ports/scrapers';
import { Page } from 'playwright';
import { BaseScraper } from './base-scraper';
import { BodyBatteryInfoNotFoundException } from '@domain/exceptions';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BodyBatteryScraper
  extends BaseScraper
  implements IBodyBatteryScraper
{
  private readonly BODY_BATTERY_URL = process.env.GARMIN_BODY_BATTERY_URL!;

  async scrape(page: Page): Promise<BodyBatteryOutput> {
    console.log('Scraping body battery...');
    await page.goto(this.BODY_BATTERY_URL);
    await page.waitForSelector('[role="tablist"]', { timeout: 3000 });

    const displayMode = await this.detectDisplayMode(page);
    console.log(`Detected display mode: ${displayMode}`);
    const response = await this.scrapingStrategiesPer[displayMode](page);
    console.log(response, 'reponse');

    await page.pause();
    return await this.scrapingStrategiesPer[displayMode](page);
  }

  private async detectDisplayMode(page: Page): Promise<DisplayMode> {
    const isNoData = page.getByRole('heading', { name: /sem body battery/i });
    if (await isNoData.isVisible({ timeout: 2000 })) return 'NO_DATA';

    const isPastDays = page.locator(
      'h2[class*="BodyBatteryGaugePastDays_value"]',
    );
    if (await isPastDays.isVisible({ timeout: 2000 })) return 'PAST_DAYS';

    return 'MOST_RECENT';
  }

  private readonly scrapingStrategiesPer: Record<
    DisplayMode,
    (page: Page) => Promise<BodyBatteryOutput>
  > = {
    NO_DATA: async (page) => {
      throw new BodyBatteryInfoNotFoundException();
    },
    MOST_RECENT: async (page) => {
      const mostRecentValue = await page
        .locator('[class*="BodyBatteryGauge_mostRecentValue"]')
        .textContent();
      const maxValue = await page
        .locator('[class*="BodyBatteryGauge_maxValue"]')
        .textContent();
      const summaries = await page
        .locator('[class*="BodyBatterySummary_bodyBatteryValue"]')
        .allTextContents();
      const summaryStats = {
        charged: Number(summaries[0]),
        drained: Number(summaries[1]),
      };

      return {
        displayMode: 'MOST_RECENT',
        mostRecentValue: Number(mostRecentValue),
        maxValue: Number(maxValue),
        stats: summaryStats,
        message: await this.getCleanMessage(page),
      };
    },
    PAST_DAYS: async (page) => {
      const highLevel = await page
        .locator('h2[class*="BodyBatteryGaugePastDays_value"]')
        .textContent();
      const lowLevel = await page
        .locator('h4[class*="BodyBatteryGaugePastDays_value"]')
        .textContent();
      return {
        displayMode: 'PAST_DAYS',
        highLevel: Number(highLevel),
        lowLevel: Number(lowLevel),
        message: await this.getCleanMessage(page),
      };
    },
  };

  private async getCleanMessage(page: Page) {
    const rawMessage = await page
      .locator('p[class*="BodyBatteryScoreMessage_message"]')
      .innerText();
    return rawMessage.replace(/\s+Mais$/, '');
  }
}
