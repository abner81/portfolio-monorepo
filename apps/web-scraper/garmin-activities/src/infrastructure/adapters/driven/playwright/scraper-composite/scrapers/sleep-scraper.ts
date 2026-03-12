import { ISleepInfoOutput, ISleepScraper } from '@application/ports/scrapers';
import { BaseScraper } from './base-scraper';
import { Page } from 'playwright';
import { SleepInfoNotFoundException } from '@domain/exceptions';
import { Injectable } from '@nestjs/common';
import { parseSleepDurationInHours } from '@shared/utils';

@Injectable()
export class SleepScraper extends BaseScraper implements ISleepScraper {
  private readonly SLEEP_URL = process.env.GARMIN_SLEEP_URL!;
  private readonly EMPTY_VALUE = '--';

  private async ensureSleepDataExistsIn(page: Page): Promise<void> {
    await page.waitForSelector('[class*="sleepScoreTabContainer"]', {
      timeout: 3000,
    });
    const noDataHeading = page.getByRole('heading', {
      name: /nenhum dado de sono/i,
    });

    if (await noDataHeading.isVisible({ timeout: 2000 }))
      throw new SleepInfoNotFoundException();
  }

  async scrape(page: Page): Promise<ISleepInfoOutput> {
    await page.goto(this.SLEEP_URL);
    await this.ensureSleepDataExistsIn(page);

    const totalSleepHours = (await page
      .locator('[class^="SleepGauge_mainText"]')
      .first()
      .textContent())!;

    const sleepStart = (await page
      .locator('[class*="sleepTimeEditor"] span:first-child')
      .textContent())!;
    const wakeUp = (await page
      .locator('[class*="wakeTimeEditor"] span:first-child')
      .textContent())!;

    // # TODO: feat - transformar response em classes (Profunfo, leve, REM)
    // ver se vale a pena, ou deixando so em obj ja resolve
    // https://gemini.google.com/share/4a419f81e090
    // https://claude.ai/share/eade0c66-b929-4356-b23e-b4b8ad4d55aa
    const stagesContainer = page.locator(
      '[class*="SleepStagesSummary_statsContainer"]',
    );
    const stagesArray = (
      await stagesContainer.evaluateAll(this.getRows)
    ).filter(({ value }) => value !== this.EMPTY_VALUE);

    const sleepStages = Object.fromEntries(
      stagesArray.map(({ label, value }) => [
        label,
        parseSleepDurationInHours(value),
      ]),
    );

    console.log(sleepStages, 'sleepStages');

    return {
      sleepDurationInHours: parseSleepDurationInHours(totalSleepHours),
      sleepStartAt: `${sleepStart.padStart(5, '0')}h`,
      wakeUpAt: `${wakeUp.padStart(5, '0')}h`,
    };
  }

  private getRows(rows: HTMLElement[]) {
    return rows.map((row) => ({
      label: row
        .querySelector('[class*="DataBlock_dataLabel"]')!
        .textContent?.trim(),
      value: row
        .querySelector('[class*="DataBlock_dataField"]')!
        .textContent?.trim(),
    }));
  }
}
