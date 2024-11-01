import { DomainException } from '@monorepo/arch/domain';
import { Email } from './email';

describe('Email Value Object', () => {
  it('should instance Email correctly', () => {
    const email = 'johndoe@gmail.com';
    const sut = new Email({ email });

    expect(sut.value).toBe(email);
    expect(sut.export()).toEqual({ email });
  });

  it('should throw error if not pass correct argument', () => {
    const sutEmpty = () => new Email({ email: '' });
    const sutSpace = () => new Email({ email: ' ' });
    const sutNull = () => new Email({ email: null });
    const sutUndefined = () => new Email({ email: undefined });
    const sutNotEmail = () => new Email({ email: 'johndoe.com' });

    expect(sutEmpty).toThrow(DomainException);
    expect(sutSpace).toThrow(DomainException);
    expect(sutNull).toThrow(DomainException);
    expect(sutUndefined).toThrow(DomainException);
    expect(sutNotEmail).toThrow(DomainException);
  });
});
