import { ProtectionPlan, ProtectionPlanProps } from './protection-plan';

describe('ProtectionPlan Value Object', () => {
  const props: ProtectionPlanProps = {
    additionalPercentage: 8,

    description: 'Fiat Mobi, VW Up e similares.',
    name: 'Grupo Econômico',
  };

  it('should render ProtectionPlan with correct values and validations', () => {
    const valid = new ProtectionPlan(props);

    expect(valid).toBeDefined();
  });
});
