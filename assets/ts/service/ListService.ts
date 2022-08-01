import { autoInjectable, singleton } from 'tsyringe'
import VueRouter from 'vue-router'
import Column from '~/assets/ts/list/Column'
import listModule from '~/assets/ts/store/ListModule'

export type FilterQueryParamPrefix = 'lcf-'
export type SortQueryParamPrefix = 'lst-'
export type SearchQueryParamPrefix = 'lsh-'
export type ListQueryParams = FilterQueryParamPrefix | SortQueryParamPrefix | SearchQueryParamPrefix

@autoInjectable()
@singleton()
export default class ListService {
  setQueryFilter (prefix: ListQueryParams, paramName: string, value: string|null, router: VueRouter) {
    const query = Object.fromEntries(Object.entries(router.currentRoute.query))

    const filterName = prefix + paramName
    if (value === null) {
      delete query[filterName]
    } else {
      query[filterName] = value
    }

    router.push({
      query
    })
  }

  getQueryFilter (prefix: ListQueryParams | '', paramName: string, router: VueRouter): string | undefined {
    const filterName = prefix + paramName
    const value = router.currentRoute.query[filterName]

    if (typeof value !== 'string' && typeof value !== 'undefined') {
      console.error('Other values than string are not handled for filters')
      return undefined
    }
    return value
  }

  getDisplayedColumns (): { [index: string]: Column } {
    const displayedColumns: { [index: string]: Column } = {}
    Object.values(listModule.columns).forEach((column) => {
      if (this.isColumnDisplayed(column)) {
        displayedColumns[column.dataField] = column
      }
    })
    return displayedColumns
  }

  isColumnDisplayed (column: Column): boolean {
    const userColumnConfig = listModule.userConfig?.value?.columns.find((userColumnConfig) => {
      return userColumnConfig.dataField === column.dataField
    })

    return typeof userColumnConfig !== 'undefined' && userColumnConfig.isDisplayed === true
  }
}
