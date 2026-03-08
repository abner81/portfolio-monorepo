import type { Page } from 'playwright';
import { Activity } from '@domain/entities/activity.entity';

export type ILoginOutput = {
  isLoggedIn: boolean;
};

export class GarminPageObject {
  private readonly LOGIN_URL = process.env.GARMIN_LOGIN_URL!;
  private readonly SLEEP_URL = process.env.GARMIN_SLEEP_URL!;

  async makeLogin(page: Page): Promise<ILoginOutput> {
    await page.goto(this.LOGIN_URL);
    await page.waitForLoadState('networkidle');
    const alreadyLoggedIn = !page.url().includes(this.LOGIN_URL);
    console.log(alreadyLoggedIn);
    if (alreadyLoggedIn) return { isLoggedIn: true };

    const emailInput = page.getByLabel(/email address\*/i);
    const passwordInput = page.getByLabel(/password\*/i);
    const submitButton = page.getByRole('button', {
      name: /sign in/i,
    });

    await emailInput.fill(process.env.GARMIN_EMAIL!);
    await passwordInput.fill(process.env.GARMIN_PASSWORD!);
    await page.check('input[type="checkbox"]', { force: true });
    await submitButton.click({ force: true });

    await page.waitForURL(process.env.GARMIN_HOME_URL!, { waitUntil: 'load' });

    await page.pause();
    return { isLoggedIn: alreadyLoggedIn };
  }

  async scrapeActivities(page: Page): Promise<Activity[]> {
    return [];
  }

  async scrapeSleepInfo(page: Page): Promise<void> {
    await page.goto(this.SLEEP_URL, { waitUntil: 'networkidle' });
    await page.pause();
    // document.querySelector('[class^="SleepGauge_mainText"]') - sono total
    // document.querySelector('[class^="SleepTimeEditor"]') - hora inicio e hora fim
    return;
  }
}
