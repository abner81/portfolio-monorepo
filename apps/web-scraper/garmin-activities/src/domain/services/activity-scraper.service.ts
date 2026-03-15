import { Activity } from 'garmin-activities/domain/entities/activity.entity';

export interface ActivityScraperService {
  scrapeActivities(): Promise<Activity[]>;
}
