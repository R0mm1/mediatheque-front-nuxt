import { defineStore } from 'pinia'
import { container } from 'tsyringe'
import Column, { ColumnSort } from '~/assets/ts/list/Column'
import Filter from '~/assets/ts/list/Filter'
import LeftActionBarElement from '~/assets/ts/list/LeftActionBarElement'
import { QueryParamsInterface } from '~/assets/ts/objects/Request'
import UserConfig from '~/assets/ts/list/UserConfig'
import RequestService from '~/assets/ts/service/RequestService'
import { UserConfiguration, UserConfigurationCollection } from '~/assets/ts/models/UserConfiguration'

export interface ListState {
  columns: { [index: string]: Column }
  paginationRowsPerPage: number
  paginationCurrentPage: number
  customFilters: { [key: string]: Filter }
  searchQuery: string
  queryParams: QueryParamsInterface
  labElements: LeftActionBarElement[]
  labFilters: Filter[]
  userConfig?: UserConfiguration<UserConfig>
  hasPopupDisplayed: boolean
}

export const useListStore = defineStore('list', {
  state: (): ListState => ({
    columns: {},
    paginationRowsPerPage: 30,
    paginationCurrentPage: 1,
    customFilters: {},
    searchQuery: '',
    queryParams: {},
    labElements: [],
    labFilters: [],
    userConfig: undefined,
    hasPopupDisplayed: false
  }),

  getters: {
    // Getters are simple accessors in this case, but keeping them for API compatibility
  },

  actions: {
    setSearchQuery(searchQuery: string) {
      this.searchQuery = searchQuery
    },

    setQueryParams(queryParams: QueryParamsInterface) {
      this.queryParams = queryParams
    },

    setColumns(columns: Column[]) {
      const formattedColumns: { [index: string]: Column } = {}
      columns.forEach((column) => {
        formattedColumns[column.uid] = column
      })
      this.columns = formattedColumns
    },

    setUserConfig(userConfig: UserConfiguration<UserConfig>) {
      // Vue 3: No need for Vue.set()
      this.userConfig = userConfig
    },

    handleSortState({
      dataField,
      sortState
    }: { dataField: string; sortState: ColumnSort }) {
      if (typeof this.columns[dataField] === 'undefined') {
        throw new TypeError('Invalid column ' + dataField)
      }

      const column = this.columns[dataField]

      if (sortState === Column.sortUp) {
        column.sortState = (column.sortState === Column.sortUp) ? Column.sortNone : Column.sortUp
      } else if (sortState === Column.sortDown) {
        column.sortState = (column.sortState === Column.sortDown) ? Column.sortNone : Column.sortDown
      }

      // Vue 3: No need for Vue.set(), direct assignment works
      this.columns[dataField] = column
    },

    setPaginationCurrentPage(currentPage: number) {
      this.paginationCurrentPage = currentPage
    },

    setCustomFilters(customFilters: { [key: string]: Filter }) {
      this.customFilters = customFilters
    },

    setCustomFilter(customFilter: Filter) {
      // Vue 3: No need for Vue.set()
      this.customFilters[customFilter.property] = customFilter
    },

    setLabElements(labElements: LeftActionBarElement[]) {
      this.labElements = labElements
      this.labFilters = []
      this.labElements.forEach((labElement) => {
        if (labElement.type === 'filter') {
          this.labFilters.push(new Filter(labElement.formElementDescriptor.name, null))
        }
      })
    },

    setHasPopupDisplayed(hasPopupDisplayed: boolean) {
      this.hasPopupDisplayed = hasPopupDisplayed
    },

    computeQueryParams({ getFromCache = true }: { getFromCache?: boolean } = {}): Promise<QueryParamsInterface> {
      if (getFromCache && Object.keys(this.queryParams).length > 0) {
        return Promise.resolve(this.queryParams)
      }

      const QUERY_ORDER_PARAM_NAME = 'order'
      const sort: { [index: string]: string } = {}
      const search: { [index: string]: string } = {}

      Object.keys(this.columns).forEach((dataField) => {
        const column = this.columns[dataField]

        if (column.sortState !== Column.sortNone) {
          sort[QUERY_ORDER_PARAM_NAME + '[' + column.orderParameterName + ']'] = column.sortState
        }

        if (column.searchString.length > 0) {
          search[column.searchParameterName] = column.searchString
        }
      })

      const customFilters: { [index: string]: string } = {}
      Object.values(this.customFilters).forEach((customFilter) => {
        if (typeof customFilter.value === 'string') {
          customFilters[customFilter.property] = customFilter.value
        }
      })

      this.setQueryParams({
        ...sort,
        itemsPerPage: this.paginationRowsPerPage,
        page: this.paginationCurrentPage,
        ...search,
        ...customFilters
      })

      return Promise.resolve(this.queryParams)
    },

    async loadUserConfig({ listName, device }: { listName: string; device: string }) {
      const configName = 'list_' + listName + '_' + device
      const requestService = container.resolve(RequestService)
      const request = requestService.createRequest('user_configurations?name=' + configName)

      const result = await requestService.execute<UserConfigurationCollection<UserConfig>>(request)
      const userConfiguration: UserConfiguration<UserConfig> | undefined = result['hydra:member'].pop()

      if (typeof userConfiguration === 'undefined') {
        this.setUserConfig({
          name: configName,
          value: {
            columns: []
          }
        })
      } else {
        this.setUserConfig(userConfiguration)
      }

      return result
    },

    async saveUserConfig(): Promise<UserConfiguration<UserConfig>> {
      const method = typeof this.userConfig?.id === 'undefined' ? 'POST' : 'PUT'
      const configId = method === 'POST' ? '' : '/' + this.userConfig?.id
      const requestService = container.resolve(RequestService)
      const request = requestService.createRequest('user_configurations' + configId, method)
      request.setBody(this.userConfig)
      return requestService.execute<UserConfiguration<UserConfig>>(request)
    }
  }
})
