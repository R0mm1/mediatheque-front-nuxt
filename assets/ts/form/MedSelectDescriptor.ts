import AbstractDescriptor from '~/assets/ts/form/AbstractDescriptor'

export interface SelectValue {
  label: string,
  key: string,
  value: any,
  default?: boolean
}

export default class MedSelectDescriptor extends AbstractDescriptor {
  descriptorType: string = 'MedSelectDescriptor'

  options?: Promise<SelectValue[]> | SelectValue[]
  editModeOn: boolean = true
  formCreationValidationAction?: (formCreationData: any) => Promise<SelectValue>
  formCreationTitle: string = ''
  formCreationSchema: any[] = []

  setOptions (options: Promise<SelectValue[]> | SelectValue[]) {
    this.options = options
    return this
  }

  getOptions () {
    if (Array.isArray(this.options)) {
      return Promise.resolve(this.options)
    } else if (typeof this.options !== 'undefined') {
      return this.options
    }
    return Promise.resolve(undefined)
  }
}
