import { DomainException, ValueObject } from '@monorepo/arch/domain';
import { Guards } from '@monorepo/guards';
import { DateValueObject } from '@monorepo/value-objects';

export type RentalPeriodProps = {
  start: Date;
  end: Date;
  numberOfDays: number;
};

export type RentalPeriodState = {
  start: DateValueObject;
  end: DateValueObject;
  numberOfDays: number;
};

export class ReturnDataIncompatibleException extends DomainException {
  constructor() {
    super(
      'A data de devolução não pode ser anterior a data de retirada do veículo.'
    );
  }
}

export class RentalPeriod extends ValueObject<
  RentalPeriodProps,
  RentalPeriodState
> {
  static RULES = {
    minOfDays: 1,
    returnToleranceInHours: 3,
  };

  public get start() {
    return this.state.start;
  }
  public get end() {
    return this.state.end;
  }
  public get numberOfDays() {
    return this.state.numberOfDays;
  }

  protected parse(props: RentalPeriodProps): RentalPeriodState {
    const { numberOfDays } = props;
    const start = new DateValueObject({ date: props.start });
    const end = new DateValueObject({ date: props.end });

    if (start.value >= end.value) throw new ReturnDataIncompatibleException();

    Guards.againstNullOrUndefined(numberOfDays, 'numberOfDays');
    Guards.ensureIsInteger(numberOfDays, 'numberOfDays', {
      min: RentalPeriod.RULES.minOfDays,
    });

    return { start, end, numberOfDays };
  }

  export(): Required<RentalPeriodProps> {
    return {
      end: this.end.value,
      numberOfDays: this.numberOfDays,
      start: this.start.value,
    };
  }
}
