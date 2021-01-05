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

<script>
import MedInputButton from '@/components/form/elements/MedInputButton'

export default {
  name: 'SimpleList',
  components: { MedInputButton },
  props: {
    // An array of Element objects
    elements: { type: Array, default: () => [] },
    // An array of Action objects
    actions: { type: Array, default: () => [] }
  }
}

const Action = function (buttonDescriptor, action) {
  this.buttonDescriptor = buttonDescriptor
  this.buttonDescriptor
    // .setStyle('negative')
    .addCustomClass('row_action')
    // .setRoundedCorner(true)
    // .setIsIconButon(true, 24)
  this.action = action
}

const Element = function (id, content, extra) {
  this.id = id
  this.content = content
  this.extra = extra
}

export { Action, Element }
</script>

<style scoped lang="scss">
    @import "../../assets/scss/colors";

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

        .form_element_button2 {
            font-size: .8rem;
            margin: 2px;

            &:nth-child(2){
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
</style>
