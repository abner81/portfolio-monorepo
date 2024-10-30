import { Exception } from './exception';

export class ImplementationException extends Exception {
  constructor(message?: string) {
    super(message);
  }
}
