import { DomainException, ValueObject } from '@monorepo/arch/domain';
import { Guards } from '@monorepo/guards';
import { isDate } from 'util/types';

export type DateValueObjectProps = {
  date: Date;
};

export class DateValueObject extends ValueObject<DateValueObjectProps, Date> {
  get value(): Date {
    return this.state;
  }

  getDaysBetween(dateToCompare: DateValueObject) {
    const oneDayInMs = 24 * 60 * 60 * 1000;
    const differenceInMs = Math.abs(
      this.value.getTime() - dateToCompare.value.getTime()
    );
    return Math.round(differenceInMs / oneDayInMs);
  }

  static create() {
    return new DateValueObject({ date: new Date() });
  }

  protected parse(props: DateValueObjectProps): Date {
    const { date } = props;

    Guards.againstNullOrUndefined(date, 'Date');
    if (!isDate(date))
      throw new DomainException('Date is not in a valid format.');

    return date;
  }

  export(): Required<DateValueObjectProps> {
    return { date: this.state };
  }
}
