import { Entity } from '@/assets/ts/entity/Entity'
import { BookPaperEntity } from '@/assets/ts/entity/BookPaperEntity'
import { BookElectronicEntity } from '@/assets/ts/entity/BookElectronicEntity'

export interface BookNotationEntity extends Entity {

    ['@id']?: string;
    ['@type']?: string;

    id?: number;
    book?: string | BookPaperEntity | BookElectronicEntity;
    note?: Number;
}
