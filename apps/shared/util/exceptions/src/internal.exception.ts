import { HttpStatus } from '@nestjs/common';
import { Exception } from './exception';

export class InternalException extends Exception {
  constructor(message?: string) {
    super(message ?? 'Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
