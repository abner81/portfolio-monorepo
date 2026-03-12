import { Page } from 'playwright';

export type ISleepInfoOutput = {
  sleepDurationInHours: number;
  sleepStartAt: string;
  wakeUpAt: string;
};
export interface ISleepScraper {
  scrape(page: Page): Promise<ISleepInfoOutput>;
}
