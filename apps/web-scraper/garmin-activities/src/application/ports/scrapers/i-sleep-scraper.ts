import { Page } from 'playwright';

export type ISleepInfoOutput = {
  totalSleepHours: string;
  sleepStartAt: string;
  wakeUpAt: string;
};
export interface ISleepScraper {
  scrape(page: Page): Promise<ISleepInfoOutput>;
}
