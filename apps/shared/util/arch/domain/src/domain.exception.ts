import { Exception } from '@monorepo/exceptions';

export class DomainException extends Exception {
  constructor(message?: string) {
    super(message);
  }
}
