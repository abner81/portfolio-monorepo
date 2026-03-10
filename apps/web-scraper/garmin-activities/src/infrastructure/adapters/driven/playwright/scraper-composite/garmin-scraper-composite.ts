import type { Page } from 'playwright';
import { Activity } from '@domain/entities/activity.entity';
import {
  BodyBatteryInfoNotFoundException,
  SleepInfoNotFoundException,
} from '@domain/exceptions';
import { Injectable, Scope } from '@nestjs/common';

export type ILoginOutput = {
  isLoggedIn: boolean;
};

export type ISleepInfoOutput = {
  totalSleepTime: string;
  sleepStartTime: string;
  wakeUpTime: string;
};

// # TODO: refatorar essa classe com composite e facade, como gemini tbm mostrou
@Injectable({ scope: Scope.TRANSIENT })
export class GarminScraperComposite {
  private isInicialized: boolean = false


  private readonly LOGIN_URL = process.env.GARMIN_LOGIN_URL!;

  private readonly BODY_BATTERY_URL = process.env.GARMIN_BODY_BATTERY_URL!;

  private alreadyLoggedIn = (page: Page) =>
    !page.url().includes(this.LOGIN_URL);

  async makeLogin(page: Page): Promise<ILoginOutput> {
    await page.goto(this.LOGIN_URL);
    await page.waitForLoadState('networkidle');

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

  async scrapeSleepInfo(page: Page): Promise<void> {
   
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
   
  }

 init(page: Page) {
    this.isInicialized = true
  }

  private ensureInitialized() {
    // if (!this.page) {
    //   throw new Error('🔥 ERRO DE USO: Deves chamar garmin.init(page) antes de extrair dados!');
    // }
  }
}
