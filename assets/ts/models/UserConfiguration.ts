import { HydraCollection, HydraItem } from '~/assets/ts/models/HydraInterfaces'

export interface UserConfiguration<ValueType>{
  id?: number;
  name?: string;
  value?: ValueType;
}

export interface UserConfigurationItem<ValueType> extends UserConfiguration<ValueType>, HydraItem{}

export interface UserConfigurationCollection<ValueType> extends HydraCollection<UserConfiguration<ValueType>>{}
