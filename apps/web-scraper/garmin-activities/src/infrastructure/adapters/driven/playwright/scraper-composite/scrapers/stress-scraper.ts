import { IStressInfoOutput, IStressScraper } from '@application/ports/scrapers';
import { BaseScraper } from './base-scraper';
import { Page } from 'playwright';
import {
  StressInfoNotFoundException,
  StressInsufficientRecordsException,
} from '@domain/exceptions';
import { Injectable } from '@nestjs/common';

@Injectable()
export class StressScraper extends BaseScraper implements IStressScraper {
  private readonly STRESS_URL = process.env.GARMIN_STRESS_URL!;

  private async ensureStressDataExistsIn(page: Page): Promise<void> {
    const noDataHeading = page.getByRole('heading', {
      name: /Não há dados de estresse/i,
    });
    if (await noDataHeading.isVisible({ timeout: 2000 }))
      throw new StressInfoNotFoundException();
  }

  private async ensureSufficientRecordsExistsIn(page: Page): Promise<void> {
    const insufficientRecords = page.locator(
      '[class*="StressPage_alertWrapper"]',
    );
    if (await insufficientRecords.isVisible({ timeout: 2000 }))
      throw new StressInsufficientRecordsException();
  }

  async scrape(page: Page): Promise<IStressInfoOutput> {
    await page.goto(this.STRESS_URL);
    await page.waitForSelector('[class*="Gc5PageWrapper_contentContainer"]', {
      timeout: 3000,
    });

    await this.ensureStressDataExistsIn(page);
    await this.ensureSufficientRecordsExistsIn(page);

    const stressLevel = (await page
      .locator('[class*="StressDonutChart_mediumDonutText"]')
      .textContent())!;

    return {
      level: Number(stressLevel.trim()),
    };
  }
}
