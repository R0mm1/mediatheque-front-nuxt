<template>
  <FormulateInput
    v-model="bindValue"
    :wrapper-class="wrapperClass"
    :type="textDescriptor.type"
    :placeholder="textDescriptor.placeholder"
    :label="textDescriptor.label"
    :add-label="addLabel"
    :disabled="textDescriptor.disabled"
    :readonly="!textDescriptor.editModeOn"
    @input.native="$emit('input', bindValue)"
    @focusin.native="$emit('focusin', bindValue)"
  />
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import TextDescriptor from '~/assets/ts/form/TextDescriptor'
import FormElement from '~/components/form/FormElement.vue'

@Component({
  components: { FormElement }
})
export default class MedInputText extends Vue {
  @Prop(Object) textDescriptor!: TextDescriptor

  @Prop(String) value?: string

  bindValue?: string = ''

  @Watch('value') updateBindValue (newVal: string) {
    this.bindValue = newVal
  }

  get wrapperClass () {
    const wrapperClass = ['med_input_text']
    if (this.textDescriptor.noDefaultStyle) {
      wrapperClass.push('no-def-style')
    }
    if (!this.textDescriptor.editModeOn) {
      wrapperClass.push('edit-mode-off')
    }
    return wrapperClass
  }

  get addLabel () {
    return typeof this.textDescriptor.label !== 'undefined'
  }

  created () {
    this.bindValue = this.value
  }
}
</script>

<style lang="scss">
@import 'assets/scss/form/text';
@include text;
</style>
