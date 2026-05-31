export class Result<T, E extends Error = null> {

  private constructor(
    private readonly isSuccess: boolean,
    private readonly value: T,
    private readonly error: E | null,
  ) {
      Object.freeze(this);
  }

  static ok<T>(value: T = null): Result<T, null> {
    return new Result<T, null>(true, value, null);
  }

  static fail<E extends Error>(error: E): Result<null, E> {
    return new Result<null, E>(false, null, error);
  }

  isOk(): boolean {
    return this.isSuccess && this.error === null;
  }

  isFail(): boolean {
    return !this.isSuccess && this.error !== null;
  }

  getValue(): T {
    if (this.isFail()) {
      throw new Error('Tried to unwrap an Err value');
    }
    return this.value as T;
  }

  getError(): E {
    if (this.isOk()) {
      throw new Error('Tried to unwrap an Ok value');
    }
    return this.error as E;
  }

  public static combine<T, E extends Error = null> (results: Result<T, E>[]) : Result<T, E> {
    for (let result of results) {
      if (result.isFail()) return result;
    }
    return Result.ok();
  }
}