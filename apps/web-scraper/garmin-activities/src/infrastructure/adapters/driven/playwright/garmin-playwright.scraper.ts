import { Injectable } from '@nestjs/common';
import { chromium } from 'playwright-extra';
import stealthPlugin from 'puppeteer-extra-plugin-stealth';
import { BrowserScraperPort } from '@application/ports/output/browser-scraper.port';
import { ScrapeActivitiesCommand } from '@application/use-cases/scrape-activities/scrape-activities.command';
import { Activity } from '@domain/entities/activity.entity';
import { LoginFailedException } from '@domain/exceptions';
import { GarminScraperComposite } from './scraper-composite/garmin-scraper-composite';

chromium.use(stealthPlugin());

@Injectable()
export class GarminPlaywrightScraper implements BrowserScraperPort {
  constructor(private readonly garmin: GarminScraperComposite) {}
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

      // const { isLoggedIn } = await this.garmin.makeLogin(page);
      // if (!isLoggedIn) throw new LoginFailedException();

      // await page.waitForTimeout(1500);

      // console.log('bodyBattery entrou');
      // const bodyBaterry = await this.garmin.bodyBattery.scrape(page);

      await page.waitForTimeout(1500);
      console.log('sleep entrou');
      const sleep = await this.garmin.sleep.scrape(page);
      console.log(sleep, 'sleep');

      // console.log('entrou na home');
      // await page.waitForTimeout(1000);

      // const home = await this.garmin.home.scrape(page);
      await page.context().storageState({ path: this.storageStatePath });

      return [];
    } finally {
      await browser.close();
    }
  }
}
