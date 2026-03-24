import {
  IBodyBattery,
  DisplayMode,
} from 'garmin-activities/application/ports/scrapers';
import { BaseScraper } from '../base-scraper';
import { BodyBatteryInfoNotFoundException } from 'garmin-activities/domain/exceptions';
import { Injectable } from '@nestjs/common';
import { BodyBatteryHelper } from './body-battery-helper';

@Injectable()
export class BodyBatteryScraper extends BaseScraper<IBodyBattery> {
  private readonly BODY_BATTERY_URL = process.env.GARMIN_BODY_BATTERY_URL!;
  private readonly helper: BodyBatteryHelper;

  constructor() {
    super();
    //se nao funcinonar, jogar helper pro metodo principal
    this.helper = new BodyBatteryHelper(this.page);
  }

  protected async doScrape(): Promise<IBodyBattery> {
    console.log('Scraping body battery...');
    await this.page.goto(this.BODY_BATTERY_URL);
    await this.page.waitForSelector('[role="tablist"]');

    const displayMode = await this.detectDisplayMode();
    const response = await this.scrapeStrategy[displayMode]();

    console.log('✅ Body Battery scraped successfully -> ', response);

    return response;
  }

  private async detectDisplayMode(): Promise<DisplayMode> {
    const isNoDataMode = await this.helper.noDataHeading.isVisible();
    if (isNoDataMode) return 'NO_DATA';

    const isPastDaysMode = await this.helper.pastDays.highLevel.isVisible();
    if (isPastDaysMode) return 'PAST_DAYS';

    return 'MOST_RECENT';
  }

  private readonly scrapeStrategy: Record<
    DisplayMode,
    () => Promise<IBodyBattery>
  > = {
    NO_DATA: this.noDataStrategy,
    MOST_RECENT: this.mostRecentStrategy,
    PAST_DAYS: this.pastDaysStrategy,
  };

  private noDataStrategy(): Promise<IBodyBattery> {
    throw new BodyBatteryInfoNotFoundException();
  }

  private async mostRecentStrategy(): Promise<IBodyBattery> {
    const currentLevel =
      await this.helper.mostRecent.currentLevel.textContent();
    const highLevel = await this.helper.mostRecent.highLevel.textContent();
    const dayRange = await this.helper.getLevelDayRange();

    return {
      displayMode: 'MOST_RECENT',
      currentLevel: Number(currentLevel),
      highLevel: Number(highLevel),
      dayRange,
      message: await this.getCleanMessage(),
    };
  }

  private async pastDaysStrategy(): Promise<IBodyBattery> {
    const highLevel = await this.helper.pastDays.highLevel.textContent();
    const lowLevel = await this.helper.pastDays.lowLevel.textContent();

    return {
      displayMode: 'PAST_DAYS',
      highLevel: Number(highLevel),
      lowLevel: Number(lowLevel),
      message: await this.getCleanMessage(),
    };
  }

  private async getCleanMessage() {
    const message = await this.helper.scoreMessageSelector.innerText();
    return message.replace(/\s+Mais$/, '');
  }
}
