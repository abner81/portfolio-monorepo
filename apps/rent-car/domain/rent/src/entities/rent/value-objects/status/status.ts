import { ValueObject } from '@monorepo/arch/domain';
import { Guards } from '@monorepo/guards';
import { KeyValue } from '@monorepo/util';

export type StatusType = 'Reserved' | 'Paid' | 'In Progress' | 'Completed';
export const StatusType: KeyValue<StatusType> = Object.freeze<
  KeyValue<StatusType>
>({
  'In Progress': 'In Progress',
  Completed: 'Completed',
  Paid: 'Paid',
  Reserved: 'Reserved',
});

export type StatusProps = { status: StatusType };

export class Status extends ValueObject<StatusProps> {
  public get value() {
    return this.state.status;
  }

  public get isCompleted(): boolean {
    return this.state.status === 'Completed';
  }
  public get isPaid(): boolean {
    return this.state.status === 'Paid';
  }
  public get isReserved(): boolean {
    return this.state.status === 'Reserved';
  }
  public get isInProgress(): boolean {
    return this.state.status === 'In Progress';
  }

  protected parse({ status }: StatusProps): Required<StatusProps> {
    Guards.againstNullOrUndefined(status, 'status');
    Guards.ensureIsInEnum(status, StatusType, 'status');

    return { status };
  }

  export(): Required<StatusProps> {
    return { status: this.value };
  }
}
