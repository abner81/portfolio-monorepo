import { HttpStatus } from '@nestjs/common';
import { Exception } from './exception';

export class UnexpectedException extends Exception {
  constructor(message?: string) {
    super(message ?? 'Unexpected Error', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
