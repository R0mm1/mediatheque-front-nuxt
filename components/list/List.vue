<template>
  <span id="vueListContainer">

    <left-action-bar
      :left-action-bar-properties="leftActionBarProperties"
    />

    <div id="vueListContent" ref="vueListContent">

      <div id="vueList" :class="{withPagination: isPaginationEnabled}">
        <list-header
          :has-row-action="hasRowAction"
        />
        <div v-if="!isLoading" id="vueListRows">
          <Row
            v-for="dataRow in listData"
            :key="'r_'+dataRow.id"
            :data-row="dataRow"
            :cols="cols"
            :row-actions="rowActions"
            :details-component-path="detailsComponentPath"
            @click.native="$emit('list-action-set', dataRow)"
          />
        </div>
        <template v-else>
          <Loader class="list-loader" />
        </template>
      </div>

      <paginate
        v-if="isPaginationEnabled"
        id="pagination"
        :page-count="paginationTotalPages"
        :force-page="paginationCurrentPage"
        :click-handler="setPage"
        page-class="pagination-item"
        prev-class="pagination-prev"
        next-class="pagination-next"
        prev-text="<i class='fas fa-angle-left'></i>"
        next-text="<i class='fas fa-angle-right'></i>"
      />
    </div>
  </span>
</template>

<script lang="ts">

import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

import { container } from 'tsyringe'
import Column from '~/assets/ts/list/Column'
import RowAction from '~/assets/ts/list/RowAction'
import LeftActionBarProperties from '~/assets/ts/list/LeftActionBarProperties'
import PaginationHelper from '~/assets/js/paginationHelper.js'
import Filter from '~/assets/ts/list/Filter'
import listModule from '~/assets/ts/store/ListModule'
import RequestService from '~/assets/ts/service/RequestService'

const requestService = container.resolve(RequestService)

@Component({
  components: {
    Row: () => import('~/components/list/Row.vue'),
    ListHeader: () => import('~/components/list/Header.vue'),
    LeftActionBar: () => import('~/components/list/LeftActionBar.vue'),
    Loader: () => import('~/components/widgets/Loader.vue')
  }
})
export default class List extends Vue {
  listData: {}[] = [];
  isPaginationEnabled: boolean = false;
  paginationTotalPages?: Number;
  isLoading: boolean = true;

  @Prop(Array) cols!: Column[];
  @Prop(String) apiEndpoint!: string;

  @Prop({ type: Object, default: () => new LeftActionBarProperties() })
  leftActionBarProperties!: LeftActionBarProperties;

  @Prop({ type: Array, default: () => [] })
  rowActions!: RowAction[];

  @Prop({ type: String, default: null })
  detailsComponentPath!: string | null;

  get hasRowAction () {
    return this.rowActions.length > 0
  }

  get paginationCurrentPage () {
    return listModule._paginationCurrentPage
  }

  load (fromCache: boolean = true, resetPagination: boolean = false) {
    this.isLoading = true

    if (resetPagination) {
      listModule.setPaginationCurrentPage(1)
    }

    listModule.computeSearchString({ getFromCache: fromCache, apiEndpoint: this.apiEndpoint })
      .then(() => {
        return requestService.execute(
          requestService.createRequest(listModule.searchQuery).setSkipUrlBuilding(true)
        )
      })
      .then((data: { [index: string]: any }) => {
        this.listData = data['hydra:member']
        PaginationHelper.setRawResponse(data)
        this.isPaginationEnabled = PaginationHelper.hasPagination()
        if (this.isPaginationEnabled) {
          this.paginationTotalPages = PaginationHelper.getPageNumber()
        }
        this.isLoading = false
      })
      .catch((error) => {
        console.error(error)
      })
  }

  setPage (pageNumber: number) {
    listModule.setPaginationCurrentPage(pageNumber)
    this.load(false)
  }

  // Handle list data filtering (filters, search...)

  get customFilters () {
    return listModule._customFilters
  }

  get columns () {
    return listModule.columns
  }

  @Watch('columns', { deep: true })columnsChanged () {
    if (!this.isLoading) {
      const filteredQuery = this.removeParamsFromQuery([SortQueryParamPrefix, SearchQueryParamPrefix])
      Object.values(this.columns).forEach((column: Column) => {
        if (column.sortState !== Column.sortNone) {
          filteredQuery.push([SortQueryParamPrefix + column.dataField, column.sortState])
        }
        if (column.searchString.length > 0) {
          filteredQuery.push([SearchQueryParamPrefix + column.dataField, encodeURIComponent(column.searchString)])
        }
      })
      this.$router.push({
        query: Object.fromEntries(filteredQuery)
      })
    }
  }

  @Watch('customFilters')
  customFiltersChanged () {
    if (!this.isLoading) {
      // Extract the current query string and remove filters on it
      const filteredQuery = this.removeParamsFromQuery(FilterQueryParamPrefix)

      // Add the current filters on the query string and give it to the router
      this.customFilters.forEach(customFilter => filteredQuery.push([FilterQueryParamPrefix + customFilter.property, customFilter.value]))
      this.$router.push({
        query: Object.fromEntries(filteredQuery)
      })
    }
  }

