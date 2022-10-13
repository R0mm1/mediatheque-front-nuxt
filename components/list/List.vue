<template>
  <span id="vueListContainer" :class="{hasPopupDisplayed: hasPopupDisplayed}">
    <i
      v-if="isMobile"
      class="menu-icon fas"
      :class="{'fa-bars': !leftActionBarOpened, 'fa-times': leftActionBarOpened}"
      @click="leftActionBarOpened = !leftActionBarOpened"
    />

    <left-action-bar
      :class="{forceOpen: leftActionBarOpened}"
      :left-action-bar-properties="fullLeftActionBarProperties"
    />

    <div id="vueListContent" ref="vueListContent">

      <div id="vueList" :class="{withPagination: isPaginationEnabled}" role="grid">
        <list-header
          :has-row-action="hasRowAction"
        />
        <div v-if="!isLoading" id="vueListRows">
          <Row
            v-for="dataRow in listData"
            :key="'r_'+dataRow.id"
            :data-row="dataRow"
            :cols="Object.values(displayedColumns)"
            :row-actions="rowActions"
            :details-component-path="detailsComponentPath"
            @click.native="callback(dataRow)"
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

    <column-selection-popup
      v-if="isColumnSelectionPopupOpened"
      @popup-wanna-close="toggleIsColumnSelectionPopupOpened"
    />
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
import { HydraCollection } from '~/assets/ts/models/HydraInterfaces'
import ListService, {
  FilterQueryParamPrefix as FilterQueryParamPrefixType,
  SearchQueryParamPrefix as SearchQueryParamPrefixType,
  SortQueryParamPrefix as SortQueryParamPrefixType
} from '~/assets/ts/service/ListService'
import LeftActionBarElement from '~/assets/ts/list/LeftActionBarElement'
import LeftActionBarSeparatorDescriptor from '~/assets/ts/list/LeftActionBarSeparatorDescriptor'
import ButtonDescriptor from '~/assets/ts/form/ButtonDescriptor'
import ColumnSelectionPopup from '~/components/list/ColumnSelectionPopup.vue'

export const FilterQueryParamPrefix: FilterQueryParamPrefixType = 'lcf-'
export const SortQueryParamPrefix: SortQueryParamPrefixType = 'lst-'
export const SearchQueryParamPrefix: SearchQueryParamPrefixType = 'lsh-'

@Component({
  components: {
    ColumnSelectionPopup,
    Row: () => import('~/components/list/Row.vue'),
    ListHeader: () => import('~/components/list/Header.vue'),
    LeftActionBar: () => import('~/components/list/LeftActionBar.vue'),
    Loader: () => import('~/components/widgets/Loader.vue')
  }
})
export default class List extends Vue {
  listData: {}[] = []
  isPaginationEnabled: boolean = false
  paginationTotalPages?: Number
  isLoading: boolean = true
  requestService: RequestService = container.resolve(RequestService)
  listService: ListService = container.resolve(ListService)
  displayedColumns: { [index: string]: Column } = {}
  isColumnSelectionPopupOpened: boolean = false
  leftActionBarOpened: boolean = false // Useful for mobile devices when the fab is not displayed at all to begin with

  @Prop(String) name!: string

  @Prop(Array) cols!: Column[]
  @Prop(String) apiEndpoint!: string

  @Prop({
    type: Object,
    default: () => new LeftActionBarProperties()
  })
    leftActionBarProperties!: LeftActionBarProperties

  @Prop({
    type: Array,
    default: () => []
  })
    rowActions!: RowAction[]

  @Prop({
    type: String,
    default: null
  })
    detailsComponentPath!: string | null

  @Prop({
    type: Function,
    required: true
  }) callback!: Function

  get isMobile () {
    return this.$device.isMobile
  }

  get hasRowAction () {
    return this.rowActions.length > 0
  }

  get paginationCurrentPage () {
    return listModule._paginationCurrentPage
  }

