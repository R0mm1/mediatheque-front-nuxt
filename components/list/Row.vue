<template>
  <div :id="elementId" class="listRow" @mouseenter="onMouseOver" @mouseleave="onMouseOut">
    <div class="listCells" role="row">
      <div
        v-for="column in cols"
        :key="column.uid"
        class="cell"
        role="gridcell"
        @touchstart="cellTouchStart(column)"
        @touchend="cellTouchEnd(column)"
      >
        {{ getValue(column) }}
      </div>

      <div v-if="hasRowAction" class="listRowCustomActions cell" role="gridcell">
        <CustomAction
          v-for="rowAction in rowActions"
          :key="rowAction.id"
          :row-action="rowAction"
          :row-data="dataRow"
          @custom-action-triggered="customActionTriggered"
        />
      </div>
    </div>

    <transition name="list-row-details-trans">
      <div v-if="enhancedColumn !== null" class="listRowDetails" role="row" :aria-label="enhancedColumn.label">
        {{ getValue(enhancedColumn) }}
      </div>
    </transition>

    <transition name="list-row-details-trans">
      <div v-if="hasDetailsComponent && detailsOpened" class="listRowDetails" role="row" aria-label="Informations sur le livre">
        <component :is="detailsComponent" :data="dataRow" role="gridcell" />
      </div>
    </transition>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import Column from '~/assets/ts/list/Column'
import DataSubProperty from '~/assets/ts/list/DataSubProperty'
import RowAction from '~/assets/ts/list/RowAction'
import RowActionPayload from '~/assets/ts/list/RowActionPayload'

@Component({
  components: {
    CustomAction: () => import('./row/CustomAction.vue')
  }
})
export default class Row extends Vue {
  rowId: any

  @Prop(Object) dataRow: any
  @Prop(Array) cols!: Column[]
  @Prop(Array) rowActions!: RowAction[]

  get elementId () {
    return 'el' + (this.dataRow.id ? this.dataRow.id : Math.random().toString())
  }

  get hasRowAction () {
    return this.rowActions.length > 0
  }

  getValue (column: Column, scope?: any) {
    if (typeof scope === 'undefined') {
      scope = this.dataRow
    }
    scope = JSON.parse(JSON.stringify(scope))

    let value = scope[column.dataField]

    if (typeof value === 'undefined') {
      return ''
    }

    const extractSubProperties = (root: any, subProperties: DataSubProperty[], joinValueSeparator: string, joinCollectionSeparator: string): string => {
      let values: string

      if (Array.isArray(root)) {
        values = root.map((object) => {
          return extractSubProperties(object, subProperties, joinValueSeparator, joinCollectionSeparator)
        }).join(joinCollectionSeparator)
      } else {
        values = subProperties.map((subProperty) => {
          let value = root[subProperty.name]
          if (typeof value === 'undefined') {
            throw new TypeError('Invalid subproperty ' + subProperty.name)
          }

          const hasChildren = subProperty.children.length > 0
          if (typeof value !== 'string' && hasChildren) {
            value = extractSubProperties(value, subProperty.children, subProperty.childrenJoinValueSeparator, subProperty.childrenJoinCollectionSeparator)
          } else if (typeof value !== 'string' && !hasChildren) {
            throw new Error("The value is not a string but we don't have any subproperty to extract from it")
          } else if (typeof value === 'string' && hasChildren) {
            throw new Error("We can't extract subproperties from a string")
          }

          return value
        }).join(joinValueSeparator)
      }

      return values
    }

    if (typeof value !== 'string' && value !== null) {
      if (column.subProperties.length === 0) {
        throw new Error("The root isn't a string and no sub property to extract from it is specified")
      }

      value = extractSubProperties(value, column.subProperties, column.joinValueSeparator, column.joinCollectionSeparator)
    }

    return value
  }

  customActionTriggered (actionName: RowActionPayload) {
    this.$parent?.$emit('custom-action-triggered', actionName, this.dataRow)
  }

  onMouseOver () {
    this.openingDetailsTimeout = window.setTimeout(() => {
      this.detailsOpened = true
    }, 500)
  }

  onMouseOut () {
    if (this.openingDetailsTimeout !== null) {
      window.clearTimeout(this.openingDetailsTimeout)
    }
    this.detailsOpened = false
  }

  openingDetailsTimeout: number | null = null

  detailsOpened: boolean = false

  @Prop({ type: String, default: null }) detailsComponentPath!: string | null
  detailsComponent: any = null

  get hasDetailsComponent () {
    return this.detailsComponentPath !== null
  }

  get detailsComponentLoader () {
    return () => import('~/components/' + this.detailsComponentPath)
  }

  // On mobile, handle cell enhancement on touch
  cellTouchTimers: {[index: string]: ReturnType<typeof setTimeout>} = {}
  enhancedColumn: Column|null = null

  cellTouchStart (column: Column) {
    this.cellTouchTimers[column.dataField] = setTimeout(() => {
      this.enhancedColumn = column
      setTimeout(() => {
        this.enhancedColumn = null
      }, 2000)
    }, 500)
  }

  cellTouchEnd (column: Column) {
    clearTimeout(this.cellTouchTimers[column.dataField])
    delete this.cellTouchTimers[column.dataField]
  }

  created () {
    this.rowId = 'el' + (this.dataRow.id ? this.dataRow.id : Math.random().toString())

    if (this.hasDetailsComponent) {
      this.detailsComponentLoader().then(() => {
        this.detailsComponent = () => this.detailsComponentLoader()
      })
    }
  }
}
</script>

<style scoped lang="scss">
@import "../../assets/scss/colors";
@import "../../assets/scss/breakpoints";

@include phone-portrait {
  .cell {
    width: 100vw;
  }
}

.listRow {
  display: flex;
  flex-direction: column;
  transition: all 0.3s;
  border-style: solid;
  border-width: 1px 0 1px 0;
  border-color: transparent;

  .listCells {
    width: 100%;
    display: flex;
  }

  .cell, .listRowCustomActions {
    height: 2rem;
    line-height: 2rem;
    flex: 1;
    padding: 0 2px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .listRowCustomActions {
    display: flex;
    opacity: 0;
    visibility: hidden;
    transition: all .3s;
  }

  .listRowDetails {
    padding: 2px 2px;
  }

  .list-row-details-trans-enter-active, .list-row-details-trans-leave-active {
    transition: all .3s;
    overflow: hidden;
    max-height: 230px;
  }

  .list-row-details-trans-enter, .list-row-details-trans-leave-to {
    max-height: 0;
  }

  &:hover {
    border-color: #d0c3a9;

    .listRowCustomActions {
      opacity: 1;
      visibility: visible;
    }
  }
}
</style>
