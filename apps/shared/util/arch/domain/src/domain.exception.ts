import { Exception } from '@monorepo/exceptions';
import { HttpStatus } from '@nestjs/common';

export class DomainException extends Exception {
  constructor(message?: string) {
    super(message ?? 'Domain Error', HttpStatus.BAD_REQUEST);
  }
}
