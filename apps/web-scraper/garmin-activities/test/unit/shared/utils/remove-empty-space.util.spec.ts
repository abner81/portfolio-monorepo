import { removeEmptySpace } from 'garmin-activities/shared/utils';

describe('removeEmptySpace', () => {
  it('should remove empty space correctly', () => {
    const parsedResult = removeEmptySpace('3h 47m');
    expect(parsedResult).toBe('3h47m');
  });
});
