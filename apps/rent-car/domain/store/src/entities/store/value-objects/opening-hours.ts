import { ValueObject } from '@monorepo/arch/domain';
import { Guards } from '@monorepo/guards';

export type TimeRange = { start: string; end: string };

export type OpeningHoursProps = {
  businessDays: ReadonlyArray<TimeRange>;
  saturday: ReadonlyArray<TimeRange>;
};

export class OpeningHours extends ValueObject<OpeningHoursProps> {
  public get businessDays(): ReadonlyArray<TimeRange> {
    return [...this.state.businessDays];
  }

  public get saturday(): ReadonlyArray<TimeRange> {
    return [...this.state.saturday];
  }

  protected parse(props: OpeningHoursProps): Required<OpeningHoursProps> {
    const { businessDays, saturday } = props;

    Guards.againstNullOrUndefined(businessDays, 'businessDays');
    Guards.againstEmptyArray(businessDays, 'businessDays');

    Guards.againstNullOrUndefined(saturday, 'saturday');
    Guards.againstEmptyArray(saturday, 'saturday');

    return { businessDays, saturday };
  }

  export(): Required<OpeningHoursProps> {
    return { businessDays: this.businessDays, saturday: this.saturday };
  }
}
