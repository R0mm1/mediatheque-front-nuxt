/**
 * This class is meant to give indication about witch data to extract from the API's json response. It's to be used
 * with the Column class.
 */
export default class DataSubProperty {
    name: string;
    children: DataSubProperty[];

    // If we have multiple children, their values will be joined together with this string
    childrenJoinValueSeparator: string;

    // If a children give access to an array of object, for each object the values will extracted and joined with
    // childrenJoinValueSeparator and then each resulting string will be joined in one final string with this value
    childrenJoinCollectionSeparator: string;

    constructor (name: string, children: DataSubProperty[] = [], childrenJoinValueSeparator: string = ' ', childrenJoinCollectionSeparator: string = ', ') {
      this.name = name
      this.children = children
      this.childrenJoinValueSeparator = childrenJoinValueSeparator
      this.childrenJoinCollectionSeparator = childrenJoinCollectionSeparator
    }
}
