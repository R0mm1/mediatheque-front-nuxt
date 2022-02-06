<template>
  <FormulateInput
    type="chips"
    :label="chipsDescriptor.label"
    :add-label="true"

    :entities="chipsDescriptor.entities"
    :entity-fields="chipsDescriptor.entityFields"
    :fields-separator="chipsDescriptor.fieldsSeparator"
    :form-creation-validation-action="chipsDescriptor.formCreationValidationAction"
    :form-creation-title="chipsDescriptor.formCreationTitle"
    :search-field-placeholder="chipsDescriptor.searchFieldPlaceholder"
    :search-param="chipsDescriptor.searchParam"
    :entity-u-r-i="chipsDescriptor.entityURI"
    :form-creation-schema="chipsDescriptor.formCreationSchema"
    :edit-mode-on="chipsDescriptor.editModeOn"

    @entity-removed="entityRemoved"
    @entity-added="entityAdded"
  />
</template>

<script lang="ts">
import { Vue, Component, Prop, Emit } from 'vue-property-decorator'
import ChipsDescriptor from 'assets/ts/form/ChipsDescriptor'

@Component
export default class MedChips extends Vue {
  @Prop({ type: Object, required: true }) chipsDescriptor!: ChipsDescriptor

  @Emit('entity-removed')
  entityRemoved (payload: any) {
    return payload
  }

  @Emit('entity-added')
  entityAdded (payload: any) {
    return payload
  }
}
</script>

<style lang="scss">
@import "assets/scss/colors";
@import "assets/scss/popup";
@import "assets/scss/form/vueFormulateDefaultStyle";

.formulate-input[data-type="chips"] > div {
  @include positioning;
  height: auto !important;

  .formulate-input-element {
    .entity {
      display: inline-flex;
      border: 1px solid $shade0;
      border-radius: 5px;
      padding: 2px 3px;
      margin-right: 3px;
      background-color: $shade4;
      @include inputTextStyle;

      .entity_delete {
        padding-left: 5px;
      }
    }

    .entity-readonly{
      display: inline-flex;
      height: $standardHeight;
      line-height: $standardHeight;
      @include inputTextStyle;

      &:not(:last-child)::after{
        content: ',';
        display: block;
        width: .5rem;
      }
    }

    .search_container{
      position: relative;
      width: 100%;

      .search_inputs {
        display: flex;
        align-items: center;
        width: 100%;

        .formulate-input[data-type="text"] {
          margin-right: 5px;
          flex: 1;
        }
      }

      .search_results{
        @include popup;
        position: absolute;
        z-index: 2;
        width: 100%;

        ul{
          list-style-type: none;
          padding: 0;

          li {
            padding: 5px;
          }

          li:hover {
            background-color: $shade1;
          }
        }

        .count_results {
          font-size: .8rem;
          font-style: italic;
          text-align: right;
          margin: 3px;
        }

        .search_notice {
          font-size: .9rem;
          text-align: center;
          margin: 5px 0px;
        }

        .search_loading {
          display: flex;
          justify-content: center;

          img {
            width: 25px;
            margin: 5px;
          }
        }
      }
    }
  }
}

</style>
