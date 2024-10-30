import { DomainObject } from './domain-object';
import { IEquals } from './i-equal';

export abstract class ValueObject<
    TProps extends object,
    TState = Required<TProps>,
    TExport extends TProps = Required<TProps>
  >
  extends DomainObject<TProps, TState, TExport>
  implements IEquals
{
  protected override get state(): Readonly<TState> {
    return super.state;
  }

  equals(other: unknown): other is this {
    if (typeof other !== typeof this) return false;

    return JSON.stringify(this) === JSON.stringify(other);
  }

  protected override parseAndStore(props: TProps): void {
    super.parseAndStore(props);
    Object.freeze(this);
  }
}
