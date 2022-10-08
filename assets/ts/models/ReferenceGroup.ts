import { HydraCollection, HydraItem } from '~/assets/ts/models/HydraInterfaces'

export interface ReferenceGroupBook {
  ['@type']: string;
  ['@id']: string;
  id: number;
  title: string;
}

export interface ReferenceGroup {
  id?: number;
  books: (string | ReferenceGroupBook)[];
  comment?: string;
}

export interface ReferenceGroupItem extends ReferenceGroup, HydraItem{}

export interface ReferenceGroupCollection extends HydraCollection<ReferenceGroup>{}
