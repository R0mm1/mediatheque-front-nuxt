import { Book } from '~/assets/ts/models/Book'
import { HydraCollection, HydraItem } from '~/assets/ts/models/HydraInterfaces'

export interface BookPaper extends Book{ }

export interface BookPaperItem extends BookPaper, HydraItem{}

export interface BookPaperCollection extends HydraCollection<BookPaper>{}
