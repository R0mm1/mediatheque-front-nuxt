<template>
  <tr :id="elementId" class="listRow">
    <td v-for="column in cols" :key="column.dataField" class="cell">
      {{ getValue(column) }}
    </td>

    <td v-if="hasRowAction" class="listRowCustomActions">
      <CustomAction
        v-for="rowAction in rowActions"
        :key="rowAction.id"
        :row-action="rowAction"
        :row-data="dataRow"
        @custom-action-triggered="customActionTriggered"
      />
    </td>
  </tr>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import Column from '~/assets/ts/list/Column'
import DataSubProperty from '~/assets/ts/list/DataSubProperty'
import RowAction from '~/assets/ts/list/RowAction'

@Component({
  components: {
    CustomAction: () => import('./row/CustomAction.vue')
  }
})
export default class Row extends Vue {
  rowActionClicks: object = {};
  rowId: any;

  @Prop(Object) dataRow: any;
  @Prop(Array) cols!: Column[];
  @Prop(Array) rowActions!: RowAction[];

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

  customActionTriggered (actionName: string) {
    this.$parent.$emit('custom-action-triggered', actionName, this.dataRow)
  }

  created () {
    this.rowId = 'el' + (this.dataRow.id ? this.dataRow.id : Math.random().toString())
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
  height: calc(1.5rem - 2px);
  transition: all 0.3s;
  border-style: solid;
  border-width: 1px 0 1px 0;
  border-color: transparent;
}

.listRow:hover {
  border-color: #d0c3a9;

  .listRowCustomActions {
    opacity: 1;
    visibility: visible;
  }
}

.listRowCustomActions {
  display: flex;
  opacity: 0;
  visibility: hidden;
  transition: all .3s;
}
</style>
