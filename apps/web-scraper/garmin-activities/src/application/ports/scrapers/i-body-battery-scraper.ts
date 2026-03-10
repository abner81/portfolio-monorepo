import { Page } from "playwright";

export interface IBodyBatteryScraper {
  scrape(page: Page): Promise<void>;
}