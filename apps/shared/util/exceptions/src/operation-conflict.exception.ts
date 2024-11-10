import { HttpStatus } from '@nestjs/common';
import { Exception } from './exception';

export class OperationConflictException extends Exception {
  constructor(message?: string) {
    super(message ?? 'operation Conflict Error', HttpStatus.CONFLICT);
  }
}
