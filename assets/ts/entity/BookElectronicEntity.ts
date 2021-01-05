import { BookEntity } from '@/assets/ts/entity/BookEntity'
import { FileEntity } from '@/assets/ts/entity/FileEntity'

export interface BookElectronicEntity extends BookEntity {
    // null can be useful to "activate" the prop reactivity on the stores states
    bookFile?: string | FileEntity | null;

    hasBookFile: boolean;
}
