import { ValueObject } from '@monorepo/arch/domain';
import { Guards } from '@monorepo/guards';

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
  public get name() {
    return this.state.name;
  }
  public get description() {
    return this.state.description;
  }
  public get additionalPercentage() {
    return this.state.additionalPercentage;
  }

  protected parse(props: ProtectionPlanProps): ProtectionPlanState {
    const { additionalPercentage, description, name } = props;

    Guards.againstNullOrUndefined(additionalPercentage, 'additionalPercentage');
    Guards.againstNullOrUndefined(description, 'description');
    Guards.againstNullOrUndefined(name, 'name');

    Guards.ensureIsInteger(additionalPercentage, 'additionalPercentage', {
      min: 1,
      max: 100,
    });

    return { additionalPercentage, description, name };
  }

  export(): Required<ProtectionPlanProps> {
    return {
      additionalPercentage: this.additionalPercentage,
      description: this.description,
      name: this.name,
    };
  }
}
