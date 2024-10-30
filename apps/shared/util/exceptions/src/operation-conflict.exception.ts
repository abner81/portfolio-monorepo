import { Exception } from './exception';

export class OperationConflictException extends Exception {
  constructor(message?: string) {
    super(message);
  }
}