  get fullLeftActionBarProperties (): LeftActionBarProperties {
    const leftActionBarProperties = this.leftActionBarProperties
    leftActionBarProperties.customElements = leftActionBarProperties.customElements.concat([
      new LeftActionBarElement(
        'separator',
        () => null,
        new LeftActionBarSeparatorDescriptor('configuration').setLabel('Configuration').setFaIcon('fas fa-cog')
      ),
      new LeftActionBarElement(
        'element',
        () => {
          this.toggleIsColumnSelectionPopupOpened()
          return null
        },
        new ButtonDescriptor('columns', 'Colonnes').setFaIcon('fas fa-columns').setNoDefaultStyle(true)
      )
    ])

    return leftActionBarProperties
  }

  get hasPopupDisplayed () {
    return listModule.hasPopupDisplayed
  }

  toggleIsColumnSelectionPopupOpened () {
    this.isColumnSelectionPopupOpened = !this.isColumnSelectionPopupOpened
    listModule.setHasPopupDisplayed(this.isColumnSelectionPopupOpened)
  }

  load (fromCache: boolean = true, resetPagination: boolean = false) {
    this.isLoading = true

    if (resetPagination) {
      listModule.setPaginationCurrentPage(1)
    }

    Promise
      .all([
        listModule.computeQueryParams({ getFromCache: fromCache })
          .then(() => {
            return this.requestService.execute<any & HydraCollection<any>>(
              this.requestService.createRequest(this.apiEndpoint).setQueryParams(listModule.queryParams)
            )
          })
          .then((data) => {
            this.listData = data['hydra:member']
            PaginationHelper.setRawResponse(data)
            this.isPaginationEnabled = PaginationHelper.hasPagination()
            if (this.isPaginationEnabled) {
              this.paginationTotalPages = PaginationHelper.getPageNumber()
            }
          })
          .catch((error) => {
            console.error(error)
          }),
        listModule.loadUserConfig({
          listName: this.name,
          device: this.$device.isMobile ? 'mobile' : 'default'
        })
      ])
      .finally(() => {
        this.isLoading = false
      })
  }

  setPage (pageNumber: number) {
    listModule.setPaginationCurrentPage(pageNumber)
    this.load(false)
  }

  // Handle columns

  get userConfig () {
    return listModule.userConfig
  }

  get columns () {
    return listModule.columns
  }

  @Watch('userConfig.value.columns', { deep: true })
  @Watch('columns')
  reloadDisplayedColumns () {
    this.displayedColumns = this.listService.getDisplayedColumns()
  }

  // Handle list data filtering (filters, search...)

  updateFiltersFromQueryString () {
    const updateFilters: { [key: string]: Filter } = {}
    Object.entries(this.$route.query).forEach(([paramName, paramValue]) => {
      if (paramName.startsWith(FilterQueryParamPrefix) && typeof paramValue === 'string') {
        const filter = paramName.split(FilterQueryParamPrefix).pop() as string
        updateFilters[filter] = new Filter(filter, paramValue)
      }
    })

    listModule.setCustomFilters(updateFilters)
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

  @Watch('$route.query')
  applyQueryString () {
    this.updateFiltersFromQueryString()
    this.updateColumnsFromQueryString()
    this.load(false)
  }

  // End handle list data filtering (filters, search...)

  created () {
    listModule.setColumns(this.cols)

    this.applyQueryString()
  }
}
</script>

<style scoped lang="scss">
@import "../../assets/scss/colors";
@import "../../assets/scss/breakpoints";
@import "../../assets/scss/list";

#vueListContainer {
  display: flex;
  height: 100%;
  position: relative;

  &.hasPopupDisplayed {
    #vueListContent, #leftActionBar {
      filter: blur(3px);
    }
  }
}

#vueListContent {
  flex-grow: 1;
  overflow: hidden;
  margin-left: $left-action-bar-width-shrunk;
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

.widget_popup {
  z-index: 10;
}
</style>

<style lang="scss">
@import "../../assets/scss/colors";
@import "../../assets/scss/list";

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

.menu-icon {
  position: fixed;
  top: 0;
  z-index: 10;
  height: 35px;
  width: 35px;
  font-size: 20px;
  text-align: center;
  display: flex;
  justify-content: center;
  flex-direction: column;
}

#leftActionBar {
  position: fixed;
  display: flex;
  flex-direction: column;
  width: $left-action-bar-width-shrunk;
  height: 100%;
  transition: width .3s;
  background-color: #eeeae1;
  z-index: 10;

  &:hover, &.forceOpen {
    width: $left-action-bar-width-extent;
  }
}
</style>
