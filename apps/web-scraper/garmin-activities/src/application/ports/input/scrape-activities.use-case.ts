import { ScrapeActivitiesCommand } from '@application/use-cases/scrape-activities/scrape-activities.command';
import { ScrapeActivitiesResult } from '@application/use-cases/scrape-activities/scrape-activities.result';
import { ScrapingFailedException } from '@domain/exceptions/scraping-failed.exception';
import { Result } from '@shared/types/result.type';

export interface ScrapeActivitiesUseCase {
  execute(
    command: ScrapeActivitiesCommand,
  ): Promise<Result<ScrapeActivitiesResult, ScrapingFailedException>>;
}
