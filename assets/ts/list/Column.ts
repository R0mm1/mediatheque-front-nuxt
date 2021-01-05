import DataSubProperty from '@/assets/ts/list/DataSubProperty'

/**
 * Represent a column of the list
 */
export default class Column {
    readonly sortUp: string = 'ASC';
    readonly sortDown: string = 'DESC';
    readonly sortNone: string = 'none';

    dataField: string;
    label: string;
    isSortable: boolean;
    isSearchable: boolean;
    subProperties: DataSubProperty[] = [];
    searchParameterName: string;
    sortState: string = this.sortNone;
    searchString: string = '';

    /**
     * Same behavior than {@link DataSubProperty.childrenJoinValueSeparator}
     */
    joinValueSeparator: string = ' ';

    /**
     * Same behavior than {@link DataSubProperty.childrenJoinCollectionSeparator}
     */
    joinCollectionSeparator: string = ', ';

    constructor (dataField: string, label: string, isSortable: boolean = true, isSearchable: boolean = true) {
      this.dataField = dataField
      this.label = label
      this.isSortable = isSortable
      this.isSearchable = isSearchable

      // Be default, we consider the API use the field name for the search
      this.searchParameterName = dataField
    }

    setSubProperties (subProperties: DataSubProperty[]) {
      this.subProperties = subProperties
      return this
    }

    setSearchParameterName (searchParameterName: string) {
      this.searchParameterName = searchParameterName
      return this
    }
}
