import { DomainException, ValueObject } from '@monorepo/arch/domain';
import { Guards } from '@monorepo/guards';

export type LicensePlateProps = { licensePlate: string };

export type LicensePlateState = { licensePlate: string };

export class LicensePlate extends ValueObject<
  LicensePlateProps,
  LicensePlateState
> {
  public get value() {
    return this.state.licensePlate;
  }

  protected parse(props: LicensePlateProps): LicensePlateState {
    Guards.againstNullOrUndefined(props.licensePlate, 'licensePlate');
    const licensePlate = props.licensePlate.toUpperCase();

    const oldBrPattern = /^[A-Z]{3}-\d{4}$/; // AAA-1234
    const mercosulPattern = /^[A-Z]{3}\d[A-Z]\d{2}$/; // AAA1A23

    if (!oldBrPattern.test(licensePlate) && !mercosulPattern.test(licensePlate))
      throw new DomainException(`LicensePlate: Valor inválido.`);

    return { licensePlate: licensePlate.toUpperCase() };
  }

  export(): Required<LicensePlateProps> {
    return { licensePlate: this.value };
  }
}
