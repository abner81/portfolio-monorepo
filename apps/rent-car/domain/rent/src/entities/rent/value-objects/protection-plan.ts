import { ValueObject } from '@monorepo/arch/domain';

export type ProtectionPlanProps = {
  name: string;
  description: string;
  additionalPercentage: number;
};

export type ProtectionPlanState = {
  name: string;
  description: string;
  additionalPercentage: number;
};

export class ProtectionPlan extends ValueObject<
  ProtectionPlanProps,
  ProtectionPlanState
> {
  protected override parse(props: ProtectionPlanProps): ProtectionPlanState {
    throw new Error('Method not implemented.');
  }
  override export(): Required<ProtectionPlanProps> {
    throw new Error('Method not implemented.');
  }
}
