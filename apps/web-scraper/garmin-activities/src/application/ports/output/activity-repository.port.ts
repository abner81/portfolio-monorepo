import { Activity } from 'garmin-activities/domain/entities/activity.entity';

export interface ActivityRepositoryPort {
  saveMany(activities: Activity[]): Promise<void>;
}
