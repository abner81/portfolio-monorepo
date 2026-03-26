import { convertStringInDate } from 'garmin-activities/shared/utils';

describe('Convert String in Date', () => {
  it('should convert string in date with success', () => {
    const result = convertStringInDate('25/12/2024');
    expect(result).toEqual(new Date(2024, 11, 25));
  });

  it('should Throw Error if month is invalid', () => {
    expect(() => convertStringInDate('25/13/2024')).toThrow(Error);
  });

  it('should Throw Error if separator is invalid', () => {
    expect(() => convertStringInDate('25-12-2024')).toThrow(Error);
  });

  it('should Throw Error if date order parameters is invalid', () => {
    expect(() => convertStringInDate('2024/12/11')).toThrow(Error);
  });
});
