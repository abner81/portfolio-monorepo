import { ISleepInfoOutput } from "@infrastructure/adapters/driven/playwright/scraper-composite/garmin-scraper-composite";
import { Page } from "playwright";

export interface ISleepScraper {
  scrape(page: Page): Promise<ISleepInfoOutput>;
}