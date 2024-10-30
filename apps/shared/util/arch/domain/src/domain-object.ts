import { isObject } from 'core/util/object';
import { DomainException } from './domain.exception';
import {
  ImplementationException,
  InternalException,
} from '@monorepo/exceptions';

export abstract class DomainObject<
  TProps extends object,
  TState = Required<TProps>,
  TExport extends TProps = Required<TProps>
> {
  private _state: TState;
  protected get state(): TState {
    return this._state;
  }

  constructor(props: TProps) {
    this.parseAndStore(props);
  }

  protected abstract parse(props: TProps): TState;
  abstract export(): TExport;

  toString(): string {
    const state = this._state;
    return String(state);
  }

  toJSON() {
    return this.export();
  }

  protected parseAndStore(props: TProps) {
    if (!isObject(props)) {
      const message =
        'Construtor expects an object, but received: ' + typeof props;
      throw new DomainException(message);
    }

    let state: TState;

    try {
      state = this._state = this.parse(props);
    } catch (error) {
      if (error instanceof DomainException) throw error;
      else if (error instanceof InternalException) throw error;
      else throw new DomainException(error?.message);
    }

    if (isObject(state) && (state as unknown) === props)
      throw new ImplementationException('Return props object is not allowed.');
  }
}
