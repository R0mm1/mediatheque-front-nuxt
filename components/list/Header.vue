<template>
  <div class="list-header">
    <div v-for="column in displayedColumns" :key="column.uid" class="cell">
      <div class="headerRow" role="columnheader" :aria-label="column.label">
        <div class="headerRowLabel">
          {{ column.label }}
        </div>

        <button
          v-if="column.isSearchable"
          class="headerTogglePopupButton fas fa-ellipsis-h"
          :class="{isActive: isButtonPopupLocked(column.uid)}"
          @click="toggleRowTwo(column.uid)"
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
        :is-displayed="isPopupDisplayed(column.uid)"
        @list-header-search="searchFiltered"
      />
    </div>

    <div v-if="lastEmptyColumn" class="cell" role="columnheader" aria-label="Actions" />

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

  toggleRowTwo (uid: string) {
    if (typeof this.listDisplayPopup[uid] === 'undefined') {
      this.$set(this.listDisplayPopup, uid, true)
    } else {
      this.$set(this.listDisplayPopup, uid, !this.listDisplayPopup[uid])
    }
  }

  setHasPopupNotice (uid: string, hasPopupNotice: boolean) {
    this.$set(this.listHasPopupNotice, uid, hasPopupNotice)
  }

  isPopupDisplayed (uid: string) {
    return this.listDisplayPopup[uid]
  }

  isButtonPopupLocked (uid: string) {
    return this.isPopupDisplayed(uid) || this.listHasPopupNotice[uid]
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
    if (listService.getQueryFilter('lst-', column.uid, this.$router) === sortState) {
      sortState = null
    }
    column.sortState = sortState ?? Column.sortNone
    listService.setQueryFilter('lst-', column.uid, sortState, this.$router)
  }

  searchFiltered (column: Column) {
    this.setHasPopupNotice(column.uid, column.searchString.length > 0)
    const queryParamSearchValue = column.searchString.length > 0 ? column.searchString : null
    this.$set(this.listDisplayPopup, column.uid, false)
    listService.setQueryFilter('lsh-', column.uid, queryParamSearchValue, this.$router)
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
