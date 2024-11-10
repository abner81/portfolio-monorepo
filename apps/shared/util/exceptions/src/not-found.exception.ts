import { HttpStatus } from '@nestjs/common';
import { Exception } from './exception';

export class NotFoundException extends Exception {
  constructor(message?: string) {
    super(message ?? 'Not Found Error', HttpStatus.NOT_FOUND);
  }
}
