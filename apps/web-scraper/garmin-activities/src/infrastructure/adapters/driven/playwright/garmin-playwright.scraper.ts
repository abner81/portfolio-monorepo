import { Injectable } from '@nestjs/common';
import { chromium } from 'playwright-extra';
import stealthPlugin from 'puppeteer-extra-plugin-stealth';
import { BrowserScraperPort } from '@application/ports/output/browser-scraper.port';
import { ScrapeActivitiesCommand } from '@application/use-cases/scrape-activities/scrape-activities.command';
import { Activity } from '@domain/entities/activity.entity';
import { GarminPageObject } from '@infrastructure/adapters/driven/playwright/garmin.page-object';
import { LoginFailedException } from '@domain/exceptions';

chromium.use(stealthPlugin());

@Injectable()
export class GarminPlaywrightScraper implements BrowserScraperPort {
  constructor(private readonly garminWebpage: GarminPageObject) {}
  private readonly storageStatePath =
    'apps/web-scraper/garmin-activities/playwright-state.json';

  async scrapeActivities(
    command: ScrapeActivitiesCommand,
  ): Promise<Activity[]> {
    void command;
    const browser = await chromium.launch({ headless: false });
    try {
      const context = await browser.newContext({
        storageState: this.storageStatePath,
      });
      const page = await context.newPage();

      // const { isLoggedIn } = await this.garminWebpage.makeLogin(page);
      // if (!isLoggedIn) throw new LoginFailedException();
      // await page.context().storageState({ path: this.storageStatePath });

      // const sleepInfo = await this.garminWebpage.scrapeSleepInfo(page);
      // console.log(sleepInfo, 'sleepInfo');

      const getBodyBatteryInfo =
        await this.garminWebpage.scrapeBodyBatteryInfo(page);
      console.log(getBodyBatteryInfo, 'bodyBattery');

      await page.pause();
      return [];
    } finally {
      // await browser.close();
    }
  }
}
