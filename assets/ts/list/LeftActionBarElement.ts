import LeftActionBarFormSelectDescriptor from '~/assets/ts/list/LeftActionBarFormSelectDescriptor'
import ButtonDescriptor from '~/assets/ts/form/ButtonDescriptor'
import { FilterValue } from '~/assets/ts/list/Filter'
import LeftActionBarSeparatorDescriptor from '~/assets/ts/list/LeftActionBarSeparatorDescriptor'

type ElementType = ('element' | 'filter' | 'separator')
type FormElementDescriptorType = (LeftActionBarFormSelectDescriptor | ButtonDescriptor | LeftActionBarSeparatorDescriptor)
type CallbackType = (...args: any[]) => FilterValue

export default class LeftActionBarElement {
  type: ElementType
  callback: CallbackType
  formElementDescriptor: FormElementDescriptorType

  constructor (type: ElementType, callback: CallbackType, formElementDescriptor: FormElementDescriptorType) {
    this.type = type
    this.callback = callback
    this.formElementDescriptor = formElementDescriptor
  }
}
