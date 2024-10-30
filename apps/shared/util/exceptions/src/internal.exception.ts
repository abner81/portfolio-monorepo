import { Exception } from './exception';

export class InternalException extends Exception {
  constructor(message?: string) {
    super(message);
  }
}
