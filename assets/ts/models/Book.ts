import { FileEntity } from '~/assets/ts/entity/FileEntity'
import { UserEntity } from '~/assets/ts/entity/UserEntity'
import { GroupEntity } from '~/assets/ts/entity/GroupEntity'
import { HydraCollection, HydraItem } from '~/assets/ts/models/HydraInterfaces'
import { EditorItem } from '~/assets/ts/models/Editor'
import { Author } from '~/assets/ts/models/Author'

export interface Book {
  id?: number;
  title?: string;
  year?: string;
  pageCount?: number;
  isbn?: string;
  language?: string;
  summary?: string;
  authors: Author[];
  // null can be useful to "activate" the prop reactivity on the stores states
  cover?: string | FileEntity | null;
  owner?: string | UserEntity | null;
  groups: GroupEntity[];
  shortSummary?:string;
  editor?: EditorItem | null
}

export interface BookItem extends Book, HydraItem{}

export interface BookCollection extends HydraCollection<Book>{}

export interface BookWithFile{
  // null can be useful to "activate" the prop reactivity on the stores states
  bookFile?: string | FileEntity | null;
  hasBookFile: boolean;
}
