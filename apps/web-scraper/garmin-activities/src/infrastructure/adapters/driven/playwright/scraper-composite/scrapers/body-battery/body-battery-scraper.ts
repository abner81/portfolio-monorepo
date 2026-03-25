import {
  IBodyBattery,
  DisplayMode,
} from 'garmin-activities/application/ports/scrapers';
import { BaseScraper } from '../base-scraper';
import { BodyBatteryInfoNotFoundException } from 'garmin-activities/domain/exceptions';
import { Injectable } from '@nestjs/common';
import { BodyBatteryHelper } from './body-battery-helper';
import { InjectPage } from '../page.decorator';
import { Page } from 'playwright';

@Injectable()
export class BodyBatteryScraper extends BaseScraper<IBodyBattery> {
  private readonly BODY_BATTERY_URL = process.env.GARMIN_BODY_BATTERY_URL!;

  protected page!: Page;

  constructor() {
    super();
  }

  protected async doScrape(): Promise<IBodyBattery> {
    const helper = new BodyBatteryHelper(this.page);
    console.log('Scraping body battery...');
    await this.page.goto(this.BODY_BATTERY_URL);
    await this.page.waitForSelector('[role="tablist"]');

    const displayMode = await this.detectDisplayMode(helper);
    const response = await this.scrapeStrategy[displayMode](helper);

    console.log('✅ Body Battery scraped successfully -> ', response);

    return response;
  }

  private async detectDisplayMode(
    helper: BodyBatteryHelper,
  ): Promise<DisplayMode> {
    const isNoDataMode = await helper.noDataHeading.isVisible();
    if (isNoDataMode) return 'NO_DATA';

    const isPastDaysMode = await helper.pastDays.highLevel.isVisible();
    if (isPastDaysMode) return 'PAST_DAYS';

    return 'MOST_RECENT';
  }

  private readonly scrapeStrategy: Record<
    DisplayMode,
    (helper: BodyBatteryHelper) => Promise<IBodyBattery>
  > = {
    NO_DATA: this.noDataStrategy,
    MOST_RECENT: this.mostRecentStrategy,
    PAST_DAYS: this.pastDaysStrategy,
  };

  private noDataStrategy(_helper: BodyBatteryHelper): Promise<IBodyBattery> {
    throw new BodyBatteryInfoNotFoundException();
  }

  private async mostRecentStrategy(
    helper: BodyBatteryHelper,
  ): Promise<IBodyBattery> {
    const currentLevel = await helper.mostRecent.currentLevel.textContent();
    const highLevel = await helper.mostRecent.highLevel.textContent();
    const dayRange = await helper.getLevelDayRange();

    return {
      displayMode: 'MOST_RECENT',
      currentLevel: Number(currentLevel),
      highLevel: Number(highLevel),
      dayRange,
      message: await this.getCleanMessage(helper),
    };
  }

  private async pastDaysStrategy(
    helper: BodyBatteryHelper,
  ): Promise<IBodyBattery> {
    const highLevel = await helper.pastDays.highLevel.textContent();
    const lowLevel = await helper.pastDays.lowLevel.textContent();

    return {
      displayMode: 'PAST_DAYS',
      highLevel: Number(highLevel),
      lowLevel: Number(lowLevel),
      message: await this.getCleanMessage(helper),
    };
  }

  private async getCleanMessage(helper: BodyBatteryHelper) {
    const message = await helper.scoreMessageSelector.innerText();
    return message.replace(/\s+Mais$/, '');
  }
}
