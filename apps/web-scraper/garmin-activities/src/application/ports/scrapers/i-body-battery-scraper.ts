export type DisplayMode = 'PAST_DAYS' | 'MOST_RECENT' | 'NO_DATA';
export type PastDaysMode = {
  highLevel: number;
  lowLevel: number;
};

export type BatteryLevelDayRange = { charged: number; drained: number };

export type MostRecentMode = {
  dayRange: BatteryLevelDayRange;
  currentLevel: number;
  highLevel: number;
};

export type IBodyBattery = (PastDaysMode | MostRecentMode) & {
  message: string;
  displayMode: DisplayMode;
};
