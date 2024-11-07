import { Entity } from '@monorepo/arch/domain';
import {
  DateValueObject,
  EntityId,
  EntityIdProps,
} from '@monorepo/value-objects';
import {
  RentalPeriod,
  RentalPeriodProps,
  Status,
  StatusProps,
} from './value-objects';

export type RentProps = {
  createdAt: Date;
  userId: string;
  vehicleGroupId: string;
  rentalPeriod: RentalPeriodProps;
} & EntityIdProps &
  StatusProps;

export type RentState = {
  id: EntityId;
  userId: EntityId;
  status: Status;
  createdAt: DateValueObject;
  vehicleGroupId: EntityId;
  rentalPeriod: RentalPeriod;
};

export class Rent extends Entity<RentProps, RentState> {
  public get id() {
    return this.state.id;
  }

  public get status() {
    return this.state.status;
  }

  public get createdAt() {
    return this.state.createdAt;
  }

  public get userId() {
    return this.state.userId;
  }

  public get rentalPeriod() {
    return this.state.rentalPeriod;
  }

  public get vehicleGroupId() {
    return this.state.vehicleGroupId;
  }

  protected parse(props: RentProps): RentState {
    const id = new EntityId(props);
    const userId = new EntityId({ id: props.userId });
    const vehicleGroupId = new EntityId({ id: props.vehicleGroupId });
    const status = new Status(props);
    const createdAt = new DateValueObject({ date: props.createdAt });
    const rentalPeriod = new RentalPeriod(props.rentalPeriod);

    return { id, status, createdAt, rentalPeriod, userId, vehicleGroupId };
  }

  export(): Required<RentProps> {
    return {
      id: this.id.value,
      status: this.status.value,
      createdAt: this.createdAt.value,
      rentalPeriod: this.rentalPeriod.export(),
      userId: this.userId.value,
      vehicleGroupId: this.userId.value,
    };
  }
}
