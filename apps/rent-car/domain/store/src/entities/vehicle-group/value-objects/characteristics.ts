import { DomainException, ValueObject } from '@monorepo/arch/domain';
import { Guards } from '@monorepo/guards';

export type CharacteristicsProps = {
  airConditioning: boolean;
  occupants: number;
  transmission: 'automatic' | 'manual';
};

export type CharacteristicsState = {
  airConditioning: boolean;
  occupants: number;
  transmission: 'automatic' | 'manual';
};

const transmissions: CharacteristicsProps['transmission'][] = [
  'automatic',
  'manual',
];

export class Characteristics extends ValueObject<
  CharacteristicsProps,
  CharacteristicsState
> {
  public get airConditioning() {
    return this.state.airConditioning;
  }
  public get occupants() {
    return this.state.occupants;
  }
  public get transmission() {
    return this.state.transmission;
  }

  protected parse(props: CharacteristicsProps): CharacteristicsState {
    const { airConditioning, occupants, transmission } = props;

    Guards.againstNullOrUndefined(airConditioning, 'airConditioning');
    Guards.ensureIsBoolean(airConditioning, 'airConditioning');

    Guards.againstNullOrUndefined(occupants, 'occupants');
    Guards.ensureIsInteger(occupants, 'occupants', { min: 1 });

    Guards.againstNullOrUndefined(transmission, 'transmission');
    if (!transmissions.some((possibilities) => possibilities === transmission))
      throw new DomainException(`Transmissão inválida: [${transmission}].`);

    return { airConditioning, occupants, transmission };
  }

  export(): Required<CharacteristicsProps> {
    return {
      airConditioning: this.airConditioning,
      occupants: this.occupants,
      transmission: this.transmission,
    };
  }
}
