<template>
  <FormulateInput
    v-model="bindValue"
    :wrapper-class="customClasses"
    type="select"
    :options="options"
    :label="selectDescriptor.label"
  >
    <template v-if="!selectDescriptor.editModeOn" #element>
      <div class="select-readonly">
        {{ options[bindValue] }}
      </div>
    </template>
  </FormulateInput>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import SelectDescriptor from '../../../assets/ts/form/SelectDescriptor'

@Component({})
export default class MedSelect extends Vue {
  @Prop({ type: Object, required: true }) selectDescriptor!: SelectDescriptor
  @Prop(String) value?: string

  options: { [index: string]: string } = {}

  bindValue?: string = ''

  get customClasses () {
    const classes = ['med_select']
    if (this.selectDescriptor.noDefaultStyle) {
      classes.push('no-def-style')
    }
    return classes
  }

  reloadOptions () {
    if (typeof this.selectDescriptor.optionsSource !== 'undefined') {
      this.selectDescriptor.optionsSource.then((options) => {
        this.options = options
      })
    } else if (typeof this.selectDescriptor.options !== 'undefined') {
      this.options = this.selectDescriptor.options
    }
  }

  @Watch('selectDescriptor', { deep: true }) descriptorChanged () {
    this.reloadOptions()
  }

  @Watch('bindValue') bindValueChanged (newVal: string) {
    this.$emit('input', newVal)
  }

  created () {
    this.reloadOptions()
    if (typeof this.selectDescriptor.defaultValue !== 'undefined' && typeof this.value === 'undefined') {
      this.bindValue = this.selectDescriptor.defaultValue
    } else {
      this.bindValue = this.value
    }
  }
}
</script>

<style lang="scss">
@import "assets/scss/form/select";
@include select;
</style>
