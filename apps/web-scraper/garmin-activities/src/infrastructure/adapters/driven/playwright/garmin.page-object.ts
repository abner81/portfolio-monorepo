import type { Page } from 'playwright';
import { Activity } from '@domain/entities/activity.entity';
import {
  BodyBatteryInfoNotFoundException,
  SleepInfoNotFoundException,
} from '@domain/exceptions';

export type ILoginOutput = {
  isLoggedIn: boolean;
};

export type ISleepInfoOutput = {
  totalSleepTime: string;
  sleepStartTime: string;
  wakeUpTime: string;
};

// # TODO: refatorar essa classe com composite e facade, como gemini tbm mostrou
export class GarminPageObject {
  private readonly LOGIN_URL = process.env.GARMIN_LOGIN_URL!;
  private readonly SLEEP_URL = process.env.GARMIN_SLEEP_URL!;
  private readonly BODY_BATTERY_URL = process.env.GARMIN_BODY_BATTERY_URL!;

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
    const noDataHeading = page.getByRole('heading', {
      name: /nenhum dado de sono/i,
    });

    if (await noDataHeading.isVisible({ timeout: 3000 }))
      throw new SleepInfoNotFoundException();
  }

  async scrapeSleepInfo(page: Page): Promise<ISleepInfoOutput> {
    await page.goto(this.SLEEP_URL);
    await this.ensureSleepDataExistsIn(page);

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

  private async ensureBodyBatteryInfoExistsIn(page: Page): Promise<void> {
    await page.waitForSelector('[role="tablist"]');
    const noDataHeading = page.getByRole('heading', {
      name: /sem body battery/i,
    });

    // # TODO: ver se o .isVisible funciona
    if (await noDataHeading.isVisible({ timeout: 3000 }))
      throw new BodyBatteryInfoNotFoundException();
  }

  async scrapeBodyBatteryInfo(page: Page): Promise<void> {
    // # TODO: refatorar esse metodo como o gemini mostrou
    await page.goto(this.BODY_BATTERY_URL);
    await this.ensureBodyBatteryInfoExistsIn(page);

    // # Quando tem Alta e baixa no score
    const highLevel = await page
      .locator('h2[class*="BodyBatteryGaugePastDays_value"]')
      .textContent();
    const lowLevel = await page
      .locator('h4[class*="BodyBatteryGaugePastDays_value"]')
      .textContent();

    // # Quando tem o total e most recent
    const mostRecentValue = await page
      .locator('[class*="BodyBatteryGauge_mostRecentValue"]')
      .textContent();
    const maxValue = await page
      .locator('[class*="BodyBatteryGauge_maxValue"]')
      .textContent();
    const summaries = await page
      .locator('[class*="BodyBatterySummary_bodyBatteryValue"]')
      .allTextContents();
    const summaryStats = {
      charged: summaries[0],
      drained: summaries[1],
    };

    const rawMessage = await page
      .locator('p[class*="BodyBatteryScoreMessage_message"]')
      .innerText();
    const scoreMessage = rawMessage.replace(/\s+Mais$/, '');

    await page.pause();

    return;
  }
}
