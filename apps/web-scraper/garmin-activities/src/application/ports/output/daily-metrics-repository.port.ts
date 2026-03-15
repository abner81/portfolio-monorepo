import { Activity } from '@domain/entities/activity.entity';

export interface DailyMetricsRepositoryPort {
  save(metrics: Activity[]): Promise<void>;
}
