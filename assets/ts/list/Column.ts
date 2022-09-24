import DataSubProperty from '@/assets/ts/list/DataSubProperty'

export type ColumnSortASC = 'ASC'
export type ColumnSortDESC = 'DESC'
export type ColumnSortNone = 'none'
export type ColumnSort = (ColumnSortASC | ColumnSortDESC | ColumnSortNone)

/**
 * Represent a column of the list
 */
export default class Column {
  static readonly sortUp: ColumnSortASC = 'ASC'
  static readonly sortDown: ColumnSortDESC = 'DESC'
  static readonly sortNone: ColumnSortNone = 'none'

  uid: string
  dataField: string
  label: string
  isSortable: boolean
  isSearchable: boolean
  subProperties: DataSubProperty[] = []
  searchParameterName: string
  orderParameterName: string
  sortState: ColumnSort = Column.sortNone
  searchString: string = ''

  /**
   * Same behavior than {@link DataSubProperty.childrenJoinValueSeparator}
   */
  joinValueSeparator: string = ' '

  /**
   * Same behavior than {@link DataSubProperty.childrenJoinCollectionSeparator}
   */
  joinCollectionSeparator: string = ', '

  constructor (dataField: string, label: string, isSortable: boolean = true, isSearchable: boolean = true) {
    // The dataField may be identical between two columns if subproperties are used, so we need to let the possibility
    // to override the way the column is identified, but in most cases the dataField should be enough
    this.uid = dataField
    this.dataField = dataField
    this.label = label
    this.isSortable = isSortable
    this.isSearchable = isSearchable

    // By default, we consider the API use the field name for the search and the order
    this.searchParameterName = dataField
    this.orderParameterName = dataField
  }

  setSubProperties (subProperties: DataSubProperty[]) {
    this.subProperties = subProperties
    return this
  }

  setSearchParameterName (searchParameterName: string) {
    this.searchParameterName = searchParameterName
    return this
  }

  setOrderParameterName (orderParameterName: string) {
    this.orderParameterName = orderParameterName
    return this
  }

  setSortStateFromString (sortState: string) {
    if (sortState !== Column.sortNone && sortState !== Column.sortDown && sortState !== Column.sortUp) {
      throw new Error('Invalid sort state ' + sortState)
    }
    this.sortState = sortState
  }

  setUid (uid: string) {
    this.uid = uid
    return this
  }

  setIsSortable (isSortable: boolean) {
    this.isSortable = isSortable
    return this
  }
}
