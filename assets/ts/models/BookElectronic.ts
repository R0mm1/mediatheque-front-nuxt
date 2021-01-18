import { Book } from '~/assets/ts/models/Book'
import { HydraCollection, HydraItem } from '~/assets/ts/models/HydraInterfaces'
import { FileEntity } from '~/assets/ts/entity/FileEntity'

export interface BookElectronic extends Book{
  // null can be useful to "activate" the prop reactivity on the stores states
  bookFile?: string | FileEntity | null;

  hasBookFile: boolean;
}

export interface BookElectronicItem extends BookElectronic, HydraItem{}

export interface BookElectronicCollection extends HydraCollection<BookElectronic>{}
