import AbstractDescriptor from '~/assets/ts/form/AbstractDescriptor'

export interface SelectValue{
  label: string,
  key: string,
  value: any
}

export default class MedSelectDescriptor extends AbstractDescriptor {
  descriptorType: string = 'MedSelectDescriptor'

  options?: Promise<SelectValue[]> | SelectValue[]
  editModeOn: boolean = true
  formCreationValidationAction?: (formCreationData: any) => Promise<SelectValue>
  formCreationTitle: string = ''
  formCreationSchema: any[] = []
}
