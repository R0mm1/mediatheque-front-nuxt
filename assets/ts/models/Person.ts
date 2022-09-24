import { HydraItem } from '~/assets/ts/models/HydraInterfaces'

export default interface Person {
  id?: string
  lastname?: string
  firstname?: string
  birthYear?: string,
  deathYear?: string,
  biography?: string
}

export interface PersonItem extends Person, HydraItem {}
