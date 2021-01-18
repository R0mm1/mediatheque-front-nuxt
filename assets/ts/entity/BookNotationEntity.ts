import { Entity } from '@/assets/ts/entity/Entity'
import { BookPaper } from '~/assets/ts/models/BookPaper'
import { BookElectronic } from '~/assets/ts/models/BookElectronic'

export interface BookNotationEntity extends Entity {

    ['@id']?: string;
    ['@type']?: string;

    id?: number;
    book?: string | BookPaper | BookElectronic;
    note?: Number;
}
