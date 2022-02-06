import AbstractDescriptor from '@/assets/ts/form/AbstractDescriptor'

export default class SelectDescriptor extends AbstractDescriptor {
  static defaultSearchable: boolean = false

  descriptorType: string = 'SelectDescriptor'
  placeholder: string = ''
  options?: { [index: string]: string }
  optionsSource?: Promise<{ [index: string]: string }>
  searchable: boolean = SelectDescriptor.defaultSearchable
  defaultValue?: string
  noDefaultStyle: boolean = false
  editModeOn: boolean = true

  constructor (name: string, label: string = '') {
    super(name)

    this.label = label
  }

  setPlaceholder (placeholder: string) {
    this.placeholder = placeholder
    return this
  }

  setDefaultValue (defaultValue: string) {
    this.defaultValue = defaultValue
    return this
  }

  setNoDefaultStyle (noDefaultStyle: boolean) {
    this.noDefaultStyle = noDefaultStyle
    return this
  }
}
