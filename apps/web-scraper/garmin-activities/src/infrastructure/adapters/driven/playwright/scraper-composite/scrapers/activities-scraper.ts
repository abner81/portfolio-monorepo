import {
  IActivitiesInfoOutput,
  IActivitiesScraper,
} from 'garmin-activities/application/ports/scrapers';
import { Injectable } from '@nestjs/common';
import { Page } from 'playwright';

@Injectable()
export class ActivitiesScraper implements IActivitiesScraper {
  private readonly ACTIVITIES_URL = process.env.GARMIN_ACTIVITIES_URL!;

  async scrape(page: Page): Promise<IActivitiesInfoOutput> {
    await page.goto(this.ACTIVITIES_URL);

    const scrollContainerSelector = '#scrollableArea';
    await page.waitForSelector(scrollContainerSelector);

    const activityRows = page.locator('[class*="ActivityListItem_listItem"]');
    const total = await activityRows.count();
    const activities = [];

    for (let i = 0; i < total; i++) {
      const row = activityRows.nth(i);

      // Pegando o link e o ID
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
}
