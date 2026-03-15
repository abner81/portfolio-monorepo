import { ScrapeActivitiesCommand } from 'garmin-activities/application/use-cases/scrape-activities/scrape-activities.command';
import { Activity } from 'garmin-activities/domain/entities/activity.entity';

export interface BrowserScraperPort {
  scrapeActivities(command: ScrapeActivitiesCommand): Promise<Activity[]>;
}
