import { parseSleepDurationInHours } from 'garmin-activities/shared/utils';

describe('parseSleepDurationInHours', () => {
  it('should parse sleep duration string correctly', () => {
    const parsedResult = parseSleepDurationInHours('3h 47m');
    expect(parsedResult).toBe(3.783333333333333);
  });
});
