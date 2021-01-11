import SelectDescriptor from '@/assets/ts/form/SelectDescriptor'

export default class LeftActionBarFormSelectDescriptor extends SelectDescriptor {
  static descriptorType = 'LeftActionBarFormSelectDescriptor';

  descriptorType = LeftActionBarFormSelectDescriptor.descriptorType;

  constructor (name: string, options: { [index: string]: string }, label: string = '') {
    super(name, label)

    this.options = options
    this.noLabel = true

    return this
  }
}
