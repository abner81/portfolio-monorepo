import { Page } from 'playwright';

export type IActivitiesInfoOutput = {};

export interface IActivitiesScraper {
  scrape(page: Page): Promise<IActivitiesInfoOutput>;
}
