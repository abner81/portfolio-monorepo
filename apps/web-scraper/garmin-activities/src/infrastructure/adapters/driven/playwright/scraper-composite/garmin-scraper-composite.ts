import type { Page } from 'playwright';
import { Activity } from '@domain/entities/activity.entity';
import { Inject, Injectable } from '@nestjs/common';
import {
  IBodyBatteryScraper,
  IHomeScraper,
  ISleepScraper,
  IStressScraper,
} from '@application/ports/scrapers';
import { INJECTION_TOKENS } from '@shared/constants/injection-tokens';

export type ILoginOutput = {
  isLoggedIn: boolean;
};

@Injectable()
export class GarminScraperComposite {
  constructor(
    @Inject(INJECTION_TOKENS.BODY_BATTERY_SCRAPER)
    public readonly bodyBattery: IBodyBatteryScraper,
    @Inject(INJECTION_TOKENS.SLEEP_SCRAPER)
    public readonly sleep: ISleepScraper,
    @Inject(INJECTION_TOKENS.HOME_SCRAPER)
    public readonly home: IHomeScraper,
    @Inject(INJECTION_TOKENS.STRESS_SCRAPER)
    public readonly stress: IStressScraper,
  ) {}

  private readonly LOGIN_URL = process.env.GARMIN_LOGIN_URL!;

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
