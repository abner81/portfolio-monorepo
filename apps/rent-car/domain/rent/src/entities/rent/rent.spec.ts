import { EntityId } from '@monorepo/value-objects';
import { Rent, RentProps } from './rent';

describe('Rent Entity', () => {
  const props: RentProps = {
    rentalPeriod: {
      end: new Date('2024-10-04'),
      start: new Date('2024-10-06'),
      numberOfDays: 2,
    },
    userId: EntityId.create().value,
    vehicleGroupId: EntityId.create().value,
    id: EntityId.create().value,
    status: 'Reserved',
    createdAt: new Date(),
  };

  it('should render Rent with correct values and validations', () => {
    const valid = new Rent(props);
    expect(valid).toBeDefined();
  });
});
