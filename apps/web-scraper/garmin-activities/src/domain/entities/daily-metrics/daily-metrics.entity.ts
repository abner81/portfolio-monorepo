import { Entity } from '@monorepo/arch/domain';
import {
  DateValueObject,
  DateValueObjectProps,
  EntityId,
  EntityIdProps,
} from '@monorepo/value-objects';

export type DailyMetricsProps = {
  heart: number;
  calories: number;
  activeMinutes: number;
  bodyBattery: number;
} & DateValueObjectProps &
  EntityIdProps;

export type DailyMetricsState = {
  heart: number;
  calories: number;
  activeMinutes: number;
  bodyBattery: number;
  date: DateValueObject;
  id: EntityId;
};

export class DailyMetrics extends Entity<DailyMetricsProps, DailyMetricsState> {
  public get heart() {
    return this.state.heart;
  }
  public get calories() {
    return this.state.calories;
  }
  public get activeMinutes() {
    return this.state.activeMinutes;
  }
  public get bodyBattery() {
    return this.state.bodyBattery;
  }
  public get date() {
    return this.state.date;
  }
  public get id() {
    return this.state.id;
  }

  protected parse(props: DailyMetricsProps): DailyMetricsState {
    const { heart, calories, activeMinutes, bodyBattery } = props;
    const date = new DateValueObject(props);
    const id = new EntityId(props);

    return { heart, calories, activeMinutes, bodyBattery, date, id };
  }

  export(): Required<DailyMetricsProps> {
    return {
      id: this.id.value,
      date: this.date.value,
      heart: this.heart,
      calories: this.calories,
      activeMinutes: this.activeMinutes,
      bodyBattery: this.bodyBattery,
    };
  }
}
