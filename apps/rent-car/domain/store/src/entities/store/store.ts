import { Entity } from '@monorepo/arch/domain';
import { EntityId, EntityIdProps } from '@monorepo/value-objects';
import { Address, AddressProps } from '../store/value-objects/address';
import {
  OpeningHours,
  OpeningHoursProps,
} from '../store/value-objects/opening-hours';
import { Province, ProvinceProps } from './value-objects/province';
import { UF, UFProps } from './value-objects/uf';
import { Guards } from '@monorepo/guards';

export type StoreProps = {
  description: string;
  city: string;
  address: AddressProps;
  openingHours: OpeningHoursProps;
} & EntityIdProps &
  ProvinceProps &
  UFProps;

export type StoreState = {
  description: string;
  city: string;
  province: Province;
  address: Address;
  openingHours: OpeningHours;
  uf: UF;
  id: EntityId;
  tags: ReadonlyArray<string>;
};

export class Store extends Entity<StoreProps, StoreState> {
  public get description() {
    return this.state.description;
  }

  public get city() {
    return this.state.city;
  }

  public get address() {
    return this.state.address;
  }

  public get openingHours() {
    return this.state.openingHours;
  }

  public get province() {
    return this.state.province;
  }

  public get uf() {
    return this.state.uf;
  }

  public get id() {
    return this.state.id;
  }

  public get tags() {
    return this.state.tags;
  }

  protected parse(props: StoreProps): StoreState {
    const { city, description } = props;

    Guards.againstNullOrUndefined(city, 'city');
    Guards.againstNullOrUndefined(description, 'description');

    const address = new Address(props.address);
    const openingHours = new OpeningHours(props.openingHours);
    const province = new Province(props);
    const uf = new UF(props);
    const id = new EntityId(props);

    const tags = [description, city, uf.value, province.value];

    return { address, city, description, id, openingHours, province, uf, tags };
  }

  export(): Required<StoreProps> {
    return {
      address: this.address.export(),
      city: this.city,
      description: this.description,
      ...this.id.export(),
      openingHours: this.openingHours,
      province: this.province.value,
      uf: this.uf.value,
    };
  }
}
