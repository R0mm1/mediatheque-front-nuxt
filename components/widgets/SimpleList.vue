<template>
  <div class="widget_simpleList">
    <draggable
      v-model="elementsWorkingCopy"
      :disabled="!sortable || !editModeOn"
    >
      <transition-group>
        <div v-for="element in elementsWorkingCopy" :key="element.id" class="list_row" data-cy="listRow">
          <div class="row_content" data-cy="rowContent">
            {{ element.content }}
          </div>

          <MedInputButton
            v-for="(action, actionIndex) in actions"
            :key="actionIndex"
            :button-descriptor="action.buttonDescriptor"
            class="row_button"
            data-cy="rowButton"
            @click.native="action.action(element)"
          />
        </div>
      </transition-group>
    </draggable>
  </div>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue, Watch } from 'vue-property-decorator'
import draggable from 'vuedraggable'
import MedInputButton from '@/components/form/elements/MedInputButton.vue'
import ButtonDescriptor from '~/assets/ts/form/ButtonDescriptor'

export class Action {
  buttonDescriptor: ButtonDescriptor
  action: ((...args: any[]) => any)

  constructor (buttonDescriptor: ButtonDescriptor, action: ((...args: any[]) => any)) {
    this.buttonDescriptor = buttonDescriptor
    this.buttonDescriptor
      .addCustomClass('row_action')
    this.action = action
  }
}

export class Element<ExtraType> {
  id: string
  content: string
  extra: ExtraType

  constructor (id: string, content: string, extra: ExtraType) {
    this.id = id
    this.content = content
    this.extra = extra
  }
}

@Component({
  components: { MedInputButton, draggable }
})
export default class SimpleList extends Vue {
  @Prop({
    type: Array,
    default: () => []
  }) value!: Element<any>[]

  @Prop({
    type: Array,
    default: () => []
  }) actions!: Action[]

  @Prop({
    type: Boolean,
    default: false
  }) sortable!: Boolean

  @Prop({
    type: Boolean,
    default: false
  }) editModeOn!: Boolean

  elementsWorkingCopy: Element<any>[] = []

  @Watch('elements')
  elementsUpdate () {
    this.elementsWorkingCopy = this.value
    return this.elementsWorkingCopy
  }

  @Emit('input')
  @Watch('elementsWorkingCopy')
  workingCopyUpdate () {
    return this.elementsWorkingCopy
  }

  @Watch('value')
  valueChanged () {
    this.elementsWorkingCopy = this.value
  }

  created () {
    this.elementsWorkingCopy = this.value
  }
}
</script>

<style lang="scss">
@import "../../assets/scss/colors";

.widget_simpleList {
  .list_row {
    display: flex;
    height: 30px;
    line-height: 30px;
    transition: all 0.3s;
    border-style: solid;
    border-width: 1px 0 1px 0;
    border-color: transparent;

    &:hover {
      border-color: $shade1;
    }

    &:nth-child(even) {
      background-color: #fcfcfa;
    }

    .form_element_button2 {
      font-size: .8rem;
      margin: 2px;

      &:nth-child(2) {
        margin-left: 10px;
      }

      &:last-of-type {
        margin-right: 0;
      }
    }

    &.sortable {
      cursor: move;
    }

    &.moving {
      position: fixed;
    }
  }

  .row_content {
    flex: 1;
    text-overflow: ellipsis;
    overflow: hidden;
    padding-right: 5px;
  }

  .row_button:not(:last-of-type){
    margin-right: 5px;
  }

  .formulate-input {
    line-height: 24px;
    margin: auto;

    button {
      height: 24px;
      width: 24px;
      line-height: 24px;
      font-size: .8rem !important;
      padding: initial !important;
    }
  }
}
</style>
