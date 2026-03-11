import { Activity } from '@domain/entities/activity.entity';
import { ActivityId } from '@domain/value-objects/activity-id.vo';
import { ActivityType } from '@domain/value-objects/activity-type.vo';
import { Duration } from '@domain/value-objects/duration.vo';

describe('Activity Entity', () => {
  it('should create an activity with correct id', () => {
    const activity = new Activity({
      id: new ActivityId('activity-1'),
      type: new ActivityType('running'),
      duration: new Duration(60),
      startedAt: new Date('2020-01-01T00:00:00.000Z'),
    });

    expect(activity.getId().toString()).toBe('activity-1');
  });
});
