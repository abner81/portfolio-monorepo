import { Locator, Page } from 'playwright';
import { InjectPage } from '../page.decorator';
import { ActivityType } from 'garmin-activities/application/ports/scrapers';
import {
  parseKeyString,
  removeEmptySpace,
} from 'garmin-activities/shared/utils';

export class ActivitiesHelper {
  @InjectPage
  private readonly page!: Page;
  private readonly monthMap: Record<string, number> = {
    Jan: 0,
    Fev: 1,
    Mar: 2,
    Abr: 3,
    Mai: 4,
    Jun: 5,
    Jul: 6,
    Ago: 7,
    Set: 8,
    Out: 9,
    Nov: 10,
    Dez: 11,
  };

  public get activitiesSelector() {
    console.log(this.page, 'page');

    return this.page.locator('[class*="ActivityListItem_listItem"]');
  }

  public async getLinkInfo(activityRow: Locator) {
    const linkElement = activityRow.locator('a');
    const href = (await linkElement.getAttribute('href')) || '';
    const id = href.split('/').pop()!;

    return { name: await linkElement.innerText(), url: href, id };
  }

  public async getMetrics(activityRow: Locator) {
    const container = activityRow.locator(
      '[class*="ActivityListItem_metricItem"]',
    );

    return { container, count: await container.count() };
  }

  public async getMetricInfo(metricsContainer: Locator, index: number) {
    const label = await metricsContainer
      .nth(index)
      .locator('[class*="metricLabel"]')
      .innerText();
    const value = await metricsContainer
      .nth(index)
      .locator('[class*="metricValue"]')
      .innerText();

    return { label: parseKeyString(label), value: removeEmptySpace(value) };
  }

  public async getType(activityRow: Locator): Promise<ActivityType> {
    return (await activityRow
      .locator('[class*="activityTypeText"]')
      .innerText()) as ActivityType;
  }

  public async getDate(row: Locator) {
    const dayMonthText = await row
      .locator('[class*="activityDate__"]')
      .innerText();
    const yearText = await row
      .locator('[class*="activityDateYear__"]')
      .innerText();

    const [dayStr, monthAbbr] = dayMonthText.split(' ');
    const monthIndex = this.monthMap[monthAbbr] ?? 0;
    return new Date(parseInt(yearText), monthIndex, parseInt(dayStr));
  }
}
