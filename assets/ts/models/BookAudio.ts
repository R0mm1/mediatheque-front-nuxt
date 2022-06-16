import { Book, BookWithFile } from '~/assets/ts/models/Book'
import { HydraCollection, HydraItem } from '~/assets/ts/models/HydraInterfaces'

export interface BookAudio extends Book, BookWithFile{
}

export interface BookAudioItem extends BookAudio, HydraItem{}

export interface BookAudioCollection extends HydraCollection<BookAudio>{}
