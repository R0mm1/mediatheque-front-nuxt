export default class ChipsDescriptor {
  entities: any[] = []
  entityFields: string[] | {[index: string]: string[]} = []
  searchParam?: string
  fieldsSeparator: string = ' '
  entityURI?: string
  label: string = ''
  name: string = ''
  searchFieldPlaceholder: string = 'Rechercher une entité'
  formCreationValidationAction?: (formCreationData: any) => Promise<any>
  formCreationTitle: string = ''
  formCreationSchema: any[] = []
  editModeOn: boolean = true

  setEditModeOn (editModeOn: boolean) {
    this.editModeOn = editModeOn
    return this
  }
}
