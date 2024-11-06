import { DomainException } from '@monorepo/arch/domain';
import isEmail from 'validator/lib/isEmail';
import valitor, { isJWT, isPostalCode } from 'validator';

export type GuardResponse = Error | void;

export interface IGuards {
  [method: string]: (...args: any[]) => GuardResponse;
}

export class Guards implements IGuards {
  [method: string]: (...args: any[]) => GuardResponse;

  static againstNullOrUndefined(
    argument: unknown,
    argumentName: string
  ): GuardResponse {
    if (argument == null)
      throw new DomainException(`${argumentName} é nulo ou indefinido.`);
  }

  static againstInvalidEmail(
    argument: string,
    argumentName = 'Email'
  ): GuardResponse {
    if (argument == null || !isEmail(argument))
      throw new DomainException(`${argumentName} inválido.`);
  }

  static ensureMinWords(
    minWords: number,
    argument: string,
    argumentName: string
  ): GuardResponse {
    if (
      typeof argument !== 'string' ||
      !(argument.split(/\s+/).length >= minWords)
    )
      throw new DomainException(
        `${argumentName} not satisfies a min words [${minWords} min words].`
      );
  }

  static ensureIsJwt(argument: string, argumentName: string): GuardResponse {
    if (typeof argument !== 'string' || !isJWT(argument))
      throw new DomainException(
        `${argumentName} not satisfies a valid JWT Token.`
      );
  }

  static ensureIsInteger(
    argument: number,
    argumentName: string,
    options?: validator.IsIntOptions
  ): GuardResponse {
    if (!valitor.isInt(String(argument), options))
      throw new DomainException(
        `${argumentName} not satisfies a valid integer value.`
      );
  }

  static againstEmptyArray(
    argument: Array<unknown> | ReadonlyArray<unknown>,
    argumentName: string
  ): GuardResponse {
    if (argument.length === 0)
      throw new DomainException(`Empty Array is not valid: [${argumentName}].`);
  }

  static ensureBrZipCode(
    argument: string | number,
    argumentName: string
  ): GuardResponse {
    if (!isPostalCode(String(argument), 'BR'))
      throw new DomainException(`:${argumentName} Is not Brazilian Zip Code.`);
  }

  static ensureIsBoolean(
    argument: boolean,
    argumentName: string
  ): GuardResponse {
    if (typeof argument !== 'boolean')
      throw new DomainException(`:${argumentName} is not valid boolean value.`);
  }

  static ensureIsInEnum(
    argument: string,
    enumObj: object,
    argumentName: string
  ): GuardResponse {
    if (!Object.keys(enumObj).some((possibility) => possibility === argument))
      throw new DomainException(`:${argumentName} is not compatible value.`);
  }
}
