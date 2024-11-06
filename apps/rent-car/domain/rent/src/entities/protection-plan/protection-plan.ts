import { Entity } from '@monorepo/arch/domain';
import { Guards } from '@monorepo/guards';
import { EntityId, EntityIdProps } from '@monorepo/value-objects';

export type ProtectionPlanProps = {
  name: string;
  description: string;
  additionalPercentage: number;
} & EntityIdProps;

export type ProtectionPlanState = {
  name: string;
  description: string;
  additionalPercentage: number;
  id: EntityId;
};

export class ProtectionPlan extends Entity<
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
  public get id() {
    return this.state.id;
  }
  protected parse(props: ProtectionPlanProps): ProtectionPlanState {
    const { additionalPercentage, description, name } = props;
    const id = new EntityId(props);

    Guards.againstNullOrUndefined(description, 'description');
    Guards.againstNullOrUndefined(name, 'name');

    Guards.againstNullOrUndefined(additionalPercentage, 'additionalPercentage');
    Guards.ensureIsInteger(additionalPercentage, 'additionalPercentage', {
      min: 1,
      max: 100,
    });

    return { additionalPercentage, description, name, id };
  }

  export(): Required<ProtectionPlanProps> {
    return {
      additionalPercentage: this.additionalPercentage,
      description: this.description,
      name: this.name,
      id: this.id.value,
    };
  }
}
