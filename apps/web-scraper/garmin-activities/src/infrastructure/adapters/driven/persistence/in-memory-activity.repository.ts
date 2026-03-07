import { Injectable } from '@nestjs/common';
import { ActivityRepositoryPort } from '@application/ports/output/activity-repository.port';
import { Activity } from '@domain/entities/activity.entity';

@Injectable()
export class InMemoryActivityRepository implements ActivityRepositoryPort {
  private readonly store = new Map<string, Activity>();

  async saveMany(activities: Activity[]): Promise<void> {
    for (const activity of activities) {
      this.store.set(activity.getId().toString(), activity);
    }
  }
}
