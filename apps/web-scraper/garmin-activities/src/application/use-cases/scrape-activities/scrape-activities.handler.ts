import { Inject, Injectable } from '@nestjs/common';
import { BrowserScraperPort } from '@application/ports/output/browser-scraper.port';
import { ActivityRepositoryPort } from '@application/ports/output/activity-repository.port';
import { ScrapeActivitiesUseCase } from '@application/ports/input/scrape-activities.use-case';
import { ScrapeActivitiesCommand } from '@application/use-cases/scrape-activities/scrape-activities.command';
import { ScrapeActivitiesResult } from '@application/use-cases/scrape-activities/scrape-activities.result';
import { ScrapingFailedException } from '@domain/exceptions/scraping-failed.exception';
import { INJECTION_TOKENS } from '@shared/constants/injection-tokens';
import { err, ok, Result } from '@shared/types/result.type';

@Injectable()
export class ScrapeActivitiesHandler implements ScrapeActivitiesUseCase {
  constructor(
    @Inject(INJECTION_TOKENS.BROWSER_SCRAPER_PORT)
    private readonly browserScraper: BrowserScraperPort,
    @Inject(INJECTION_TOKENS.ACTIVITY_REPOSITORY_PORT)
    private readonly activityRepository: ActivityRepositoryPort,
  ) {}

  async execute(
    command: ScrapeActivitiesCommand,
  ): Promise<Result<ScrapeActivitiesResult, ScrapingFailedException>> {
    try {
      const activities = await this.browserScraper.scrapeActivities(command);
      await this.activityRepository.saveMany(activities);

      return ok({ activities });
    } catch {
      return err(new ScrapingFailedException('Scraping failed'));
    }
  }
}
