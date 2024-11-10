import { HttpStatus } from '@nestjs/common';
import { Exception } from './exception';

export class UnauthorizedException extends Exception {
  constructor(message?: string) {
    super(message ?? 'Unauthorized Error', HttpStatus.UNAUTHORIZED);
  }
}
