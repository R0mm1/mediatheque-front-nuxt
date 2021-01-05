import { BookEntity } from '@/assets/ts/entity/BookEntity'

export interface GroupEntity {
    id?: number;
    books: (string | BookEntity)[];
    comment?: string;
}
