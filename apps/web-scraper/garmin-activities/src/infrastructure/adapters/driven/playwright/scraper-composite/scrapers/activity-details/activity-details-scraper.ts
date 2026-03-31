import { RunIntervalsStats } from 'garmin-activities/application/ports/scrapers';
import { BaseScraper } from '../base-scraper';

export type ActivityDetailsScraperInput = {
  activityId: string;
};

export class ActivityDetailsScraper extends BaseScraper<
  RunIntervalsStats,
  ActivityDetailsScraperInput
> {
  private readonly URL = process.env.GARMIN_ACTIVITY_DETAIL!;
  private readonly propriertiesMap: Record<string, keyof RunIntervalsStats> = {
    'Tempo de Corrida': 'duration',
    'Distância de Corrida': 'distance',
    'Ritmo de Corrida': 'pace',
  };

  protected async doScrape({
    activityId,
  }: ActivityDetailsScraperInput): Promise<RunIntervalsStats> {
    await this.page.waitForLoadState('networkidle');
    await this.page.goto(`${this.URL}/${activityId}`);
    const container = this.page.locator('#workoutIntervalsStatsPlaceholder');

    try {
      await container.waitFor({ timeout: 5000 });
    } catch (error) {
      throw new Error(
        `Container do resumo dos invervalos da atividade id: ${activityId} não foi encontrado`,
      );
    }

    const propriertiesCount = Object.keys(this.propriertiesMap).length;
    const runIntervalsStats = {} as RunIntervalsStats;

    for (let i = 0; i < propriertiesCount; i++) {
      const keyLocator = container.locator('[class*="DataBlock_dataLabel"]');
      const valueLocator = container.locator('[class*="DataBlock_dataField"]');

      const key = await keyLocator.nth(i).getAttribute('title');
      const value = await valueLocator.nth(i).innerText();

      runIntervalsStats[this.propriertiesMap[key!]] = value;
    }

    return runIntervalsStats;
  }
}
