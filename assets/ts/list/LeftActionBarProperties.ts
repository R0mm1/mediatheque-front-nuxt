import LeftActionBarElement from '~/assets/ts/list/LeftActionBarElement'

export default class LeftActionBarProperties {
  hasAddButton: boolean

  customElements: LeftActionBarElement[]

  constructor (customElements: LeftActionBarElement[] = [], hasAddButton: boolean = true) {
    this.customElements = customElements
    this.hasAddButton = hasAddButton
  }

  setHasAddButton (hasAddButton :boolean) {
    this.hasAddButton = hasAddButton
    return this
  }
}
