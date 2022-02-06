import { AuthorEntity, FileEntity, UserEntity } from './module'
import { GroupEntity } from '@/assets/ts/entity/GroupEntity'
import { Entity } from '@/assets/ts/entity/Entity'

export interface BookEntity extends Entity {

    id?: number;
    title?: string;
    year?: string;
    pageCount?: number;
    isbn?: string;
    language?: string;
    summary?: string;
    authors: AuthorEntity[];
    // null can be useful to "activate" the prop reactivity on the stores states
    cover?: string | FileEntity | null;
    owner?: string | UserEntity | null;
    groups: GroupEntity[];
    shortSummary?:string;
}
