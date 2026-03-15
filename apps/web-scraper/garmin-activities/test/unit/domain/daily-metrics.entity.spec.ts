import { DailyMetrics } from 'garmin-activities/domain/entities/daily-metrics/daily-metrics.entity';
import { EntityId, DateValueObject } from '@monorepo/value-objects';

describe('DailyMetrics Entity', () => {
  const props = {
    id: EntityId.create().value,
    date: new Date('2024-01-15'),
    heart: 72,
    calories: 2500,
    activeMinutes: 45,
    bodyBattery: 80,
  };

  it('should create DailyMetrics with correct values', () => {
    const dailyMetrics = new DailyMetrics(props);

    expect(dailyMetrics).toBeDefined();
    expect(dailyMetrics.heart).toBe(props.heart);
    expect(dailyMetrics.calories).toBe(props.calories);
    expect(dailyMetrics.activeMinutes).toBe(props.activeMinutes);
    expect(dailyMetrics.bodyBattery).toBe(props.bodyBattery);
    expect(dailyMetrics.date).toBeInstanceOf(DateValueObject);
    expect(dailyMetrics.id).toBeInstanceOf(EntityId);
  });

  it('should export correct values', () => {
    const dailyMetrics = new DailyMetrics(props);
    const exported = dailyMetrics.export();
    expect(exported).toEqual(props);
  });
});
