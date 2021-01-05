import LeftActionBarElement from '@/assets/ts/list/LeftActionBarElement'
import LeftActionBarSeparator from '@/assets/ts/list/LeftActionBarSeparator'

export default class LeftActionBarProperties {
    hasAddButton: boolean;

    customElements: (LeftActionBarElement | LeftActionBarSeparator)[];

    constructor (customElements: (LeftActionBarElement | LeftActionBarSeparator)[] = [], hasAddButton: boolean = true) {
      this.customElements = customElements
      this.hasAddButton = hasAddButton
    }
}
