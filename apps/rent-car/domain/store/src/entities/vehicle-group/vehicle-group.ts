import { Entity } from '@monorepo/arch/domain';
import { EntityId, EntityIdProps } from '@monorepo/value-objects';
import { Characteristics, CharacteristicsProps } from './value-objects';

export type VehicleGroupProps = {
  name: string;
  description: string;
  photoUrl: string;
  pricePerDay: number;
  characteristics: CharacteristicsProps;
} & EntityIdProps;

export type VehicleGroupState = {
  id: EntityId;
  characteristics: Characteristics;
  name: string;
  description: string;
  photoUrl: string;
  pricePerDay: number;
};

export class VehicleGroup extends Entity<VehicleGroupProps, VehicleGroupState> {
  public get id() {
    return this.state.id;
  }

  public get characteristics() {
    return this.state.characteristics;
  }

  public get description() {
    return this.state.description;
  }

  public get name() {
    return this.state.name;
  }

  public get photoUrl() {
    return this.state.photoUrl;
  }

  public get pricePerDay() {
    return this.state.pricePerDay;
  }

  protected parse(props: VehicleGroupProps): VehicleGroupState {
    const { description, name, photoUrl, pricePerDay } = props;

    const id = new EntityId(props);
    const characteristics = new Characteristics(props.characteristics);

    return { id, characteristics, description, name, photoUrl, pricePerDay };
  }

  export(): Required<VehicleGroupProps> {
    return {
      characteristics: this.characteristics.export(),
      description: this.description,
      id: this.id.value,
      name: this.name,
      photoUrl: this.photoUrl,
      pricePerDay: this.pricePerDay,
    };
  }
}
