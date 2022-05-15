export default class RowAction {
  id: string
  label: string
  iconClassname: string

  /**
   * Define if the action button has to be displayed. The parameter gave to the method is the json object
   * corresponding to the row data
   */
  isDisplayed: Function = () => true

  constructor (id: string, label: string, iconClassname: string) {
    this.id = id
    this.label = label
    this.iconClassname = iconClassname
  }

  setIsDisplayed (isDisplayed: Function) {
    this.isDisplayed = isDisplayed
    return this
  }
}
