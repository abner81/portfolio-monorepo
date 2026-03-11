import { parseSleepDurationInHours } from '@shared/utils';

describe('parseSleepDurationInHours', () => {
  it('should parse sleep duration string correctly', () => {
    const parsedResult = parseSleepDurationInHours('7h 3m');
    expect(parsedResult).toBe(7.05);
  });
});
