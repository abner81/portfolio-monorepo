import { DomainException } from '@monorepo/arch/domain';
import { Guards } from './guards';

describe('Guards', () => {
  it('should return correct value in againstNullOrUndefined() method', () => {
    const invalid = () => Guards.againstNullOrUndefined(null, 'name');
    const invalid2 = () => Guards.againstNullOrUndefined(undefined, 'name');
    const valid = () => Guards.againstNullOrUndefined('', 'name');
    const valid2 = () => Guards.againstNullOrUndefined('John Doe', 'name');

    expect(invalid).toThrow(DomainException);
    expect(invalid2).toThrow(DomainException);
    expect(valid).not.toThrow();
    expect(valid2).not.toThrow();
  });

  it('should return correct value in againstInvalidEmail() method', () => {
    const invalid = () => Guards.againstInvalidEmail('');
    const invalid2 = () => Guards.againstInvalidEmail('johndoe');
    const invalid3 = () =>
      Guards.againstInvalidEmail(null as unknown as string);
    const invalid4 = () =>
      Guards.againstInvalidEmail(undefined as unknown as string);
    const valid = () => Guards.againstInvalidEmail('johndoe@gmail.com');

    expect(invalid).toThrow(DomainException);
    expect(invalid2).toThrow(DomainException);
    expect(invalid3).toThrow(DomainException);
    expect(invalid4).toThrow(DomainException);
    expect(valid).not.toThrow();
  });
});
