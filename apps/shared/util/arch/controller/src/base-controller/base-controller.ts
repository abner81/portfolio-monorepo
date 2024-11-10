import { Response } from 'express';

export interface IController<TOutput extends object | void = void> {
  handle(response: Response, ...args: unknown[]): Promise<TOutput>;
}

export abstract class BaseController<TOutput extends object | void = void>
  implements IController<TOutput>
{
  abstract handle(response: Response, ...args: unknown[]): Promise<TOutput>;
}
