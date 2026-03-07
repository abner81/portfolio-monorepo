import { Activity } from '@domain/entities/activity.entity';
import { ActivityId } from '@domain/value-objects/activity-id.vo';

export interface ActivityRepository {
  findById(id: ActivityId): Promise<Activity | null>;
  saveMany(activities: Activity[]): Promise<void>;
}
