<template>
  <div class="widget_simpleList">
    <div v-for="element in elements" :key="element.id" class="list_row">
      <div class="row_content">
        {{ element.content }}
      </div>

      <MedInputButton
        v-for="(action, actionIndex) in actions"
        :key="actionIndex"
        :button-descriptor="action.buttonDescriptor"
        @click.native="action.action(element)"
      />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import MedInputButton from '@/components/form/elements/MedInputButton.vue'
import ButtonDescriptor from '~/assets/ts/form/ButtonDescriptor'

@Component({
  components: { MedInputButton }
})
export default class SimpleList extends Vue {
  @Prop({ type: Array, default: () => [] }) elements!:Element<any>[]
  @Prop({ type: Array, default: () => [] }) actions!:Action[]
}

export class Action {
  buttonDescriptor: ButtonDescriptor
  action: ((...args: any[])=>any)

  constructor (buttonDescriptor: ButtonDescriptor, action: ((...args: any[])=>any)) {
    this.buttonDescriptor = buttonDescriptor
    this.buttonDescriptor
      .addCustomClass('row_action')
    this.action = action
  }
}

export class Element<ExtraType> {
  id:string
  content: string
  extra: ExtraType
  constructor (id: string, content: string, extra: ExtraType) {
    this.id = id
    this.content = content
    this.extra = extra
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
  }

  .row_content {
    flex: 1;
    text-overflow: ellipsis;
    overflow: hidden;
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
