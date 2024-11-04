import { ValueObject } from '@monorepo/arch/domain';
import { Guards } from '@monorepo/guards';

export type AddressProps = {
  zipCode: number;
  number: number;
  street: string;
  neighborhood: string;
};

export class Address extends ValueObject<AddressProps> {
  public get zipCode() {
    return this.state.zipCode;
  }

  public get number() {
    return this.state.number;
  }

  public get street() {
    return this.state.street;
  }

  public get neighborhood() {
    return this.state.neighborhood;
  }

  protected parse(props: AddressProps): Required<AddressProps> {
    const { neighborhood, number, street, zipCode } = props;

    Guards.againstNullOrUndefined(neighborhood, 'neighborhood');
    Guards.againstNullOrUndefined(number, 'number');
    Guards.againstNullOrUndefined(street, 'street');
    Guards.againstNullOrUndefined(zipCode, 'zipCode');

    Guards.ensureIsInteger(number, 'number');
    Guards.ensureBrZipCode(zipCode, 'zipCode');

    return { neighborhood, number, street, zipCode };
  }

  export(): Required<AddressProps> {
    return {
      neighborhood: this.neighborhood,
      number: this.number,
      street: this.street,
      zipCode: this.zipCode,
    };
  }
}
