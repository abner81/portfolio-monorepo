import { IActivityReport } from 'garmin-activities/application/ports/scrapers';
import { BaseScraper } from '../base-scraper';
import { ActivityReportHelper } from './activity-report-helper';
import { convertStringInDate } from 'garmin-activities/shared/utils';

export class ActivityReportScraper extends BaseScraper<IActivityReport[]> {
  private readonly ACTIVITY_REPORT_URL =
    process.env.GARMIN_ACTIVITY_REPORT_URL!;
  private readonly helper = new ActivityReportHelper();

  protected async doScrape(): Promise<IActivityReport[]> {
    await this.page.goto(this.ACTIVITY_REPORT_URL);
    await this.page.waitForSelector(this.helper.tableDataSelector);

    await this.helper.groupByWeek();
    await this.page.waitForSelector(this.helper.tableDataSelector);

    const headers = Array.from(await this.helper.getAllTableHeaders());
    this.helper.populateColumnIndexes(headers);

    const rows = Array.from(await this.helper.getAllTableRows()).slice(0, 8);
    const result: IActivityReport[] = [];

    for (const row of rows) {
      const getValueBy = (key: string) => this.helper.getTextByKey(key, row);
      const oldDate = await getValueBy('FULL_DATE');

      result.push({
        date: convertStringInDate(oldDate),
        activitiesCount: Number(
          await getValueBy('ACTIVITY_NUMBER_OF_ACTIVITIES'),
        ),
        distance: {
          total: await getValueBy('ACTIVITY_TOTAL_DISTANCE'),
          average: await getValueBy('ACTIVITY_AVG_DISTANCE'),
          max: await getValueBy('ACTIVITY_MAX_DISTANCE'),
        },
        duration: {
          total: await getValueBy('ACTIVITY_TOTAL_DURATION'),
          average: await getValueBy('ACTIVITY_AVG_TIME'),
          max: await getValueBy('ACTIVITY_MAX_TIME'),
        },
        calories: Number(
          (await getValueBy('ACTIVITY_ACTIVE_CALORIES')).replace('.', ''),
        ),
        averagePace: await getValueBy('ACTIVITY_AVERAGE_PACE'),
        heartRate: {
          average: await getValueBy('ACTIVITY_AVERAGE_HEART_RATE'),
          max: await getValueBy('ACTIVITY_MAX_HEART_RATE'),
        },
        run: {
          averageCadence: await getValueBy('ACTIVITY_AVERAGE_RUN_CADENCE'),
        },
      });
    }

    return result;
  }
}
