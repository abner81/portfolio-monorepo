import { Result } from './result';

describe('Result', () => {
  describe('sucess methods', () => {
    it('should work in success cases', () => {
      expect(Result.ok('test').getValue()).toBe('test');
    });
    it('should work in success cases with no Inputs', () => {
      expect(Result.ok().getValue()).toBeNull();
    });
    it('should work in success cases with no Inputs', () => {
      const result = Result.ok()
      expect(result).toEqual({error: null, value: null, isSuccess: true});
    });
  })

  describe('Fail methods', ()=> {
    it('should work in failure cases', () => {
      const error = new Error('test');
      const result = Result.fail(error)
      expect(result.getError()).toStrictEqual(error);
      expect(result).toEqual({error: error, value: null, isSuccess: false});
    });
  })

  describe('call incorrectly get methods', ()=> {
    it('should throw an error when calling getValue on a failed result', () => {
      const result = Result.fail(new Error());
      expect(() => result.getValue()).toThrow();
    });
    it('should throw an error when calling getError on a successful result', () => {
      const result = Result.ok();
      expect(() => result.getError()).toThrow();
    });
  })

  describe('isOk method', () => {
    it('should return true for a successful result', () => {
      const result = Result.ok('test');
      expect(result.isOk()).toBeTruthy();
    });
    it('should return true for a successful result with null value', () => {
      const result = Result.ok();
      expect(result.isOk()).toBeTruthy();
    });
    it('should return false for a failed result', () => {
      const result = Result.fail(new Error('test'));
      expect(result.isOk()).toBeFalsy();
    });
  });

  describe('isFail method', () => {
    it('should return false for a successful result', () => {
      const result = Result.ok('test');
      expect(result.isFail()).toBeFalsy();
    });
    it('should return false for a successful result with null value', () => {
      const result = Result.ok();
      expect(result.isFail()).toBeFalsy();
    });
    it('should return true for a failed result', () => {
      const result = Result.fail(new Error('test'));
      expect(result.isFail()).toBeTruthy();
    });
  });

  describe('combine method', () => {
    it('should return success when all results are successful', () => {
      const results = [
        Result.ok('a'),
        Result.ok('b'),
        Result.ok('c'),
      ];
      const combined = Result.combine(results);
      expect(combined.isOk()).toBeTruthy();
      expect(combined.getValue()).toBeNull();
    });

    it('should return success with empty array', () => {
      const combined = Result.combine([]);
      expect(combined.isOk()).toBeTruthy();
    });

    it('should return failure when only one result fails', () => {
      const error = new Error('only failure');
      const results = [
        Result.ok('a'),
        Result.ok('b'),
        Result.fail(error),
      ];
      const combined = Result.combine(results);
      expect(combined.isFail()).toBeTruthy();
      expect(combined.isOk()).toBeFalsy();
      expect(combined.getError()).toStrictEqual(error);
    });

    it('should return failure when first result fails', () => {
      const error = new Error('first failure');
      const results = [
        Result.fail(error),
        Result.ok('b'),
        Result.ok('c'),
      ];
      const combined = Result.combine(results);
      expect(combined.isFail()).toBeTruthy();
      expect(combined.isOk()).toBeFalsy();
      expect(combined.getError()).toStrictEqual(error);
    });

  });
});

