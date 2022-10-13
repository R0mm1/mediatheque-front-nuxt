<template>
  <div
    v-click-outside="closeAll"
    :class="classes"
    :data-type="context.type"
  >
    <template v-if="!editModeOn">
      <FormulateInput
        v-model="valueLabel"
        wrapper-class="edit-mode-off-wrapper formulate-input-wrapper"
        type="void"
      />
    </template>

    <template v-else>
      <div class="main-row">
        <FormulateInput
          v-model="valueLabel"
          wrapper-class="selected-value formulate-input-wrapper"
          type="void"
          @click.native="toggle"
        >
          <template #after>
            <i class="fas fa-caret-down" />
          </template>
        </FormulateInput>

        <MedInputButton
          v-if="isCreationAvailable"
          :button-descriptor="buttonAddDescriptor"
          @click.native="openFormCreation"
        />
      </div>

      <ul v-if="opened" :id="context.attributes.id" class="select-options" role="listbox">
        <li
          v-for="option in options"
          :key="option.key"
          role="option"
          :aria-selected="isSelected(option)"
          :class="{selected: isSelected(option)}"
          @click="setValue(option)"
        >
          {{ option.label }}
        </li>
      </ul>

      <div v-if="isFormCreationDisplayed" class="creation-container">
        <FormContainer :validate-action="formCreationSubmit" :cancel-action="closeFormCreation">
          <template #form_title>
            {{ formCreationTitle }}
          </template>
          <template #form_body>
            <FormulateForm v-model="formCreationData" :schema="formCreationSchema" />
            <slot name="form_creation_body" />
          </template>
        </FormContainer>
      </div>
    </template>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import ClickOutside from 'vue-click-outside'
import FormContainer from '~/components/form/FormContainer.vue'
import MedInputButton from '~/components/form/elements/MedInputButton.vue'
import ButtonDescriptor from '~/assets/ts/form/ButtonDescriptor'
import { SelectValue } from '~/assets/ts/form/MedSelectDescriptor'

@Component({
  components: {
    FormContainer,
    MedInputButton
  },
  directives: { 'click-outside': ClickOutside }
})
export default class Select extends Vue {
  @Prop({
    type: Object,
    required: true
  }) context!: any

  @Prop({
    type: Boolean,
    required: false,
    default: true
  }) editModeOn!: boolean

  @Prop({
    type: Array,
    required: true
  }) selectOptions!: SelectValue[]

  options: SelectValue[] = []

  opened: boolean = false

  @Watch('selectOptions')
  selectOptionsChanged () {
    this.options = this.selectOptions
  }

  get classes () {
    const classes: { [index: string]: boolean } = {}

    classes['formulate-input-element'] = true
    classes['formulate-input-element--' + this.context.type] = true
    classes['edit-mode-off'] = !this.editModeOn
    classes.opened = this.opened

    return classes
  }

  get value () {
    return this.context.model
  }

  set value (value: SelectValue) {
    this.context.model = value
  }

  get valueLabel () {
    return this.context.model.label
  }

  set valueLabel (value: string) {
    // nothing to do here
  }

  toggle () {
    this.opened = !this.opened
    if (this.opened) {
      this.closeFormCreation()
    }
  }

  close () {
    this.opened = false
  }

  setValue (value: SelectValue) {
    this.value = value
    this.opened = false
  }

  isSelected (value: SelectValue) {
    return this.context.model.key === value.key
  }

  // --- Stuff for creation of a new entity --- //
  isFormCreationDisplayed = false
  formCreationData: { [index: string]: any } = {}

  @Prop({
    type: Function,
    required: false,
    default: null
  }) formCreationValidationAction!: null | ((formCreationData: any) => Promise<any>)

  @Prop({
    type: String,
    required: false,
    default: ''
  }) formCreationTitle!: string

  @Prop({
    type: Array,
    required: false,
    default: () => []
  }) formCreationSchema!: any[]

  get isCreationAvailable () {
    return (typeof this.formCreationValidationAction === 'function')
  }

  buttonAddDescriptor = new ButtonDescriptor('create')
    .setFaIcon('fas fa-plus')
    .addCustomClass('btnCreate')

  openFormCreation () {
    this.opened = false
    this.isFormCreationDisplayed = true
  }

  closeFormCreation () {
    this.isFormCreationDisplayed = false
  }

  formCreationSubmit () {
    if (typeof this.formCreationValidationAction === 'function') {
      this.formCreationValidationAction(this.formCreationData).then((optionData: SelectValue) => {
        this.formCreationData = {}
        this.options.push(optionData)
        this.setValue(optionData)
        this.closeFormCreation()
      })
    } else {
      this.closeFormCreation()
    }
  }

  // Other stuff

  closeAll () {
    this.close()
    this.closeFormCreation()
    this.options = this.selectOptions
  }

  created () {
    this.options = this.selectOptions
  }
}
</script>

<style lang="scss">

</style>
