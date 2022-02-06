<template>
  <div class="med-input-text-with-button">
    <MedInputText
      v-model="bindValue"
      :text-descriptor="textWithButtonDescriptor.textDescriptor"
      @input="$emit('input', bindValue)"
    />
    <MedInputButton
      v-if="hasButtonDescriptor"
      :button-descriptor="textWithButtonDescriptor.buttonDescriptor"
      @click.native="$emit('click', bindValue)"
    />

    <MedInputButton
      v-if="textWithButtonDescriptor.withCopyContentButton && isClipboardAccessible"
      v-tooltip="copyContentTooltipConfig"
      :button-descriptor="copyContentButtonDescriptor"
      @click.native="copyContent"
    />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import MedInputText from './MedInputText.vue'
import MedInputButton from './MedInputButton.vue'
import ButtonDescriptor from '~/assets/ts/form/ButtonDescriptor'
import TextWithButtonDescriptor from '~/assets/ts/form/TextWithButtonDescriptor'

@Component({
  components: { MedInputButton, MedInputText }
})
export default class MedInputTextWithButton extends Vue {
  @Prop({ type: Object, required: true }) textWithButtonDescriptor!: TextWithButtonDescriptor

  @Prop(String) value?: string

  bindValue?: string = ''

  copyContentTooltipConfig = {
    content: 'Copié!',
    trigger: 'click',
    classes: 'med-input-text-with-button-tooltip'
  }

  @Watch('value') updateBindValue (newVal: string) {
    this.bindValue = newVal
  }

  get hasButtonDescriptor () {
    return typeof this.textWithButtonDescriptor.buttonDescriptor !== 'undefined'
  }

  get copyContentButtonDescriptor () {
    return new ButtonDescriptor('copyContent').setFaIcon('far fa-copy').setNoDefaultStyle(true)
  }

  get isClipboardAccessible () {
    return navigator.clipboard
  }

  created () {
    this.bindValue = this.value

    this.textWithButtonDescriptor.textDescriptor.noDefaultStyle = true
    if (typeof this.textWithButtonDescriptor.buttonDescriptor !== 'undefined') {
      this.textWithButtonDescriptor.buttonDescriptor.noDefaultStyle = true
    }
  }

  copyContent () {
    navigator.clipboard.writeText(this.bindValue ?? '')
  }
}
</script>

<style lang="scss">
@import "../../../assets/scss/colors.scss";

.med-input-text-with-button {
  display: flex;
  height: 2rem;
  padding: 1px;

  .formulate-input {
    height: 100%;

    &[data-type="text"] {
      flex: 1;
    }

    .med_input_button, .med_input_text {
      height: 100%;

      .formulate-input-element {
        height: 100%;

        button {
          height: 100%;
          width: 100%;

          &, &:focus, &:hover {
            //For Chrome
            outline: none;
          }
        }

        input {
          height: 100%;
          width: 100%;

          &, &:focus, &:hover {
            //For Chrome
            outline: none;
          }
        }
      }
    }

    input, button {
      border: none;
      background-color: transparent;

      &:hover {
        border: none;
      }
    }
  }

  border: 1px solid $shade0;
  border-radius: 5px;
  transition: all .3s;
  background-color: $shade4;

  &:hover {
    background-color: $shade3;
    border-color: $shade3;
  }
}

.med-input-text-with-button-tooltip{
  background-color: white;
  padding: 2px;
  border: 1px solid $shade0;
  border-radius: 5px;
  font-size: .9rem;
  color: $textLessImportant;
}
</style>
