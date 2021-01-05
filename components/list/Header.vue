<template>
  <tr class="listListHeader">
    <th v-for="column in cols" :key="column.dataField" class="cell">
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
            :class="{isActive: column.sortState === column.sortUp}"
            @click="sortUpSwitched(column)"
          />
          <button
            class="headerSortButtonDown fas fa-sort-down"
            :class="{isActive: column.sortState === column.sortDown}"
            @click="sortDownSwitched(column)"
          />
        </div>
      </div>

      <HeaderPopup
        :column="column"
        :is-displayed="isPopupDisplayed(column.dataField)"
        @list-header-search="searchFiltered"
      />
    </th>

    <th v-if="hasRowAction" />
  </tr>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue } from 'vue-property-decorator'
import { getModule } from 'vuex-module-decorators'

import Column from '~/assets/ts/list/Column'

import ListModule from '~/assets/ts/store/ListModule'

const listModule = getModule(ListModule)

@Component({
  components: {
    HeaderPopup: () => import('~/components/list/HeaderPopup.vue')
  }
})
export default class Header extends Vue {
        @Prop(Array) cols!: Column[];
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

        setHasPopupNotice (dataField: string, hasPopupNotice: boolean) {
          this.$set(this.listHasPopupNotice, dataField, hasPopupNotice)
        }

        isPopupDisplayed (dataField: string) {
          return this.listDisplayPopup[dataField]
        }

        isButtonPopupLocked (dataField: string) {
          return this.isPopupDisplayed(dataField) || this.listHasPopupNotice[dataField]
        }

        @Emit('list-header-sort-up')
        sortUpSwitched (column: Column) {
          listModule.handleSortState({ dataField: column.dataField, sortState: column.sortUp })
          return column
        }

        @Emit('list-header-sort-down')
        sortDownSwitched (column: Column) {
          listModule.handleSortState({ dataField: column.dataField, sortState: column.sortDown })
          return column
        }

        @Emit('list-header-search')
        searchFiltered (column: Column) {
          this.setHasPopupNotice(column.dataField, column.searchString.length > 0)
          return column
        }
}
</script>

<style lang="scss">
    @import "../../assets/scss/colors";
    @import "../../assets/scss/breakpoints";

    .listListHeader {
        background-color: $shade1;

        .cell {
            height: 2rem;
            position: relative;

            @include phone-portrait{
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
                height: 100%;
                border-radius: 0 5px 0 0;
                overflow: hidden;

                > button {
                    display: block;
                    height: 50%;
                    padding: 0 3px;
                }
            }

            button {
                border: none;
                background: $shade4;
                transition: background-color .3s, color .3s;

                &:hover, &.isActive {
                    background: $shade0;
                    color: white;
                }
            }

            > button {
                padding: 5px;
            }
        }
    }
</style>
