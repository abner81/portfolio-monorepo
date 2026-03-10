import { ISleepInfoOutput, ISleepScraper } from '@application/ports/scrapers';
import { BaseScraper } from './base-scraper';
import { Page } from 'playwright';
import { SleepInfoNotFoundException } from '@domain/exceptions';
import { Injectable } from '@nestjs/common';

@Injectable()
export class SleepScraper extends BaseScraper implements ISleepScraper {
  private readonly SLEEP_URL = process.env.GARMIN_SLEEP_URL!;

  private async ensureSleepDataExistsIn(page: Page): Promise<void> {
    await page.waitForSelector('[class*="sleepScoreTabContainer"]', {
      timeout: 3000,
    });
    const noDataHeading = page.getByRole('heading', {
      name: /nenhum dado de sono/i,
    });

    if (await noDataHeading.isVisible({ timeout: 2000 }))
      throw new SleepInfoNotFoundException();
  }

  async scrape(page: Page): Promise<ISleepInfoOutput> {
    await page.goto(this.SLEEP_URL);
    await this.ensureSleepDataExistsIn(page);

    const totalSleepHours = (await page
      .locator('[class^="SleepGauge_mainText"]')
      .first()
      .textContent())!;

    const sleepStart = (await page
      .locator('[class*="sleepTimeEditor"] span:first-child')
      .textContent())!;
    const wakeUp = (await page
      .locator('[class*="wakeTimeEditor"] span:first-child')
      .textContent())!;

    return {
      totalSleepHours,
      sleepStartAt: `${sleepStart.padStart(5, '0')}h`,
      wakeUpAt: `${wakeUp.padStart(5, '0')}h`,
    };
  }
}
