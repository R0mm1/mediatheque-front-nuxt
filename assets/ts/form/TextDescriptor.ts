import AbstractDescriptor from '~/assets/ts/form/AbstractDescriptor'

export default class TextDescriptor extends AbstractDescriptor {
  static readonly typeText = 'text'
  static readonly typePassword = 'password'

  placeholder: string = ''
  disabled: boolean = false
  noDefaultStyle: boolean = false
  withCopyContentButton: boolean = false
  type: ('text'|'password') = TextDescriptor.typeText
  editModeOn: boolean = true
  error: string | null = null
  private _dataCy: string = ''

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

  setError (error: string | null) {
    this.error = error
    return this
  }

  setDataCy (dataCy: string) {
    this.dataCy = dataCy
    return this
  }

  set dataCy (dataCy: string) {
    this._dataCy = dataCy
  }

  get dataCy () {
    return this._dataCy.length === 0 ? 'input-' + this.type : this._dataCy
  }
}
