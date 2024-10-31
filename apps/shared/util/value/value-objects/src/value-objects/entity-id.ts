import { isUUID } from 'validator';
import { v4 as uuidv4 } from 'uuid';
import { DomainException, ValueObject } from '@monorepo/arch/domain';
import { Guards } from '@monorepo/guards';

export type EntityIdProps = {
  id: string;
};

export class EntityId extends ValueObject<EntityIdProps, string> {
  get value(): string {
    return this.state;
  }

  protected parse(props: EntityIdProps): string {
    const { id } = props;

    Guards.againstNullOrUndefined(id, 'id');
    if (!isUUID(id, 4))
      throw new DomainException('O valor informado não é um ID válido.');

    return id;
  }

  static create() {
    return new EntityId({
      id: uuidv4(),
    });
  }

  export(): Required<EntityIdProps> {
    return { id: this.state };
  }
}
