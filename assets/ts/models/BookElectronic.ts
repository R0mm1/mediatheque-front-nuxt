import { Book, BookWithFile } from '~/assets/ts/models/Book'
import { HydraCollection, HydraItem } from '~/assets/ts/models/HydraInterfaces'

export interface BookElectronic extends Book, BookWithFile{
}

export interface BookElectronicItem extends BookElectronic, HydraItem{}

export interface BookElectronicCollection extends HydraCollection<BookElectronic>{}
