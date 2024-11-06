import { EntityId } from '@monorepo/value-objects';
import { Vehicle, VehicleProps } from './vehicle';
import { DomainException } from '@monorepo/arch/domain';

describe('RentCar - Vehicle Entity', () => {
  const props: VehicleProps = {
    name: 'Fiat Argo',
    year: new Date().getFullYear() - Vehicle.RULES.maxAgeInYears,
    id: EntityId.create().value,
    vehicleGroupId: EntityId.create().value,
    storeId: EntityId.create().value,
    licensePlate: 'aaa-2323',
  };

  it('should render Vehicle with correct values and validations', () => {
    const valid = new Vehicle(props);
    const invalidName = () => new Vehicle({ ...props, name: 'Argo' });
    const invalidYear = () => new Vehicle({ ...props, year: props.year - 1 });

    expect(valid).toBeDefined();
    expect(invalidName).toThrow(DomainException);
    expect(invalidYear).toThrow(DomainException);
  });
});
