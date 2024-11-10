import { ErrorHttpStatusCode } from '@nestjs/common/utils/http-error-by-code.util';

export class Exception extends Error {
  private _statusCode: ErrorHttpStatusCode;

  public get statusCode() {
    return this._statusCode;
  }

  constructor(message: string, statusCode: ErrorHttpStatusCode) {
    super(message);

    this.name = this.constructor.name;
    this._statusCode = statusCode;
  }
}
