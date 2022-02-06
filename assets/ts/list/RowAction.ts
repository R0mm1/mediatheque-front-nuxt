export default class RowAction {
  id: string
  label: string
  iconClassname: string
  confirmMessage: string = ''
  needConfirm: boolean = false

  /**
     * Define if the action button has to be displayed. The parameter gave to the method is the json object
     * corresponding to the row data
     * @param object
     */
  isDisplayed: Function = (object: object) => true

  constructor (id: string, label: string, iconClassname: string) {
    this.id = id
    this.label = label
    this.iconClassname = iconClassname
  }

  setNeedConfirm (needConfirm: boolean, confirmMessage: string = '') {
    this.needConfirm = needConfirm

    if (this.needConfirm) {
      if (confirmMessage.length === 0) { throw 'No confirmation message provided' }
      this.confirmMessage = confirmMessage
    }

    return this
  }

  setIsDisplayed (isDisplayed: Function) {
    this.isDisplayed = isDisplayed
    return this
  }
}
