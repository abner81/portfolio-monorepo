import { EntityId } from '@monorepo/value-objects';
import { Rent, RentProps } from './rent';

describe('Rent Entity', () => {
  const props: RentProps = {
    id: EntityId.create().value,
  };

  it('should render Rent with correct values and validations', () => {
    const valid = new Rent(props);

    expect(valid).toBeDefined();
  });
});