<template>
  <div v-if="rowAction.isDisplayed(rowData)" class="rowCustomAction">
    <MedInputButton :button-descriptor="buttonDescriptor" @click.native="triggerCustomAction" />

    <!--    <FormulateInput-->
    <!--      type="button"-->
    <!--      value=""-->
    <!--      @click.native="triggerCustomAction"-->
    <!--    />-->

    <!--    <InputButton-->
    <!--      value=""-->
    <!--      :label-custom-classes="rowAction.iconClassname"-->
    <!--      @click.native="triggerCustomAction"-->
    <!--    />-->

    <div v-if="rowAction.needConfirm" class="customActionConfirm" :class="{isDisplayed: confirmDisplayed}">
      {{ rowAction.confirmMessage }}
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import RowAction from '~/assets/ts/list/RowAction'
import MedInputButton from '~/components/form/elements/MedInputButton.vue'
import ButtonDescriptor from '~/assets/ts/form/ButtonDescriptor'

@Component({
  components: { MedInputButton }
})
export default class CustomAction extends Vue {
  @Prop(Object) rowAction!: RowAction;
  @Prop(Object) rowData!: object;

  clickCounter: number = 0;
  confirmDisplayed: boolean = false;

  get buttonDescriptor (): ButtonDescriptor {
    return new ButtonDescriptor(this.rowAction.id, this.rowAction.label, 'button').setFaIcon(this.rowAction.iconClassname)
  }

  triggerCustomAction (event: MouseEvent) {
    this.clickCounter++

    let triggerEvent = true
    if (this.rowAction.needConfirm) {
      if (this.clickCounter === 1) {
        this.confirmDisplayed = true
        triggerEvent = false
      }
    }

    if (triggerEvent) {
      this.$emit('custom-action-triggered', this.rowAction.id)
      this.confirmDisplayed = false
      this.clickCounter = 0
    }

    event.stopPropagation()
  }
}
</script>

<style scoped lang="scss">

.rowCustomAction {
  position: relative;
}

.form_element_button {
  border-radius: 50%;
  width: 13px;
  height: 13px;
  text-align: center;
  font-size: .8rem;
}

.customActionConfirm {
  font-size: .8rem;
  background-color: black;
  color: white;
  padding: 2px;
  position: absolute;
  transform: translateX(-50%);

  &:not(.isDisplayed) {
    display: none;
  }
}
</style>
