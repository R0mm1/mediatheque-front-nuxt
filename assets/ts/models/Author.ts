import { HydraCollection, HydraItem } from '~/assets/ts/models/HydraInterfaces'
import { PersonItem } from '~/assets/ts/models/Person'

export interface AuthorBook {
  ['@type']: string;
  ['@id']: string;
  id: number;
  title: string;
}

export interface Author {
  id?: number;
  person: PersonItem
  books?: AuthorBook[]
}

export interface AuthorItem extends Author, HydraItem{}

export interface AuthorCollection extends HydraCollection<Author>{}
