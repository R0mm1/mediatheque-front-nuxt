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
  }) value!: SelectValue | null

  bindValue: SelectValue | null = null

  options: SelectValue[] = []

  @Watch('medSelectDescriptor.options') optionsSourceChanged () {
    this.reloadOptions()
  }

  @Watch('value') updateBindValue (newVal: SelectValue | null) {
    this.bindValue = newVal
  }

  @Watch('bindValue') bindValueChanged (newVal: SelectValue | null) {
    this.$emit('input', newVal)
  }

  reloadOptions () {
    if (Array.isArray(this.medSelectDescriptor.options)) {
      this.options = this.medSelectDescriptor.options
    } else if (typeof this.medSelectDescriptor.options !== 'undefined') {
      this.medSelectDescriptor.options.then((options) => {
        this.options = options
      })
    }
  }

  created () {
    this.reloadOptions()
    this.bindValue = this.value
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

          &::after {
            content: "";
            width: 0;
            height: 0;
            border-color: black transparent transparent;
            border-style: solid;
            border-width: .3em .3em 0;
            right: .7em;
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
          }
        }
      }

      .select-options {
        @include popup;
        list-style-type: none;
        position: absolute;
        width: 100%;
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
