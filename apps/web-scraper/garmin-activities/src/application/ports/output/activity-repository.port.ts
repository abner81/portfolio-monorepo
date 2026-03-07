import { Activity } from '@domain/entities/activity.entity';

export interface ActivityRepositoryPort {
  saveMany(activities: Activity[]): Promise<void>;
}
