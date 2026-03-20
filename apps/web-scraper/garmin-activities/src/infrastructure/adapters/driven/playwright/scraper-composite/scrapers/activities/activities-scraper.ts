import { IActivitiesScraperOutput } from 'garmin-activities/application/ports/scrapers';
import { Injectable } from '@nestjs/common';
import { ScrollStopStrategy } from './scroll-stop-strategy';
import { BaseScraper } from '../base-scraper';

@Injectable()
export class ActivitiesScraper extends BaseScraper<IActivitiesScraperOutput> {
  private readonly ACTIVITIES_URL = process.env.GARMIN_ACTIVITIES_URL!;
  private readonly LAST_SAVED_ID = 'ksdcfkdskf';

  private get activitiesSelector() {
    return this.page.locator('[class*="ActivityListItem_listItem"]');
  }

  protected async doScrape(): Promise<IActivitiesScraperOutput> {
    await this.page.goto(this.ACTIVITIES_URL);

    this.makeScrollHandle();

    const total = await this.activitiesSelector.count();
    const activities = [];

    for (let i = 0; i < total; i++) {
      const row = this.activitiesSelector.nth(i);

      const linkElement = row.locator('a');
      const href = (await linkElement.getAttribute('href')) || '';
      const id = href.split('/').pop();

      // Pegando as métricas de forma dinâmica
      const metricElements = row.locator(
        '[class*="ActivityListItem_metricItem"]',
      );
      const metricsCount = await metricElements.count();
      const metrics: Record<string, string> = {};

      for (let j = 0; j < metricsCount; j++) {
        const label = await metricElements
          .nth(j)
          .locator('[class*="metricLabel"]')
          .innerText();
        const value = await metricElements
          .nth(j)
          .locator('[class*="metricValue"]')
          .innerText();
        metrics[label] = value;
      }

      activities.push({
        id,
        name: await linkElement.innerText(),
        type: await row.locator('[class*="activityTypeText"]').innerText(),
        metrics,
        url: `https://sua-plataforma.com${href}`,
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
    return {};
  }

  private async makeScrollHandle() {
    const scrollContainerId = '#scrollableArea';
    await this.page.waitForSelector(scrollContainerId);

    while (true) {
      const scrollStopStrategy = new ScrollStopStrategy({
        page: this.page,
        scrollContainerId,
        lastSavedActivityId: this.LAST_SAVED_ID,
        lastRow: this.activitiesSelector.last(),
      });

      if (await scrollStopStrategy.shouldStop()) break;

      const currentCount = await this.activitiesSelector.count();
      await this.page
        .locator(scrollContainerId)
        .evaluate((node) => (node.scrollTop = node.scrollHeight));

      await this.page.waitForTimeout(2000);

      const newCount = await this.activitiesSelector.count();
      if (newCount === currentCount) {
        console.log('Fim da lista total do site alcançado.');
        break;
      }
    }
  }
}
