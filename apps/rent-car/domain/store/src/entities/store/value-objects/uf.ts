import { DomainException, ValueObject } from '@monorepo/arch/domain';
import { estados, UFType } from './uf-and-province-data';

export type UFProps = {
  uf: UFType;
};

export class UF extends ValueObject<UFProps> {
  public get value() {
    return this.state.uf;
  }

  protected parse(props: UFProps): Required<UFProps> {
    const { uf } = props;

    if (!Object.keys(estados).includes(uf))
      throw new DomainException('UF inválido.');

    return { uf };
  }

  export(): Required<UFProps> {
    return { uf: this.value };
  }
}
