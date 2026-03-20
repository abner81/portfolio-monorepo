import { Locator, Page } from 'playwright';
import { InjectPage } from '../page.decorator';

export class SleepHelper {
  @InjectPage
  private readonly page!: Page;

  public get noDataHeading() {
    return this.page.getByRole('heading', {
      name: /nenhum dado de sono/i,
    });
  }

  public get totalSleepHours() {
    return this.page.locator('[class^="SleepGauge_mainText"]').first();
  }
  public get sleepStartAt() {
    return this.page.locator('[class*="sleepTimeEditor"] span:first-child');
  }
  public get wakeUpAt() {
    return this.page.locator('[class*="wakeTimeEditor"] span:first-child');
  }

  public async getSleepStages() {
    const container = this.page.locator(
      '[class*="SleepStagesSummary_statsContainer"]',
    );
    return { container, count: await container.count() };
  }

  public async getStageInfoPer(stagesContainer: Locator, nth: number) {
    const label = await stagesContainer
      .nth(nth)
      .locator('[class*="DataBlock_dataLabel"]')
      .innerText();
    const value = await stagesContainer
      .nth(nth)
      .locator('[class*="DataBlock_dataField"]')
      .innerText();

    return { label: label.trim().toLowerCase(), value: value.trim() };
  }
}
