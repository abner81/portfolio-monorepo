import { IHomeScraperOutput } from 'garmin-activities/application/ports/scrapers';
import { BaseScraper } from '../base-scraper';
import { Injectable } from '@nestjs/common';
import { HomeHelper } from './home-helper';

@Injectable()
export class HomeScraper extends BaseScraper<IHomeScraperOutput> {
  private readonly HOME_URL = process.env.GARMIN_HOME_URL!;

  async doScrape(): Promise<IHomeScraperOutput> {
    const alreadyHomeUrl = this.page.url() === this.HOME_URL;
    if (!alreadyHomeUrl) await this.page.goto(this.HOME_URL);

    await this.page.waitForTimeout(3000);

    const helper = new HomeHelper(this.page);

    const periodSelector = {
      last7Days: '[class*="DayView_sevenDayGridContainer"]',
      yesterday: '[class*="DayView_yesterdayGridContainer"]',
    };

    const yesterday = helper.scrapeInfoPer(periodSelector.yesterday);
    const last7Days = helper.scrapeInfoPer(periodSelector.last7Days);

    return {
      last7Days,
      yesterday: { bodyBattery: { charged: 2, drained: 1 }, sleep: 3 },
    };
  }
}
