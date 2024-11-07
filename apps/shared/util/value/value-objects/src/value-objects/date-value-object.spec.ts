import { isDate } from 'util/types';
import { DateValueObject } from './date-value-object';
import { DomainException } from '@monorepo/arch/domain';

describe('Date Value Object', () => {
  it('should generate Date correctly', () => {
    const sut = DateValueObject.create();
    const sut2 = new DateValueObject({ date: sut.value });
    const sut3 = new DateValueObject({ date: new Date() });

    expect(isDate(sut.value)).toBeTruthy();
    expect(isDate(sut3.value)).toBeTruthy();
    expect(sut).toEqual(sut2);
    expect(sut.export()).toEqual({ date: sut.value });
  });

  it('should throw error if not pass correct argument', () => {
    const sutNull = () => new DateValueObject({ date: null as any });
    const sutUndefined = () => new DateValueObject({ date: undefined as any });
    const sutEmpty = () => new DateValueObject({ date: '' as unknown as Date });

    expect(sutNull).toThrow(DomainException);
    expect(sutUndefined).toThrow(DomainException);
    expect(sutEmpty).toThrow(DomainException);
  });

  it('should return correct values on getDaysBetween()', () => {
    const start = new DateValueObject({ date: new Date('2024-10-01') });
    const end = new DateValueObject({ date: new Date('2024-10-03') });
    const end2 = new DateValueObject({ date: new Date('2024-10-06') });

    expect(start.getDaysBetween(end)).toBe(2);
    expect(start.getDaysBetween(end2)).toBe(5);
  });
});
