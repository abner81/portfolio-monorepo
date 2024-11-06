import { Entity } from '@monorepo/arch/domain';
import { Guards } from '@monorepo/guards';
import { EntityId, EntityIdProps } from '@monorepo/value-objects';
import { LicensePlate, LicensePlateProps } from './value-objects';

export type VehicleProps = {
  name: string;
  year: number;
  storeId: string;
  vehicleGroupId: string;
} & EntityIdProps &
  LicensePlateProps;

export type VehicleState = {
  id: EntityId;
  name: string;
  year: number;
  storeId: EntityId;
  vehicleGroupId: EntityId;
  licensePlate: LicensePlate;
};

export class Vehicle extends Entity<VehicleProps, VehicleState> {
  static readonly RULES = {
    maxAgeInYears: 2,
  };

  public get id() {
    return this.state.id;
  }

  public get storeId() {
    return this.state.storeId;
  }

  public get vehicleGroupId() {
    return this.state.vehicleGroupId;
  }

  public get name() {
    return this.state.name;
  }

  public get year() {
    return this.state.year;
  }

  public get licensePlate() {
    return this.state.licensePlate;
  }

  protected parse(props: VehicleProps): VehicleState {
    const { name, year } = props;

    Guards.againstNullOrUndefined(name, 'name');
    Guards.ensureMinWords(2, name, 'name');

    Guards.againstNullOrUndefined(year, 'year');
    const minValidYear = new Date().getFullYear() - Vehicle.RULES.maxAgeInYears;
    Guards.ensureIsInteger(year, 'year', { min: minValidYear });

    const id = new EntityId({ id: props.id });
    const storeId = new EntityId({ id: props.storeId });
    const vehicleGroupId = new EntityId({ id: props.id });
    const licensePlate = new LicensePlate(props);

    return { id, name, year, storeId, vehicleGroupId, licensePlate };
  }

  export(): Required<VehicleProps> {
    return {
      name: this.state.name,
      year: this.state.year,
      id: this.state.id.value,
      storeId: this.state.storeId.value,
      vehicleGroupId: this.state.vehicleGroupId.value,
      licensePlate: this.licensePlate.value,
    };
  }
}
