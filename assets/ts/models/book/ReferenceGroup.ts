import { HydraCollection, HydraItem } from '~/assets/ts/models/HydraInterfaces'
import { ReferenceGroupBookItem } from '~/assets/ts/models/book/referenceGroup/Book'

export interface ListReferenceGroup {
  id: number
  comment: string
}

export interface ReferenceGroup extends ListReferenceGroup{
  elements: ReferenceGroupBookItem[]
}

export interface ReferenceGroupItem extends ReferenceGroup, HydraItem{}

export interface ReferenceGroupCollection extends HydraCollection<ReferenceGroup>{}
