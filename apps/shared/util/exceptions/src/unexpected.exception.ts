import { Exception } from './exception';

export class UnexpectedException extends Exception {
  constructor(message?: string) {
    super(message);
  }
}
