import { isUUID } from 'validator';
import { DomainException, ValueObject } from '@monorepo/arch/domain';
import { Guards } from '@monorepo/guards';
import { customAlphabet } from 'nanoid';

export type EntityIdProps = {
  id: string;
};

const NANOID_RULES = {
  size: 21,
  alphabet: '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ_abcdefghijklmnopqrstuvwxyz-',
};

const nanoid = customAlphabet(NANOID_RULES.alphabet, NANOID_RULES.size);
const NANOID_VALIDATION_PATTERN = new RegExp(
  `^[${NANOID_RULES.alphabet}]{${NANOID_RULES.size}}$`,
);

export class EntityId extends ValueObject<EntityIdProps, string> {
  get value(): string {
    return this.state;
  }

  protected parse(props: EntityIdProps): string {
    const { id } = props;

    Guards.againstNullOrUndefined(id, 'id');
    Guards.ensureIsString(id, 'id');

    if (!NANOID_VALIDATION_PATTERN.test(id))
      throw new DomainException('O valor informado não é um ID válido.');

    return id;
  }

  static create() {
    return new EntityId({
      id: nanoid(),
    });
  }

  export(): Required<EntityIdProps> {
    return { id: this.state };
  }
}
