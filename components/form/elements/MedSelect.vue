<template>
  <FormulateInput
    v-model="bindValue"
    wrapper-class="formulate-input-wrapper med_select"
    type="medselect"
    :label="medSelectDescriptor.label"
    :edit-mode-on="medSelectDescriptor.editModeOn"
    :select-options="options"
    :name="medSelectDescriptor.name"

    :form-creation-validation-action="medSelectDescriptor.formCreationValidationAction"
    :form-creation-title="medSelectDescriptor.formCreationTitle"
    :form-creation-schema="medSelectDescriptor.formCreationSchema"
  />
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import MedSelectDescriptor, { SelectValue } from '~/assets/ts/form/MedSelectDescriptor'

@Component
export default class MedSelect extends Vue {
  @Prop({
    type: Object,
    required: true
  }) medSelectDescriptor!: MedSelectDescriptor

  @Prop({
    required: true
  }) value!: SelectValue | null | Promise<SelectValue | null>

  bindValue: SelectValue | null = null

  options: SelectValue[] = []

  @Watch('medSelectDescriptor.options') optionsSourceChanged () {
    this.reloadOptions()
  }

  @Watch('value') updateBindValue (newVal: SelectValue | null | Promise<SelectValue | null>) {
    Promise.resolve(newVal).then((newVal) => {
      this.bindValue = newVal
    })
  }

  @Watch('bindValue') bindValueChanged (newVal: SelectValue | null) {
    if (this.value !== newVal) {
      this.$emit('input', newVal)
    }
  }

  reloadOptions () {
    this.medSelectDescriptor.getOptions()
      .then((options: SelectValue[] | undefined) => {
        if (typeof options !== 'undefined') {
          this.options = options
        }
        this.setDefault()
      })
  }

  setDefault () {
    if (this.bindValue === null || typeof this.bindValue === 'undefined') {
      const defaultValue = this.options.find(option => option.default === true)
      if (typeof defaultValue !== 'undefined') {
        this.bindValue = defaultValue
      }
    }
  }

  created () {
    this.updateBindValue(this.value)
    this.reloadOptions()
  }
}
</script>

<style lang="scss">
@import "assets/scss/colors";
@import "assets/scss/popup";
@import "assets/scss/form/vueFormulateDefaultStyle";

.formulate-input[data-type="medselect"] {

  .formulate-input-element.edit-mode-off .edit-mode-off-wrapper {
    @include inputTextStyle;
    @include positioning;

    .formulate-input-element {
      line-height: $standardHeight;
    }
  }

  .med_select {
    @include positioning;
    height: initial !important;
    margin: 0;

    .formulate-input-element {
      position: relative;

      &.opened {
        border-radius: 5px 5px 0 0 !important;
        border-bottom-color: transparent;
      }

      .main-row {
        display: flex;
        align-items: center;
        width: 100%;

        .formulate-input[data-type="void"] {
          margin-right: 5px;
          flex: 1;
        }
      }

      .selected-value {
        @include wrapperStyle;
        @include inputTextStyle;
        @include positioning;

        .formulate-input-element {
          height: 100%;
          display: flex;
          align-items: center;
          white-space: nowrap;
          overflow: hidden;

          i{
            font-size: .8rem;
          }
        }
      }

      .select-options {
        @include popup;
        list-style-type: none;
        position: absolute;
        width: calc(100% - $popup-padding - $popup-padding - $popup-border-width - $popup-border-width);
        z-index: 10;
        max-height: 10em;
        overflow-y: auto;
        overflow-x: hidden;

        li {
          padding: 5px;
          border-left: 3px solid transparent;

          &.selected{
            border-left: 3px solid $shade0;
          }

          &:hover {
            background-color: $shade1;
          }
        }
      }

      .creation-container {
        @include popup;

        position: absolute;
        width: 100%;
        z-index: 10;
      }
    }
  }
}
</style>
