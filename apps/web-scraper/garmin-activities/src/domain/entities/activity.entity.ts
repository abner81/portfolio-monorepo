import { ActivityId } from 'garmin-activities/domain/value-objects/activity-id.vo';
import { ActivityType } from 'garmin-activities/domain/value-objects/activity-type.vo';
import { Duration } from 'garmin-activities/domain/value-objects/duration.vo';

export class Activity {
  private readonly id: ActivityId;
  private type: ActivityType;
  private duration: Duration;
  private startedAt: Date;

  constructor(params: {
    id: ActivityId;
    type: ActivityType;
    duration: Duration;
    startedAt: Date;
  }) {
    this.id = params.id;
    this.type = params.type;
    this.duration = params.duration;
    this.startedAt = new Date(params.startedAt);

    if (Number.isNaN(this.startedAt.getTime())) {
      throw new Error('startedAt must be a valid Date');
    }
  }

  getId(): ActivityId {
    return this.id;
  }

  getType(): ActivityType {
    return this.type;
  }

  getDuration(): Duration {
    return this.duration;
  }

  getStartedAt(): Date {
    return new Date(this.startedAt);
  }

  changeType(type: ActivityType): void {
    this.type = type;
  }

  changeDuration(duration: Duration): void {
    this.duration = duration;
  }

  reschedule(startedAt: Date): void {
    const next = new Date(startedAt);
    if (Number.isNaN(next.getTime())) {
      throw new Error('startedAt must be a valid Date');
    }
    this.startedAt = next;
  }
}
