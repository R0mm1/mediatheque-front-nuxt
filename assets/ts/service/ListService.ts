import { autoInjectable, singleton } from 'tsyringe'
import VueRouter from 'vue-router'

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
}
