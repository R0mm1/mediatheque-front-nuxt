import AbstractDescriptor from '~/assets/ts/form/AbstractDescriptor'

export default class LeftActionBarLinkDescriptor extends AbstractDescriptor {
  static descriptorType = 'LeftActionBarLinkDescriptor'

  descriptorType = LeftActionBarLinkDescriptor.descriptorType

  constructor (public name: string, label: string, public to: string) {
    super(name)

    this.setLabel(label)

    return this
  }
}
