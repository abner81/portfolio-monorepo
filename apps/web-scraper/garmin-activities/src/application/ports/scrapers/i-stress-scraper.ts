import { Page } from 'playwright';

export type IStressInfoOutput = {
  level: number;
};
export interface IStressScraper {
  scrape(page: Page): Promise<IStressInfoOutput>;
}
