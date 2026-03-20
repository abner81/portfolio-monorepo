import {
  BatteryLevelDayRange,
  MostRecentMode,
  PastDaysMode,
} from 'garmin-activities/application/ports/scrapers';
import { Locator, Page } from 'playwright';

type IMostRecent = Record<keyof Omit<MostRecentMode, 'dayRange'>, Locator>;
type IPastDays = Record<keyof PastDaysMode, Locator>;

export class BodyBatteryHelper {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  public get noDataHeading() {
    return this.page.getByRole('heading', {
      name: /sem body battery/i,
    });
  }

  private readonly _pastDaysSelector = {
    lowLevel: 'h4[class*="BodyBatteryGaugePastDays_value"]',
    highLevel: 'h2[class*="BodyBatteryGaugePastDays_value"]',
  };
  public get pastDays(): IPastDays {
    return {
      lowLevel: this.page.locator(this._pastDaysSelector.lowLevel),
      highLevel: this.page.locator(this._pastDaysSelector.highLevel),
    };
  }

  private readonly _mostRecentSelector = {
    currentLevel: '[class*="BodyBatteryGauge_mostRecentValue"]',
    highLevel: '[class*="BodyBatteryGauge_maxValue"]',
    levelDayRange: '[class*="BodyBatterySummary_bodyBatteryValue"]',
  };

  public get mostRecent(): IMostRecent {
    return {
      currentLevel: this.page.locator(this._mostRecentSelector.currentLevel),
      highLevel: this.page.locator(this._mostRecentSelector.highLevel),
    };
  }

  public async getLevelDayRange(): Promise<BatteryLevelDayRange> {
    const summary = await this.page
      .locator(this._mostRecentSelector.levelDayRange)
      .allTextContents();

    return {
      charged: Number(summary[0]),
      drained: Number(summary[1]),
    };
  }
  public get scoreMessageSelector() {
    return this.page.locator('p[class*="BodyBatteryScoreMessage_message"]');
  }
}
