import { Injectable } from '@nestjs/common';
import { chromium } from 'playwright';
import { BrowserScraperPort } from '@application/ports/output/browser-scraper.port';
import { ScrapeActivitiesCommand } from '@application/use-cases/scrape-activities/scrape-activities.command';
import { Activity } from '@domain/entities/activity.entity';
import { GarminPageObject } from '@infrastructure/adapters/driven/playwright/garmin.page-object';

@Injectable()
export class GarminPlaywrightScraper implements BrowserScraperPort {
  constructor(private readonly garminPageObject: GarminPageObject) {}

  async scrapeActivities(
    command: ScrapeActivitiesCommand,
  ): Promise<Activity[]> {
    void command;
    const browser = await chromium.launch({ headless: true });
    try {
      const page = await browser.newPage();
      return await this.garminPageObject.scrapeActivities(page);
    } finally {
      await browser.close();
    }
  }
}
