import { DomainException } from '@monorepo/arch/domain';
import { Status, StatusProps, StatusType } from './status';

describe('Status Value Object', () => {
  const props: StatusProps = { status: 'Reserved' };

  it('should render Status with correct values', () => {
    const statusSut = new Status(props);
    expect(statusSut.value).toBe(props.status);

    expect(statusSut.isReserved).toBeTruthy();
    expect(statusSut.isCompleted).toBeFalsy();
    expect(statusSut.isInProgress).toBeFalsy();
    expect(statusSut.isPaid).toBeFalsy();
  });

  it('should throw error with passed incorrect status', () => {
    const invalid = () => new Status({ status: 'any' as StatusType });
    const empty = () => new Status({ status: '' as StatusType });

    expect(invalid).toThrow(DomainException);
    expect(empty).toThrow(DomainException);
  });
});
