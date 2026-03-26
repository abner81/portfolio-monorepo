import { IStress } from 'garmin-activities/application/ports/scrapers';
import { BaseScraper } from '../base-scraper';
import {
  StressInfoNotFoundException,
  StressInsufficientRecordsException,
} from 'garmin-activities/domain/exceptions';
import { Injectable } from '@nestjs/common';
import { InjectPage } from '../page.decorator';
import { Page } from 'playwright';

@Injectable()
export class StressScraper extends BaseScraper<IStress> {
  private readonly STRESS_URL = process.env.GARMIN_STRESS_URL!;

  private async ensureStressDataExistsIn(): Promise<void> {
    const noDataHeading = this.page.getByRole('heading', {
      name: /Não há dados de estresse/i,
    });
    if (await noDataHeading.isVisible())
      throw new StressInfoNotFoundException();
  }

  private async ensureSufficientRecordsExistsIn(): Promise<void> {
    const insufficientRecords = this.page.locator(
      '[class*="StressPage_alertWrapper"]',
    );
    if (await insufficientRecords.isVisible())
      throw new StressInsufficientRecordsException();
  }

  async doScrape(): Promise<IStress> {
    await this.page.goto(this.STRESS_URL);
    await this.page.waitForSelector(
      '[class*="Gc5PageWrapper_contentContainer"]',
    );

    await this.ensureStressDataExistsIn();
    await this.ensureSufficientRecordsExistsIn();

    const stressLevel = (await this.page
      .locator('[class*="StressDonutChart_mediumDonutText"]')
      .textContent())!;

    return {
      level: Number(stressLevel.trim()),
    };
  }
}
