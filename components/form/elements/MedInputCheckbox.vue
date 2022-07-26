<template>
  <FormulateInput
    v-model="bindValue"
    wrapper-class="med_input_checkbox"
    type="checkbox"
    :label="checkboxDescriptor.label"
    :name="checkboxDescriptor.name"
  />
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue, Watch } from 'vue-property-decorator'
import CheckboxDescriptor from 'assets/ts/form/CheckboxDescriptor'

@Component({})
export default class MedInputCheckbox extends Vue {
  @Prop(Object) checkboxDescriptor!: CheckboxDescriptor

  @Prop(Boolean) value !:boolean

  bindValue = false

  @Watch('value')
  updateBindValue (newVal: boolean) {
    this.bindValue = newVal
  }

  @Watch('bindValue')
  @Emit('input')
  bindValueChanged (newVal: boolean) {
    return newVal
  }

  created () {
    this.bindValue = this.value
  }
}
</script>

<style lang="scss">
.med_input_checkbox {
  display: flex;

  .formulate-input-element {
    margin-right: 5px;
  }
}
</style>
