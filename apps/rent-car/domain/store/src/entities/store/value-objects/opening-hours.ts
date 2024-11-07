import { ValueObject } from '@monorepo/arch/domain';
import { Guards } from '@monorepo/guards';

export type TimeRange = { start: string; end: string };

export type OpeningHoursProps = {
  businessDays: ReadonlyArray<TimeRange>;
  saturday: ReadonlyArray<TimeRange>;
  sunday: ReadonlyArray<TimeRange>;
};

export class OpeningHours extends ValueObject<OpeningHoursProps> {
  public get businessDays(): ReadonlyArray<TimeRange> {
    return [...this.state.businessDays];
  }

  public get saturday(): ReadonlyArray<TimeRange> {
    return [...this.state.saturday];
  }

  public get sunday(): ReadonlyArray<TimeRange> {
    return [...this.state.sunday];
  }

  protected parse(props: OpeningHoursProps): Required<OpeningHoursProps> {
    const { businessDays, saturday, sunday } = props;

    Guards.againstNullOrUndefined(businessDays, 'businessDays');
    Guards.againstEmptyArray(businessDays, 'businessDays');

    Guards.againstNullOrUndefined(saturday, 'saturday');
    Guards.againstEmptyArray(saturday, 'saturday');

    Guards.againstNullOrUndefined(sunday, 'sunday');
    Guards.againstEmptyArray(sunday, 'sunday');

    return { businessDays, saturday, sunday };
  }

  export(): Required<OpeningHoursProps> {
    return {
      businessDays: this.businessDays,
      saturday: this.saturday,
      sunday: this.sunday,
    };
  }
}
