import {
  IHomeScraperOutput,
  DisplayMode,
  IHomeScraper,
} from '@application/ports/scrapers';
import { Page } from 'playwright';
import { BaseScraper } from './base-scraper';
import { Injectable } from '@nestjs/common';

@Injectable()
export class HomeScraper extends BaseScraper implements IHomeScraper {
  private readonly HOME_URL = process.env.GARMIN_HOME_URL!;
  private readonly LABELS_DESEJADAS = [
    /sono/i,
    /passos/i,
    /frequência cardíaca/i,
    /estresse/i,
    /calorias queimadas/i,
    /body battery/i,
    /minutos de intensidade/i,
  ];

  async scrape(page: Page): Promise<IHomeScraperOutput> {
    // #TODO: feat - transformar response em classes (SleepClass, bodyBatteryClass)
    // ver se vale a pena, ou deixando so em obj ja resolve
    // https://gemini.google.com/share/4a419f81e090
    // https://claude.ai/share/eade0c66-b929-4356-b23e-b4b8ad4d55aa
    const alreadyHomeUrl = page.url() === this.HOME_URL;
    if (!alreadyHomeUrl) await page.goto(this.HOME_URL);

    await page.waitForTimeout(3000);

    const yesterday = await this.getGrid(
      page,
      '[class*="DayView_yesterdayGridContainer"]',
    );
    console.log(yesterday, 'yesterday');

    const last7Days = await this.getGrid(
      page,
      '[class*="DayView_sevenDayGridContainer"]',
    );
    console.log('last7Days', last7Days);

    return {
      last7Days,
      yesterday: { bodyBattery: { charged: 2, drained: 1 }, sleep: 3 },
    };
  }

  private async getGrid(page: Page, locatorQuery: string) {
    return (await page.locator(locatorQuery).evaluateAll(this.getRows)).filter(
      ({ label }) =>
        this.LABELS_DESEJADAS.some((pattern) => pattern.test(label)),
    );
  }

  private getRows(rows: HTMLElement[]) {
    return rows.map((row) => ({
      label: row
        .querySelector('[class*="DayView_dayViewLabel"]')!
        .textContent?.trim(),
      value: row
        .querySelector('[class*="DayView_dayViewMetric"]')!
        .textContent?.trim(),
    }));
  }
}
