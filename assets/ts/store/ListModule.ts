import { Action, getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators'
import Vue from 'vue'
import store from '~/assets/ts/store/store'
import Column, { ColumnSort } from '~/assets/ts/list/Column'
import Filter from '~/assets/ts/list/Filter'
import LeftActionBarElement from '~/assets/ts/list/LeftActionBarElement'
import { QueryParamsInterface } from '~/assets/ts/objects/Request'

@Module({ dynamic: true, name: 'list', store, namespaced: true })
class ListModule extends VuexModule {
  private readonly QUERY_ORDER_PARAM_NAME = 'order'

  _columns: { [index: string]: Column } = {}

  _paginationRowsPerPage: number = 30
  _paginationCurrentPage: number = 1

  _customFilters: {[key: string]: Filter} = {}

  _searchQuery: string = ''

  _queryParams: QueryParamsInterface = {}

  _labElements: LeftActionBarElement[] = []
  _labFilters: Filter[] = []

  get columns () {
    return this._columns
  }

  get searchQuery () {
    return this._searchQuery
  }

  get queryParams () {
    return this._queryParams
  }

  @Mutation setSearchQuery (searchQuery: string) {
    this._searchQuery = searchQuery
  }

  @Mutation setQueryParams (queryParams: QueryParamsInterface) {
    this._queryParams = queryParams
  }

  @Mutation setColumn (column: Column) {
    Vue.set(this._columns, column.dataField, column)
  }

  @Mutation handleSortState ({ dataField, sortState }: { dataField: string, sortState: ColumnSort }) {
    if (typeof this._columns[dataField] === 'undefined') {
      throw new TypeError('Invalid column ' + dataField)
    }

    const column = this._columns[dataField]

    if (sortState === Column.sortUp) {
      column.sortState = (column.sortState === Column.sortUp) ? Column.sortNone : Column.sortUp
    } else if (sortState === Column.sortDown) {
      column.sortState = (column.sortState === Column.sortDown) ? Column.sortNone : Column.sortDown
    }

    Vue.set(this._columns, dataField, column)
  }

  @Mutation setPaginationCurrentPage (currentPage: number) {
    this._paginationCurrentPage = currentPage
  }

  @Mutation setCustomFilters (customFilters: {[key: string]: Filter}) {
    this._customFilters = customFilters
  }

  @Mutation setCustomFilter (customFilter: Filter) {
    Vue.set(this._customFilters, customFilter.property, customFilter)
  }

  @Mutation setLabElements (labElements: LeftActionBarElement[]) {
    this._labElements = labElements
    this._labElements.forEach((labElement) => {
      if (labElement.type === 'filter') {
        this._labFilters.push(new Filter(labElement.formElementDescriptor.name, null))
      }
    })
  }

  @Action({ rawError: true })
  computeQueryParams ({ getFromCache = true }: { getFromCache?: boolean }) {
    if (getFromCache && Object.keys(this._queryParams).length > 0) {
      return Promise.resolve(this._queryParams)
    } else {
      const sort: { [index: string]: string } = {}
      const search: { [index: string]: string } = {}

      Object.keys(this._columns).forEach((dataField) => {
        const column = this._columns[dataField]

        if (column.sortState !== Column.sortNone) {
          sort[this.QUERY_ORDER_PARAM_NAME + '[' + column.dataField + ']'] = column.sortState
        }

        if (column.searchString.length > 0) {
          search[column.searchParameterName] = column.searchString
        }
      })

      const customFilters: { [index: string]: string } = {}
      Object.values(this._customFilters).forEach((customFilter) => {
        if (typeof customFilter.value === 'string') {
          customFilters[customFilter.property] = customFilter.value
        }
      })

      this.setQueryParams({
        ...sort,
        itemsPerPage: this._paginationRowsPerPage,
        page: this._paginationCurrentPage,
        ...search,
        ...customFilters
      })

      return Promise.resolve(this.queryParams)
    }
  }
}

export default getModule(ListModule)
