import { HydraCollection, HydraItem } from '~/assets/ts/models/HydraInterfaces'

export interface User{
  id?: number;
  firstname?: string;
  lastname?: string;
}

export interface UserItem extends User, HydraItem{}

export interface UserCollection extends HydraCollection<User>{}
