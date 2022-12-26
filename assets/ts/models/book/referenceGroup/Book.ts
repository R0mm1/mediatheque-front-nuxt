import { ReferenceGroup } from '~/assets/ts/models/book/ReferenceGroup'
import { BookItem } from '~/assets/ts/models/Book'
import { HydraCollection, HydraItem } from '~/assets/ts/models/HydraInterfaces'

export interface ReferenceGroupBook{
  id: string
  book: string | Partial<BookItem>
  position: number
  referenceGroup: string | Partial<ReferenceGroup>
}

export interface ReferenceGroupBookItem extends ReferenceGroupBook, HydraItem{}

export interface ReferenceGroupBookCollection extends HydraCollection<ReferenceGroupBook>{}
