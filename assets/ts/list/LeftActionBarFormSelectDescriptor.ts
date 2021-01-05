import SelectDescriptor from '@/assets/ts/form/SelectDescriptor'

export default class LeftActionBarFormSelectDescriptor extends SelectDescriptor {
    descriptorType = 'LeftActionBarFormSelectDescriptor';

    constructor (name: string, options: { [index: string]: string }, label: string = '') {
      super(name, label)

      this.options = options
      this.noLabel = true

      return this
    }
}
