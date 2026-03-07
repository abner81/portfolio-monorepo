import { Activity } from '@domain/entities/activity.entity';

export type ScrapeActivitiesResult = {
  activities: Activity[];
};
