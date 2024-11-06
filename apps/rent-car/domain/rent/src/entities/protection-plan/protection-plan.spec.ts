import { EntityId } from '@monorepo/value-objects';
import { ProtectionPlan, ProtectionPlanProps } from './protection-plan';
import { DomainException } from '@monorepo/arch/domain';

describe('ProtectionPlan Value Object', () => {
  const props: ProtectionPlanProps = {
    additionalPercentage: 8,
    id: EntityId.create().value,
    description: 'Fiat Mobi, VW Up e similares.',
    name: 'Grupo Econômico',
  };

  it('should render ProtectionPlan with correct values and validations', () => {
    const valid = new ProtectionPlan(props);
    expect(valid).toBeDefined();
  });

  it('should throw error if passed invalid params', () => {
    const minPercentageInvalid = () =>
      new ProtectionPlan({ ...props, additionalPercentage: 0.8 });
    const maxPercentageInvalid = () =>
      new ProtectionPlan({ ...props, additionalPercentage: 101 });

    expect(minPercentageInvalid).toThrow(DomainException);
    expect(maxPercentageInvalid).toThrow(DomainException);
  });
});
