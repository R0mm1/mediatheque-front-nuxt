export interface Entity {
    [key: string]: any;

    '@id'?: string; // Corresponding to the IRI
    '@type'?: string;
}
