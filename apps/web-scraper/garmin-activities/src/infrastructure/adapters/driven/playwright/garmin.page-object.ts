import type { Page } from 'playwright';
import { Activity } from '@domain/entities/activity.entity';

export class GarminPageObject {
  async scrapeActivities(page: Page): Promise<Activity[]> {
    void page;
    return [];
  }
}