  @Watch('$route.query')
  queryStringChanged () {
    this.updateFiltersFromQueryString()
    this.updateColumnsFromQueryString()
    this.load(false, true)
  }

  updateFiltersFromQueryString () {
    const filters: Filter[] = []
    Object.entries(this.$route.query).forEach(([paramName, paramValue]) => {
      if (paramName.startsWith(FilterQueryParamPrefix)) {
        if (typeof paramValue === 'string') {
          filters.push(new Filter(paramName.split(FilterQueryParamPrefix).pop() ?? '', paramValue))
        } else if (Array.isArray(paramValue)) {
          paramValue.forEach(value => filters.push(new Filter(paramName.split(FilterQueryParamPrefix).pop() ?? '', value)))
        }
      }
    })

    listModule.setCustomFilters(filters)
  }

  updateColumnsFromQueryString () {
    Object.entries(this.$route.query).forEach(([paramName, paramValue]) => {
      if (paramName.startsWith(SortQueryParamPrefix)) {
        const column = paramName.split(SortQueryParamPrefix).pop() as string
        if (typeof this.columns[column] !== 'undefined' && typeof paramValue === 'string') {
          try {
            this.columns[column].setSortStateFromString(paramValue)
          } catch (e) {
            console.error('Could not set sort state ' + paramValue + ' for column ' + paramName)
          }
        }
      } else if (paramName.startsWith(SearchQueryParamPrefix)) {
        const column = paramName.split(SearchQueryParamPrefix).pop() as string
        if (typeof this.columns[column] !== 'undefined' && typeof paramValue === 'string') {
          this.columns[column].searchString = decodeURIComponent(paramValue)
        }
      }
    })
  }

  removeParamsFromQuery (paramsStartingWith: ListQueryParams|ListQueryParams[]):[string, string|null][] {
    const includeParam = (paramName: string, paramsStartingWith: ListQueryParams|ListQueryParams[]):boolean => {
      if (Array.isArray(paramsStartingWith)) {
        for (const startString of paramsStartingWith) {
          if (paramName.startsWith(startString)) {
            return true
          }
        }
        return false
      } else {
        return paramName.startsWith(paramsStartingWith)
      }
    }

    return Object.entries(this.$route.query)
      .map(queryParam => includeParam(queryParam[0], paramsStartingWith) ? null : queryParam)
      .filter((value):value is [string, string] => value !== null)
  }

  // End handle list data filtering (filters, search...)

  created () {
    this.cols.forEach((col: Column) => {
      listModule.setColumn(col)
    })

    this.updateFiltersFromQueryString()
    this.updateColumnsFromQueryString()
    this.load(false)
  }
}

export const FilterQueryParamPrefix = 'lcf-'
export const SortQueryParamPrefix = 'lst-'
export const SearchQueryParamPrefix = 'lsh-'
export type ListQueryParams = (typeof FilterQueryParamPrefix|typeof SortQueryParamPrefix | typeof SearchQueryParamPrefix)
</script>

<style scoped lang="scss">
@import "../../assets/scss/colors";
@import "../../assets/scss/breakpoints";

$leftActionBarWidth: 30px;

#vueListContainer {
  display: flex;
  height: 100%;
}

#vueListContent {
  flex-grow: 1;
  overflow: hidden;
  margin-left: $leftActionBarWidth;
  display: flex;
  flex-direction: column;

  @include phone-portrait {
    margin-left: 0;
  }

  #vueList {
    display: flex;
    flex-direction: column;
    border-collapse: collapse;
    width: 100%;
    height: 100%;
    transition: all .3s;

    &.withPagination {
      height: calc(100% - 2rem) !important;
    }

    #vueListRows {
      overflow-y: scroll;
    }

    .listRow:nth-child(even) {
      background-color: #fcfcfa;

      @include phone-portrait {
        background-color: $shade3;
      }
    }

    .list-loader {
      margin: 0 auto;
      display: flex;
    }

    .row-details-container {
      overflow: hidden;
      transition: all 5s cubic-bezier(0, 1, 0, 1);
    }
  }
}
</style>

<style lang="scss">
@import "../../assets/scss/colors";

$leftActionBarWidth: 30px;

#pagination {
  margin: 0;
  padding: 0;
  list-style-type: none;
  height: 2rem;
  background-color: $shade2;

  .pagination-item, .pagination-prev, .pagination-next {
    display: inline-block;
    line-height: calc(2rem - 10px);
    padding: 0 3px;
    margin: 5px 3px;
    border-bottom: 2px solid $shade1;
    transition: all .3s;

    &:hover, &.active {
      border-bottom: 2px solid $shade1;
      background-color: $shade1;
      color: white;
    }
  }
}

#leftActionBar {
  position: fixed;
  display: flex;
  flex-direction: column;
  width: $leftActionBarWidth;
  height: 100%;
  transition: width .3s;
  background-color: #eeeae1;
  z-index: 10;

  &:hover {
    width: 170px;
  }
}
</style>
