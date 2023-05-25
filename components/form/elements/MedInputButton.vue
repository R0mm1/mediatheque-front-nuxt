<template>
  <FormulateInput
    :wrapper-class="customClasses"
    :label-class="[buttonDescriptor.faIcon]"
    :type="buttonDescriptor.type"
    :disabled="buttonDescriptor.disabled"
    :name="buttonDescriptor.name"
    :label="buttonDescriptor.value"
    :title="buttonDescriptor.value"
    :data-cy="buttonDescriptor.dataCy"
  >
    <i v-if="typeof buttonDescriptor.faIcon === 'string'" :class="buttonDescriptor.faIcon" aria-hidden="false"/>

    <template v-if="displayValue">
      <template v-if="!hasHref">
        {{ buttonDescriptor.value }}
      </template>
      <a v-else :href="buttonDescriptor.href.href" :target="buttonDescriptor.href.target">
        {{ buttonDescriptor.value }}
      </a>
    </template>
  </FormulateInput>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import ButtonDescriptor from '~/assets/ts/form/ButtonDescriptor'

@Component({})
export default class MedInputButton extends Vue {
  @Prop(Object) buttonDescriptor!: ButtonDescriptor

  get customClasses () {
    const classes = this.buttonDescriptor.customClasses
    classes.push('med_input_button')
    classes.push('style_' + this.buttonDescriptor.style)
    if (this.buttonDescriptor.noDefaultStyle) {
      classes.push('no-def-style')
    }
    return classes
  }

  get hasHref () {
    return typeof this.buttonDescriptor.href !== 'undefined'
  }

  get displayValue () {
    return this.buttonDescriptor.style !== 'icon-round'
  }
}
</script>

<style lang="scss">
@import "assets/scss/form/button";

@include button;
</style>
