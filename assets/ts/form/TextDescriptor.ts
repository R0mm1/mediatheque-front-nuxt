import AbstractDescriptor from '~/assets/ts/form/AbstractDescriptor'

export default class TextDescriptor extends AbstractDescriptor {
  static readonly typeText = 'text';
  static readonly typePassword = 'password';

  placeholder: string = '';
  disabled: boolean = false;
  noDefaultStyle: boolean = false;
  withCopyContentButton: boolean = false;
  type: ('text'|'password') = TextDescriptor.typeText;
  editModeOn: boolean = true;

  // eslint-disable-next-line no-useless-constructor
  public constructor (name: string) {
    super(name)
  }

  setPlaceholder (placeholder: string) {
    this.placeholder = placeholder
    return this
  }

  setDisabled (disabled: boolean) {
    this.disabled = disabled
    return this
  }

  setNoDefaultStyle (noDefaultStyle: boolean) {
    this.noDefaultStyle = noDefaultStyle
    return this
  }

  setWithCopyContentButton (withCopyContentButton: boolean) {
    this.withCopyContentButton = withCopyContentButton
    return this
  }

  setType (type: ('text'|'password')) {
    this.type = type
    return this
  }

  setEditModeOn (editModeOn: boolean) {
    this.editModeOn = editModeOn
    return this
  }
}
