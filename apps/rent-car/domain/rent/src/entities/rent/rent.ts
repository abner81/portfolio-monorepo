import { Entity } from '@monorepo/arch/domain';
import { EntityId, EntityIdProps } from '@monorepo/value-objects';

export type RentProps = {} & EntityIdProps;

export type RentState = {
  id: EntityId;
};

export class Rent extends Entity<RentProps, RentState> {
  public get id() {
    return this.state.id;
  }

  protected parse(props: RentProps): RentState {
    const id = new EntityId(props);

    return { id };
  }

  export(): Required<RentProps> {
    return {
      id: this.id.value,
    };
  }
}
