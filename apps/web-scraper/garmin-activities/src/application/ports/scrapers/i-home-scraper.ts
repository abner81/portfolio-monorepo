import { BatteryLevelDayRange } from './i-body-battery-scraper';

export type IHomeScraperOutput = {
  yesterday: { bodyBattery: BatteryLevelDayRange; sleep: number };
  last7Days: {};
};
