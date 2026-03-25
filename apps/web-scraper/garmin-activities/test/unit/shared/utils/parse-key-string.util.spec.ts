import { parseKeyString } from 'garmin-activities/shared/utils';

describe('parseKeyString', () => {
  it('should parse key string correctly', () => {
    const parsedResult = parseKeyString('FC MÉDIA');
    expect(parsedResult).toBe('fcMedia');
  });
});
