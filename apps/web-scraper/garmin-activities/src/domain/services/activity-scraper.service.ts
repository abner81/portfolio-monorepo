import { Activity } from '@domain/entities/activity.entity';

export interface ActivityScraperService {
  scrapeActivities(): Promise<Activity[]>;
}
