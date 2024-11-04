import { DomainException, ValueObject } from '@monorepo/arch/domain';
import { estados } from './uf-and-province-data';

export type ProvinceProps = {
  province: string;
};

export class Province extends ValueObject<ProvinceProps> {
  public get value() {
    return this.state.province;
  }

  protected parse(props: ProvinceProps): Required<ProvinceProps> {
    const { province } = props;

    if (!Object.values(estados).includes(province))
      throw new DomainException('Estado inválido.');

    return { province };
  }

  export(): Required<ProvinceProps> {
    return { province: this.value };
  }
}
