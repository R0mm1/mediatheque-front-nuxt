export default class ChipsDescriptor {
  entities: any[] = [];
  entityFields: string[] = [];
  searchParam?: string;
  fieldsSeparator: string = ' ';
  entityURI?: string;
  label: string = '';
  name: string = '';
  searchFieldPlaceholder: string = 'Rechercher une entité';
  formCreationValidationAction?: (formCreationData: any) => Promise<any>;
  formCreationTitle: string = '';
  formCreationSchema: any[] = [];
}
