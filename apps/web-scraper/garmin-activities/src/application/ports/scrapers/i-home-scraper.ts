import { BatteryDayVariation } from './i-body-battery-scraper';

export type IHomeScraperOutput = {
  yesterday: { bodyBattery: BatteryDayVariation; sleep: number };
  last7Days: {};
};
