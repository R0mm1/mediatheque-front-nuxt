import AbstractDescriptor from '@/assets/ts/form/AbstractDescriptor'

export default class LeftActionBarElement {
    callback!: Function;
    elementDescriptor!: AbstractDescriptor;

    constructor (callback: Function, elementDescriptor: AbstractDescriptor) {
      this.callback = callback
      this.elementDescriptor = elementDescriptor
    }
}
