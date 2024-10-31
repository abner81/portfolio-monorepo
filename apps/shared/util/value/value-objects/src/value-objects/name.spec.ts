import { DomainException } from '@monorepo/arch/domain';
import { InvalidNameException, Name } from './name';

describe('Name Value Object', () => {
  it('should create instance Name() with success', () => {
    const sut = new Name({ name: 'john doe dos santos' });
    const sut2 = new Name({ name: 'alef barreto' });

    expect(sut.value).toBe('John Doe dos Santos');
    expect(sut.firstName).toBe('John');
    expect(sut.lastName).toBe('Doe');
    expect(sut2.value).toBe('Alef Barreto');
    expect(sut.export()).toEqual({ name: sut.value });
  });

  it('should ensure min first and last name', () => {
    const act = () => new Name({ name: 'john' });
    expect(act).toThrow(InvalidNameException);
  });

  it('should throw error if Name not passed', () => {
    const act = () => new Name({ name: undefined as any });
    const act2 = () => new Name({ name: null as any });

    expect(act).toThrow(DomainException);
    expect(act2).toThrow(DomainException);
  });
});
