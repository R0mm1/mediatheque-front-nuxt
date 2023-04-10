import AbstractDescriptor from '@/assets/ts/form/AbstractDescriptor'
import ButtonHrefDescriptor from '~/assets/ts/form/ButtonHrefDescriptor'

export type ButtonStyle = 'normal' | 'negative' | 'icon-round';
export type ButtonRoundedCorner = Boolean | Number; // Number to specify the value to use in CSS, true to use default value, false to deactivate

export default class ButtonDescriptor extends AbstractDescriptor {
  static descriptorType = 'ButtonDescriptor'

  static readonly typeButton = 'button'
  static readonly typeSubmit = 'submit'

  descriptorType = ButtonDescriptor.descriptorType
  type: ('button' | 'submit') = ButtonDescriptor.typeButton
  value: string = ''
  disabled: boolean = false
  customClasses: string[] = []
  style: ButtonStyle = 'normal'
  noDefaultStyle: boolean = false
  href?: ButtonHrefDescriptor = undefined

  constructor (name: string, value?: string, type?: string) {
    super(name)

    if (typeof value !== 'undefined') {
      this.value = value
    }

    if (typeof type !== 'undefined') {
      if (type !== ButtonDescriptor.typeButton && type !== ButtonDescriptor.typeSubmit) {
        throw new Error('Invalid type ' + type + ' provided')
      }
      this.type = type
    }
  }

  addCustomClass (customClass: string) {
    this.customClasses.push(customClass)
    return this
  }

  setValue (value: string) {
    this.value = value
    return this
  }

  setNoDefaultStyle (noDefaultStyle: boolean) {
    this.noDefaultStyle = noDefaultStyle
    return this
  }

  setHref (href: ButtonHrefDescriptor) {
    this.href = href
    return this
  }

  setStyle (style: ButtonStyle) {
    this.style = style
    return this
  }
}
