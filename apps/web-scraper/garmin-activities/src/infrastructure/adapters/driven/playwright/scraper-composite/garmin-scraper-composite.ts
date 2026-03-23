import type { Page } from 'playwright';
import { Activity } from 'garmin-activities/domain/entities/activity.entity';
import { Inject, Injectable } from '@nestjs/common';
import {
  IActivity,
  IBodyBatteryScraperOutput,
  IHomeScraperOutput,
  ISleep,
  IStress,
} from 'garmin-activities/application/ports/scrapers';
import { INJECTION_TOKENS } from 'garmin-activities/shared/constants/injection-tokens';
import { BaseScraper } from './scrapers/base-scraper';
import { RegistryPage } from './scrapers/page.decorator';

export type ILoginOutput = {
  isLoggedIn: boolean;
};

@Injectable()
export class GarminScraperComposite {
  private readonly scrapers: ReadonlyArray<BaseScraper<object>>;

  constructor(
    @Inject(INJECTION_TOKENS.BODY_BATTERY_SCRAPER)
    public readonly bodyBattery: BaseScraper<IBodyBatteryScraperOutput>,
    @Inject(INJECTION_TOKENS.SLEEP_SCRAPER)
    public readonly sleep: BaseScraper<ISleep>,
    @Inject(INJECTION_TOKENS.HOME_SCRAPER)
    public readonly home: BaseScraper<IHomeScraperOutput>,
    @Inject(INJECTION_TOKENS.STRESS_SCRAPER)
    public readonly stress: BaseScraper<IStress>,
    @Inject(INJECTION_TOKENS.ACTIVITIES_SCRAPER)
    public readonly activities: BaseScraper<IActivity[]>,
  ) {
    this.scrapers = [bodyBattery, sleep, home, stress, activities];
  }

  private readonly LOGIN_URL = process.env.GARMIN_LOGIN_URL!;

  @RegistryPage
  public setPage(page: Page) {
    if (!page) {
      throw new Error('A página não pode ser nula ou undefined');
    }
    console.log('registrando setPages');
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
