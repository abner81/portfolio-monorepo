import type { Page } from 'playwright';
import { Activity } from '@domain/entities/activity.entity';
import { SleepDataNotFoundException } from '@domain/exceptions';

export type ILoginOutput = {
  isLoggedIn: boolean;
};

export type ISleepInfoOutput = {
  totalSleepTime: string;
  sleepStartTime: string;
  wakeUpTime: string;
};

export class GarminPageObject {
  private readonly LOGIN_URL = process.env.GARMIN_LOGIN_URL!;
  // private readonly SLEEP_URL = process.env.GARMIN_SLEEP_URL!;
  private readonly SLEEP_URL =
    'https://connect.garmin.com/app/sleep/2026-03-08/0';

  private alreadyLoggedIn = (page: Page) =>
    !page.url().includes(this.LOGIN_URL);

  async makeLogin(page: Page): Promise<ILoginOutput> {
    await page.goto(this.LOGIN_URL);
    await page.waitForLoadState('networkidle');

    if (this.alreadyLoggedIn(page)) return { isLoggedIn: true };

    const emailInput = page.getByLabel(/email address\*/i);
    const passwordInput = page.getByLabel(/password\*/i);
    const submitButton = page.getByRole('button', {
      name: /sign in/i,
    });

    await emailInput.fill(process.env.GARMIN_EMAIL!);
    await passwordInput.fill(process.env.GARMIN_PASSWORD!);
    await page.check('input[type="checkbox"]', { force: true });
    await submitButton.click({ force: true });

    await page.waitForURL(process.env.GARMIN_HOME_URL!, {
      waitUntil: 'networkidle',
    });

    return { isLoggedIn: this.alreadyLoggedIn(page) };
  }

  async scrapeActivities(page: Page): Promise<Activity[]> {
    return [];
  }

  private async ensureSleepDataExistsIn(page: Page): Promise<void> {
    await page.waitForSelector('[class*="sleepScoreTabContainer"]');
    const noSleepData = await page
      .getByRole('heading', {
        name: /nenhum dado de sono/i,
      })
      .innerHTML({ timeout: 4000 })
      .catch(() => false);
    if (noSleepData) throw new SleepDataNotFoundException();
  }

  async scrapeSleepInfo(page: Page): Promise<ISleepInfoOutput> {
    await page.goto(this.SLEEP_URL);
    this.ensureSleepDataExistsIn(page);

    const totalSleepTime = (await page
      .locator('[class^="SleepGauge_mainText"]')
      .first()
      .textContent())!;

    const sleepStartTime = (await page
      .locator('[class*="sleepTimeEditor"] span:first-child')
      .textContent())!;

    const wakeUpTime = (await page
      .locator('[class*="wakeTimeEditor"] span:first-child')
      .textContent())!;

    const formatTime = () => ({
      sleepStartTime: `${sleepStartTime.padStart(5, '0')}h`,
      wakeUpTime: `${wakeUpTime.padStart(5, '0')}h`,
    });

    return { totalSleepTime, ...formatTime() };
  }
}
