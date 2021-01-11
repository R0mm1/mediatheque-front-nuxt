export type FilterValue = string|null;

export default class Filter {
    property: string;
    value: FilterValue;

    constructor (property: string, value: FilterValue) {
      this.property = property
      this.value = value
    }
}
