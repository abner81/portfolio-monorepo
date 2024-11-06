import { Entity } from '@monorepo/arch/domain';
import {
  DateValueObject,
  EntityId,
  EntityIdProps,
} from '@monorepo/value-objects';
import { Status, StatusProps } from './value-objects';

export type RentProps = { createdAt: Date } & EntityIdProps & StatusProps;

export type RentState = {
  id: EntityId;
  status: Status;
  createdAt: DateValueObject;
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

  protected parse(props: RentProps): RentState {
    const id = new EntityId(props);
    const status = new Status(props);
    const createdAt = new DateValueObject({ date: props.createdAt });

    return { id, status, createdAt };
  }

  export(): Required<RentProps> {
    return {
      id: this.id.value,
      status: this.status.value,
      createdAt: this.createdAt.value,
    };
  }
}
