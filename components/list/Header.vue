<template>
  <div class="list-header">
    <div v-for="column in columns" :key="column.dataField" class="cell">
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

    <div v-if="hasRowAction" class="cell" />

    <!-- To avoid having a width diff with list body due to scrollbar -->
    <div class="list-header-scrollbar-width" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'

import Column from '~/assets/ts/list/Column'
import listModule from '~/assets/ts/store/ListModule'

@Component({
  components: {
    HeaderPopup: () => import('~/components/list/HeaderPopup.vue')
  }
})
export default class Header extends Vue {
  @Prop(Boolean) hasRowAction!: Boolean;

  listDisplayPopup: { [index: string]: boolean } = {};
  listHasPopupNotice: { [index: string]: boolean } = {};

  toggleRowTwo (dataField: string) {
    if (typeof this.listDisplayPopup[dataField] === 'undefined') {
      this.$set(this.listDisplayPopup, dataField, true)
    } else {
      this.$set(this.listDisplayPopup, dataField, !this.listDisplayPopup[dataField])
    }
  }

  get columns () {
    return listModule._columns
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
    listModule.handleSortState({ dataField: column.dataField, sortState: Column.sortUp })
  }

  sortDownSwitched (column: Column) {
    listModule.handleSortState({ dataField: column.dataField, sortState: Column.sortDown })
  }

  searchFiltered (column: Column) {
    this.setHasPopupNotice(column.dataField, column.searchString.length > 0)
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
