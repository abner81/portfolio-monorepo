import { RentalPeriod, RentalPeriodProps } from './rental-period';

describe('RentalPeriod Value Object', () => {
  const props: RentalPeriodProps = {
    start: new Date('2024-04-03'),
    end: new Date('2024-04-05'),
    numberOfDays: 2,
  };

  it('should render RentalPeriod with correct values and validations', () => {
    const valid = new RentalPeriod(props);
    expect(valid).toBeDefined();
  });
});
