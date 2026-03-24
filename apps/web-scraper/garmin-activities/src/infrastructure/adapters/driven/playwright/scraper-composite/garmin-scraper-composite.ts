import type { Page } from 'playwright';
import { Activity } from 'garmin-activities/domain/entities/activity.entity';
import { Inject, Injectable } from '@nestjs/common';
import {
  IActivity,
  IBodyBattery,
  IHomeScraper,
  ISleep,
  IStress,
} from 'garmin-activities/application/ports/scrapers';
import { INJECTION_TOKENS } from 'garmin-activities/shared/constants/injection-tokens';
import { BaseScraper } from './scrapers/base-scraper';
import { RegistryPage } from './scrapers/page.decorator';
import { BaseScraperIsNotInitializedException } from 'garmin-activities/domain/exceptions/base-scraper-is-not-initialized.exception';

export type ILoginOutput = {
  isLoggedIn: boolean;
};

// FIXME: MUDAR ESSE NOME PARA FACADE
// e criar readme apontando para esse arquivo e explicando design patterns usados

@Injectable()
export class GarminScraperComposite {
  private readonly scrapers: ReadonlyArray<BaseScraper<object>>;
  private isPageSet = false;

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
  ) {
    this.scrapers = [bodyBattery, sleep, home, stress, activities];

    return new Proxy(this, {
      get(target, prop, receiver) {
        const propName = String(prop);

        const isAllowedAlways =
          propName === 'setPage' ||
          propName === 'constructor' ||
          propName === 'then' ||
          propName.startsWith('__') ||
          typeof prop === 'symbol';

        if (isAllowedAlways || target.isPageSet) {
          return Reflect.get(target, prop, receiver);
        }

        throw new BaseScraperIsNotInitializedException(target.constructor.name);
      },
    });
  }

  private readonly LOGIN_URL = process.env.GARMIN_LOGIN_URL!;

  @RegistryPage
  public setPage(page: Page) {
    this.isPageSet = true;
    this.scrapers.forEach((scraper) => scraper.setPage(page));
  }

  private alreadyLoggedIn = (page: Page) =>
    !page.url().includes(this.LOGIN_URL);

  async makeLogin(page: Page): Promise<ILoginOutput> {
    await page.goto(this.LOGIN_URL, { waitUntil: 'networkidle' });

    if (this.alreadyLoggedIn(page)) return { isLoggedIn: true };

    const emailInput = page.getByLabel(/email address\*/i);
    await emailInput.fill(process.env.GARMIN_EMAIL!);

    const passwordInput = page.getByLabel(/password\*/i);
    await passwordInput.fill(process.env.GARMIN_PASSWORD!);

    await page.check('input[type="checkbox"]', { force: true });

    const submitButton = page.getByRole('button', {
      name: /sign in/i,
    });
    await submitButton.click({ force: true });

    await page.waitForURL(process.env.GARMIN_HOME_URL!);

    return { isLoggedIn: this.alreadyLoggedIn(page) };
  }

  async scrapeActivities(page: Page): Promise<Activity[]> {
    return [];
  }
}
