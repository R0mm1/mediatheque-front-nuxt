export default class EntitiesDescriptor {
  entities: any[] = [];
  entityFields: string[] = [];
  searchParam?: string;
  fieldsSeparator: string = ' ';
  entityURI?: string;
  label: string = '';
  name: string = '';
  searchFieldPlaceholder: string = 'Rechercher une entité';
  formCreationValidationAction?: () => any;
  formCreationTitle: string = '';
}
