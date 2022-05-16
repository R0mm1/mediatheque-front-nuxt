import { BookPaper } from '~/assets/ts/models/BookPaper'
import { BookElectronic } from '~/assets/ts/models/BookElectronic'

export interface GroupEntity {
    id?: number;
    books: (string | BookPaper | BookElectronic)[];
    comment?: string;
}
