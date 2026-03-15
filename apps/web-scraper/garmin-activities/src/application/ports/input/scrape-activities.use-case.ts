import { ScrapeActivitiesCommand } from 'garmin-activities/application/use-cases/scrape-activities/scrape-activities.command';
import { ScrapeActivitiesResult } from 'garmin-activities/application/use-cases/scrape-activities/scrape-activities.result';
import { ScrapingFailedException } from 'garmin-activities/domain/exceptions/scraping-failed.exception';
import { Result } from 'garmin-activities/shared/types/result.type';

export interface ScrapeActivitiesUseCase {
  execute(
    command: ScrapeActivitiesCommand,
  ): Promise<Result<ScrapeActivitiesResult, ScrapingFailedException>>;
}
