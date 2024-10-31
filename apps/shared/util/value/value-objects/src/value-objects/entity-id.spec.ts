import { DomainException } from '@monorepo/arch/domain';
import { EntityId } from './entity-id';
import { isUUID } from 'validator';

describe('EntityId Value Object', () => {
  it('should generete id correctly', () => {
    const sut = EntityId.create();
    const sut2 = new EntityId({ id: sut.value });

    expect(isUUID(sut.value)).toBeTruthy();
    expect(sut).toEqual(sut2);
    expect(sut.export()).toEqual({ id: sut.value });
  });

  it('should throw error if pass no uuid with params', () => {
    const act = () => new EntityId({ id: 'not_uuid' });
    const act2 = () => new EntityId({ id: '' });
    const act3 = () => new EntityId({ id: null as any });
    const act4 = () => new EntityId({ id: undefined as any });

    expect(act).toThrow(DomainException);
    expect(act2).toThrow(DomainException);
    expect(act3).toThrow(DomainException);
    expect(act4).toThrow(DomainException);
  });
});
