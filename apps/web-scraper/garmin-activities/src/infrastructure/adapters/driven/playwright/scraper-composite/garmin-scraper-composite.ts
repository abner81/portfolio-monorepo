import type { Page } from 'playwright';
import { Activity } from 'garmin-activities/domain/entities/activity.entity';
import { Inject, Injectable } from '@nestjs/common';
import {
  IActivity,
  IActivityReport,
  IBodyBattery,
  IHomeScraper,
  ISleep,
  IStress,
  RunIntervalsStats,
} from 'garmin-activities/application/ports/scrapers';
import { INJECTION_TOKENS } from 'garmin-activities/shared/constants/injection-tokens';
import { BaseScraper } from './scrapers/base-scraper';
import { BaseScraperIsNotInitializedException } from 'garmin-activities/domain/exceptions/base-scraper-is-not-initialized.exception';
import { LoginFailedException } from 'garmin-activities/domain/exceptions';
import { ActivityDetailsScraperInput as ActivityDetailsInput } from './scrapers';

export type ILoginOutput = {
  isLoggedIn: boolean;
};

// FIXME: MUDAR ESSE NOME PARA FACADE
// e criar readme apontando para esse arquivo e explicando design patterns usados

@Injectable()
export class GarminScraperComposite {
  private readonly scrapers: ReadonlyArray<BaseScraper<object>>;
  private pageInitialized = false;
  private readonly RESTRICTED_SCRAPERS: (keyof GarminScraperComposite)[] = [
    'activities',
    'bodyBattery',
    'home',
    'sleep',
    'stress',
    'activityReport',
    'activityDetails',
  ];

  constructor(
    @Inject(INJECTION_TOKENS.BODY_BATTERY_SCRAPER)
    public readonly bodyBattery: BaseScraper<IBodyBattery>,
    @Inject(INJECTION_TOKENS.SLEEP_SCRAPER)
    public readonly sleep: BaseScraper<ISleep>,
    @Inject(INJECTION_TOKENS.HOME_SCRAPER)
    public readonly home: BaseScraper<IHomeScraper>,
    @Inject(INJECTION_TOKENS.STRESS_SCRAPER)
    public readonly stress: BaseScraper<IStress>,
    @Inject(INJECTION_TOKENS.ACTIVITIES_SCRAPER)
    public readonly activities: BaseScraper<IActivity[]>,
    @Inject(INJECTION_TOKENS.ACTIVITY_REPORT_SCRAPER)
    public readonly activityReport: BaseScraper<IActivityReport[]>,
    @Inject(INJECTION_TOKENS.ACTIVITY_DETAILS_SCRAPER)
    public readonly activityDetails: BaseScraper<
      RunIntervalsStats,
      ActivityDetailsInput
    >,
  ) {
    this.scrapers = [
      bodyBattery,
      sleep,
      home,
      stress,
      activities,
      activityReport,
      activityDetails,
    ];

    return new Proxy(this, {
      get(target, property, receiver) {
        const propertyName = String(property) as keyof GarminScraperComposite;
        const isRestrictedProperty =
          target.RESTRICTED_SCRAPERS.includes(propertyName);

        if (isRestrictedProperty && !target.pageInitialized) {
          throw new BaseScraperIsNotInitializedException(
            target.constructor.name,
          );
        }

        return Reflect.get(target, property, receiver);
      },
    });
  }

  private readonly LOGIN_URL = process.env.GARMIN_LOGIN_URL!;

  public setPage(page: Page) {
    this.pageInitialized = true;
    this.scrapers.forEach((scraper) => scraper.setPage(page));
  }

  private alreadyLoggedIn = (page: Page) =>
    !page.url().includes(this.LOGIN_URL);

  async makeLogin(page: Page): Promise<ILoginOutput> {
    await page.goto(this.LOGIN_URL);

    try {
      await page.waitForLoadState('networkidle');
      if (this.alreadyLoggedIn(page)) return { isLoggedIn: true };
    } catch (error) {}

    const emailInput = page.getByLabel(/email address\*/i);
    await emailInput.fill(process.env.GARMIN_EMAIL!);

    const passwordInput = page.getByLabel(/password\*/i);
    await passwordInput.fill(process.env.GARMIN_PASSWORD!);

    await page.check('input[type="checkbox"]', { force: true });

    const submitButton = page.getByRole('button', {
      name: /sign in/i,
    });
    await submitButton.click({ force: true });

    try {
      await page.waitForLoadState('networkidle');
    } catch (error) {
      throw new LoginFailedException(String(error));
    }

    return { isLoggedIn: true };
  }

  async scrapeActivities(page: Page): Promise<Activity[]> {
    return [];
  }
}
