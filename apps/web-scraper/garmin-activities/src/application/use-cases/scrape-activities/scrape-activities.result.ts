import { Activity } from 'garmin-activities/domain/entities/activity.entity';

export type ScrapeActivitiesResult = {
  activities: Activity[];
};
