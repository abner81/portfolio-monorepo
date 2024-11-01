import { DomainException } from '@monorepo/arch/domain';
import { Password } from './password';

describe('Password Value Object', () => {
  it('should instance Password with success', () => {
    const password =
      '$2a$12$FkCFOnSk9aR13.93MCIhY.lJskAtPYbKPHCPsmuaf1JF7STGxt0kW';
    const sutHashed = new Password({ password });
    const sut = new Password({ password: 'mypassword' });

    expect(sutHashed.value).toBe(password);
    expect(sutHashed.isHashed).toBeTruthy();
    expect(sutHashed.export()).toEqual({ password });
    expect(sut.value).toBe('mypassword');
  });

  it('should throw error if no pass correct argument', () => {
    const sutNineChar = () => new Password({ password: 'mypasswor' });
    const sutEmpty = () => new Password({ password: '' });
    const sutNull = () => new Password({ password: null });
    const sutUndefined = () => new Password({ password: undefined });

    expect(sutNineChar).toThrow(DomainException);
    expect(sutEmpty).toThrow(DomainException);
    expect(sutNull).toThrow(DomainException);
    expect(sutUndefined).toThrow(DomainException);
  });
});
