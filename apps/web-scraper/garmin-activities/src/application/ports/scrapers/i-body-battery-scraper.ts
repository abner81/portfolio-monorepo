import { Page } from 'playwright';

export type DisplayMode = 'PAST_DAYS' | 'MOST_RECENT' | 'NO_DATA';
export type PastDaysDisplay = {
  highLevel: number;
  lowLevel: number;
};

export type BatteryDayVariation = { charged: number; drained: number };

export type MostRecentDisplay = {
  stats: BatteryDayVariation;
  mostRecentValue: number;
  maxValue: number;
};

export type BodyBatteryOutput = (PastDaysDisplay | MostRecentDisplay) & {
  message: string;
  displayMode: DisplayMode;
};

export interface IBodyBatteryScraper {
  scrape(page: Page): Promise<BodyBatteryOutput>;
}
