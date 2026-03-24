import { BatteryLevelDayRange } from './i-body-battery-scraper';

export type IHomeScraper = {
  yesterday: { bodyBattery: BatteryLevelDayRange; sleep: number };
  last7Days: {};
};
