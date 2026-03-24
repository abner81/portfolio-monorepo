import { EntityId } from '@monorepo/value-objects';
import {
  ActivityType,
  IActivity,
  IBodyBattery,
  IHomeScraper,
  ISleep,
  IStress,
} from 'garmin-activities/application/ports/scrapers';
import { BaseScraper } from 'garmin-activities/infra/adapters/driven/playwright/scraper-composite/scrapers/base-scraper';

class MockBodyBatteryScraper extends BaseScraper<IBodyBattery> {
  public readonly response: IBodyBattery = {
    currentLevel: 45,
    message: 'any_text',
    dayRange: { charged: 23, drained: 34 },
    displayMode: 'PAST_DAYS',
    highLevel: 100,
    lowLevel: 23,
  };

  protected async doScrape(): Promise<IBodyBattery> {
    return this.response;
  }
}

class MockSleepScraper extends BaseScraper<ISleep> {
  public readonly response: ISleep = {
    sleepDurationInHours: 7.03,
    sleepStartAt: '03:29',
    wakeUpAt: '09:36',
    stages: { acordado: 4.2, leve: 1.2, profundo: 1.6, rem: 0.5 },
  };
  protected async doScrape(): Promise<ISleep> {
    return this.response;
  }
}

class MockHomeScraper extends BaseScraper<IHomeScraper> {
  public readonly response: IHomeScraper = {
    last7Days: {},
    yesterday: { bodyBattery: { charged: 23, drained: 34 }, sleep: 7.03 },
  };
  protected async doScrape(): Promise<IHomeScraper> {
    return this.response;
  }
}

class MockStressScraper extends BaseScraper<IStress> {
  public readonly response: IStress = { level: 23 };
  protected async doScrape(): Promise<IStress> {
    return this.response;
  }
}

class MockActivitiesScraper extends BaseScraper<IActivity[]> {
  public readonly response: IActivity[] = [
    {
      date: new Date(),
      id: EntityId.create().value,
      type: ActivityType.CORRIDA,
      url: 'www.teste/corrida/8656',
      metrics: { key: 'value' },
      name: 'corrida ao ar livre',
    },
  ];

  protected async doScrape(): Promise<IActivity[]> {
    return this.response;
  }
}

export const makeMockScrapersFactory = () => {
  const bodyBatteryScraper = new MockBodyBatteryScraper();
  const sleepScraper = new MockSleepScraper();
  const homeScraper = new MockHomeScraper();
  const stressScraper = new MockStressScraper();
  const activitiesScraper = new MockActivitiesScraper();

  return {
    bodyBatteryScraper,
    sleepScraper,
    homeScraper,
    stressScraper,
    activitiesScraper,
  };
};
