export interface IController<TOutput extends object | void = void> {
  handle(...args: unknown[]): Promise<TOutput>;
}

export abstract class BaseController<TOutput extends object | void = void>
  implements IController<TOutput>
{
  abstract handle(...args: unknown[]): Promise<TOutput>;
}
