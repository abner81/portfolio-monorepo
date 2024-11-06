import { DomainException } from '@monorepo/arch/domain';
import { LicensePlate, LicensePlateProps } from './license-plate';

describe('LicensePlate Value Object', () => {
  it('should render LicensePlate with correct values', () => {
    const oldBrPattern = new LicensePlate({ licensePlate: 'aaa-9837' });
    const mercosulPattern = new LicensePlate({ licensePlate: 'aaa1a98' });

    expect(oldBrPattern.value).toBe('aaa-9837'.toUpperCase());
    expect(mercosulPattern.value).toBe('aaa1a98'.toUpperCase());
  });

  it('should dispatch error on receive invalid values', () => {
    const withoutHyphen = () => new LicensePlate({ licensePlate: 'aaa9837' });
    const incompleteOldPattern = () =>
      new LicensePlate({ licensePlate: 'aaa-983' });
    const invalidOldPattern = () =>
      new LicensePlate({ licensePlate: 'aaa-9a33' });

    const incompleteMercosulPattern = () =>
      new LicensePlate({ licensePlate: 'aaa1a9' });
    const invalidMercosulPattern = () =>
      new LicensePlate({ licensePlate: 'aaa1ss3' });

    expect(withoutHyphen).toThrow(DomainException);
    expect(invalidOldPattern).toThrow(DomainException);
    expect(incompleteOldPattern).toThrow(DomainException);
    expect(incompleteMercosulPattern).toThrow(DomainException);
    expect(invalidMercosulPattern).toThrow(DomainException);
  });
});
