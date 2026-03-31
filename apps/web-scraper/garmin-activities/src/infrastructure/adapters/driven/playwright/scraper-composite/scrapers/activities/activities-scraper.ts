import { IActivity } from 'garmin-activities/application/ports/scrapers';
import { Injectable } from '@nestjs/common';
import { ScrollStopStrategy } from './scroll-stop-strategy';
import { BaseScraper } from '../base-scraper';
import { ActivitiesHelper } from './activities-helper';
import { Locator } from 'playwright';

@Injectable()
export class ActivitiesScraper extends BaseScraper<IActivity[]> {
  private readonly ACTIVITIES_URL = process.env.GARMIN_ACTIVITIES_URL!;
  private readonly LAST_SAVED_ID = 'ksdcfkdskf';
  private readonly helper = new ActivitiesHelper();
  private metrics: Record<string, string> = {};

  protected async doScrape(): Promise<IActivity[]> {
    await this.page.waitForLoadState('networkidle');
    await this.page.goto(this.ACTIVITIES_URL);
    await this.makeScrollHandle();

    const total = await this.helper.activitiesSelector.count();
    const activities: IActivity[] = [];

    for (let i = 0; i < total; i++) {
      const activityRow = this.helper.activitiesSelector.nth(i);
      const linkInfo = await this.helper.getLinkInfo(activityRow);
      await this.getAllActivityMetrics(activityRow);

      activities.push({
        ...linkInfo,
        type: await this.helper.getType(activityRow),
        metrics: this.metrics,
        date: await this.helper.getDate(activityRow),
      });
    }

    console.table(
      activities.map((a) => ({
        id: a.id,
        tipo: a.type,
        nome: a.name,
        metrics: a.metrics,
      })),
    );

    return activities;
  }

  private async makeScrollHandle() {
    const scrollContainerId = '#scrollableArea';
    await this.page.waitForSelector(scrollContainerId);

    while (true) {
      const scrollStopStrategy = new ScrollStopStrategy({
        page: this.page,
        scrollContainerId,
        lastSavedActivityId: this.LAST_SAVED_ID,
        lastRow: await this.helper.activitiesSelector.last(),
      });

      if (await scrollStopStrategy.shouldStop()) break;

      const currentCount = await this.helper.activitiesSelector.count();
      await this.page
        .locator(scrollContainerId)
        .evaluate((node) => (node.scrollTop = node.scrollHeight));

      await this.page.waitForTimeout(2000);

      const newCount = await this.helper.activitiesSelector.count();
      if (newCount === currentCount) {
        console.log('Fim da lista total do site alcançado.');
        break;
      }
    }
  }

  private async getAllActivityMetrics(activityRow: Locator) {
    const metricsSelector = await this.helper.getMetrics(activityRow);
    const metricsCount = metricsSelector.count;

    for (let index = 0; index < metricsCount; index++) {
      const { label, value } = await this.helper.getMetricInfo(
        metricsSelector.container,
        index,
      );
      this.metrics[label] = value;
    }
  }
}
