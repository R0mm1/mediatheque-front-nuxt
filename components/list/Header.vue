<template>
  <div class="list-header">
    <div v-for="column in displayedColumns" :key="column.dataField" class="cell">
      <div class="headerRow">
        <div class="headerRowLabel">
          {{ column.label }}
        </div>

        <button
          v-if="column.isSearchable"
          class="headerTogglePopupButton fas fa-ellipsis-h"
          :class="{isActive: isButtonPopupLocked(column.dataField)}"
          @click="toggleRowTwo(column.dataField)"
        />

        <div v-if="column.isSortable" class="buttonGroup">
          <button
            class="headerSortButtonUp fas fa-sort-up"
            :class="{isActive: column.sortState === sortUpString}"
            @click="sortUpSwitched(column)"
          />
          <button
            class="headerSortButtonDown fas fa-sort-down"
            :class="{isActive: column.sortState === sortDownString}"
            @click="sortDownSwitched(column)"
          />
        </div>
      </div>

      <HeaderPopup
        :column="column"
        :is-displayed="isPopupDisplayed(column.dataField)"
        @list-header-search="searchFiltered"
      />
    </div>

    <div v-if="lastEmptyColumn" class="cell" />

    <!-- To avoid having a width diff with list body due to scrollbar -->
    <div class="list-header-scrollbar-width" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'

import { container } from 'tsyringe'
import Column, { ColumnSort } from '~/assets/ts/list/Column'
import listModule from '~/assets/ts/store/ListModule'
import ListService from '~/assets/ts/service/ListService'

const listService = container.resolve(ListService)

@Component({
  components: {
    HeaderPopup: () => import('~/components/list/HeaderPopup.vue')
  }
})
export default class Header extends Vue {
  @Prop(Boolean) hasRowAction!: Boolean

  listDisplayPopup: { [index: string]: boolean } = {}
  listHasPopupNotice: { [index: string]: boolean } = {}

  displayedColumns: { [index: string]: Column } = {}

  toggleRowTwo (dataField: string) {
    if (typeof this.listDisplayPopup[dataField] === 'undefined') {
      this.$set(this.listDisplayPopup, dataField, true)
    } else {
      this.$set(this.listDisplayPopup, dataField, !this.listDisplayPopup[dataField])
    }
  }

  setHasPopupNotice (dataField: string, hasPopupNotice: boolean) {
    this.$set(this.listHasPopupNotice, dataField, hasPopupNotice)
  }

  isPopupDisplayed (dataField: string) {
    return this.listDisplayPopup[dataField]
  }

  isButtonPopupLocked (dataField: string) {
    return this.isPopupDisplayed(dataField) || this.listHasPopupNotice[dataField]
  }

  get sortUpString () {
    return Column.sortUp
  }

  get sortDownString () {
    return Column.sortDown
  }

  sortUpSwitched (column: Column) {
    this.setSort(column, Column.sortUp)
  }

  sortDownSwitched (column: Column) {
    this.setSort(column, Column.sortDown)
  }

  setSort (column: Column, sortState: ColumnSort|null) {
    if (listService.getQueryFilter('lst-', column.dataField, this.$router) === sortState) {
      sortState = null
    }
    column.sortState = sortState ?? Column.sortNone
    listService.setQueryFilter('lst-', column.dataField, sortState, this.$router)
  }

  searchFiltered (column: Column) {
    this.setHasPopupNotice(column.dataField, column.searchString.length > 0)
    const queryParamSearchValue = column.searchString.length > 0 ? column.searchString : null
    this.$set(this.listDisplayPopup, column.dataField, false)
    listService.setQueryFilter('lsh-', column.dataField, queryParamSearchValue, this.$router)
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
    this.displayedColumns = listService.getDisplayedColumns()
  }

  get lastEmptyColumn (): Boolean {
    return this.hasRowAction || Object.values(this.displayedColumns).length === 0
  }

  created () {
    Object.values(listModule.columns).forEach((column:Column) => {
      this.searchFiltered(column)
    })
  }
}
</script>

<style lang="scss">
@import "../../assets/scss/colors";
@import "../../assets/scss/breakpoints";

.list-header {
  background-color: $shade1;
  display: flex;

  .cell {
    flex: 1;
    height: 2rem;
    position: relative;
    padding: 0 2px;

    @include phone-portrait {
      width: 100vw;
    }
  }

  .headerRow {
    position: relative;
    z-index: 2;
    display: flex;
    height: 100%;
    border-right: 1px solid $shade1;

    .headerRowLabel {
      flex-grow: 1;
      margin: auto;
    }

    .buttonGroup {
      display: flex;
      flex-direction: column;
      justify-content: center;

      > button {
        display: block;
        height: calc(50% - 2px);
      }
    }

    button {
      border: none;
      transition: background-color .3s, color .3s;
      background: none;

      &, &:focus, &:hover {
        //For Chrome
        outline: none;
      }

      &:hover, &.isActive {
        color: white;
      }
    }

    > button {
      padding: 5px;
    }
  }

  .list-header-scrollbar-width {
    overflow-y: scroll;
    opacity: 0;
  }
}
</style>
