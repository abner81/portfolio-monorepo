import { DomainException } from '@monorepo/arch/domain';
import isEmail from 'validator/lib/isEmail';
import { isJWT } from 'validator';

export type GuardResponse = Error | void;

export interface IGuards {
  [method: string]: (...args: any[]) => GuardResponse;
}

export class Guards implements IGuards {
  [method: string]: (...args: any[]) => GuardResponse;

  static againstNullOrUndefined(
    argument: unknown,
    argumentName: string,
  ): GuardResponse {
    if (argument == null)
      throw new DomainException(`${argumentName} é nulo ou indefinido.`);
  }

  static againstInvalidEmail(
    argument: string,
    argumentName: string = 'Email',
  ): GuardResponse {
    if (argument == null || !isEmail(argument))
      throw new DomainException(`${argumentName} inválido.`);
  }

  static ensureMinWords(
    minWords: number,
    argument: string,
    argumentName: string,
  ): GuardResponse {
    if (
      typeof argument !== 'string' ||
      !(argument.split(/\s+/).length >= minWords)
    )
      throw new DomainException(
        `${argumentName} not satisfies a min words [${minWords} min words].`,
      );
  }

  static ensureIsJwt(argument: string, argumentName: string): GuardResponse {
    if (typeof argument !== 'string' || !isJWT(argument))
      throw new DomainException(
        `${argumentName} not satisfies a valid JWT Token.`,
      );
  }
}
