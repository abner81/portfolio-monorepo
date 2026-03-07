import { ScrapeActivitiesCommand } from '@application/use-cases/scrape-activities/scrape-activities.command';
import { Activity } from '@domain/entities/activity.entity';

export interface BrowserScraperPort {
  scrapeActivities(command: ScrapeActivitiesCommand): Promise<Activity[]>;
}
