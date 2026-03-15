import { Activity } from 'garmin-activities/domain/entities/activity.entity';

export interface DailyMetricsRepositoryPort {
  save(metrics: Activity[]): Promise<void>;
}
