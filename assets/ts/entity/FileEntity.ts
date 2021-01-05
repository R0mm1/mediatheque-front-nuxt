export interface FileEntity {
    [key: string]: any;

    ['@id']?: string;

    id: number;
    path: string;
}
