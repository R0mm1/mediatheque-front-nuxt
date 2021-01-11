export interface AuthorBook{
  ['@type']: string;
  ['@id']: string;
  id: number;
  title: string;
}

export interface AuthorEntity {
    id?: number;
    firstname?: string;
    lastname?: string;
    books: AuthorBook[];
}
