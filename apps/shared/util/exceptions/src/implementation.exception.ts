import { HttpStatus } from '@nestjs/common';
import { Exception } from './exception';

export class ImplementationException extends Exception {
  constructor(message?: string) {
    super(message ?? 'Implementation Error', HttpStatus.INTERNAL_SERVER_ERROR);
  }
}
