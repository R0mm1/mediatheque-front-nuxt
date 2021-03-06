import AbstractDescriptor from '@/assets/ts/form/AbstractDescriptor'

export type ButtonStyle = 'normal' | 'negative';
export type ButtonRoundedCorner = Boolean | Number; // Number to specify the value to use in CSS, true to use default value, false to deactivate

export default class ButtonDescriptor extends AbstractDescriptor {
  static descriptorType = 'ButtonDescriptor';

  static readonly typeButton = 'button';
  static readonly typeSubmit = 'submit';

  descriptorType = ButtonDescriptor.descriptorType;
  type: ('button' | 'submit') = ButtonDescriptor.typeButton;
  value: string = '';
  disabled: boolean = false;
  customClasses: string[] = [];
  style: ButtonStyle = 'normal';
  noDefaultStyle: boolean = false;

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
}
