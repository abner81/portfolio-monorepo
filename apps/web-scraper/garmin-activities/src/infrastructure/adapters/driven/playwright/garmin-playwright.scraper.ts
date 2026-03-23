import { Inject, Injectable } from '@nestjs/common';
import { chromium } from 'playwright-extra';
import stealthPlugin from 'puppeteer-extra-plugin-stealth';
import type { BrowserScraperPort } from 'garmin-activities/application/ports/output/browser-scraper.port';
import { ScrapeActivitiesCommand } from 'garmin-activities/application/use-cases/scrape-activities/scrape-activities.command';
import { Activity } from 'garmin-activities/domain/entities/activity.entity';
import { GarminScraperComposite } from './scraper-composite/garmin-scraper-composite';
import { INJECTION_TOKENS } from 'garmin-activities/shared/constants/injection-tokens';

chromium.use(stealthPlugin());

@Injectable()
export class GarminPlaywrightScraper implements BrowserScraperPort {
  constructor(
    @Inject(INJECTION_TOKENS.GARMIN_SCRAPER_COMPOSITE)
    private readonly garmin: GarminScraperComposite,
  ) {}

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
      this.garmin.setPage(page);

      // const { isLoggedIn } = await this.garmin.makeLogin(page);
      // if (!isLoggedIn) throw new LoginFailedException();

      // await page.waitForTimeout(1500);

      // console.log('bodyBattery entrou');
      // const bodyBaterry = await this.garmin.bodyBattery.scrape(page);

      await page.waitForTimeout(1500);
      console.log('entrando no activities...');
      console.log(this.garmin.activities);

      await this.garmin.activities.scrape();
      console.log('entrando no activities...');

      // await page.waitForTimeout(1500);
      // console.log('sleep entrou');
      // const sleep = await this.garmin.sleep.scrape(page);
      // console.log(sleep, 'sleep');

      // console.log('entrou na home');
      // await page.waitForTimeout(1000);

      // const home = await this.garmin.home.scrape(page);
      await page.context().storageState({ path: this.storageStatePath });
      await page.pause();
      return [];
    } finally {
      await browser.close();
    }
  }
}
