import { DomainEvent } from './domain-event';
import { DomainObject } from './domain-object';

export abstract class Entity<
  TProps extends object,
  TState = Required<TProps>,
  TExport extends TProps = Required<TProps>
> extends DomainObject<TProps, TState, TExport> {
  private _domainEvents: DomainEvent<object>[] = [];

  get domainEvents(): ReadonlyArray<DomainEvent<object>> {
    return [...this._domainEvents];
  }

  protected addDomainEvent<T extends object>(
    domainEvent: DomainEvent<T>
  ): void {
    this._domainEvents.push(domainEvent);
  }

  clone() {
    const constructor = this.constructor as any;
    return new constructor(this.export()) as this;
  }
}
