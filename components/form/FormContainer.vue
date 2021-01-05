<template>
  <div class="med_form">
    <h2 class="form_title">
      <slot name="form_title" />
    </h2>

    <form class="form_body" @submit.prevent="validate">
      <slot name="form_body" />

      <div class="body_actions">
        <div class="action_cancel">
          <slot name="action_cancel">
            <MedInputButton :button-descriptor="cancelButtonDescriptor" @click.native="cancelAction" />
          </slot>
        </div>

        <div class="action_separator" />

        <div class="action_validate">
          <slot name="action_validate">
            <MedInputButton :button-descriptor="validateButtonDescriptor" />
          </slot>
        </div>
      </div>
    </form>
  </div>
</template>

<script>

import ButtonDescriptor from 'assets/ts/form/ButtonDescriptor'

export default {
  name: 'FormContainer',
  components: {
    MedInputButton: () => import('@/components/form/elements/MedInputButton')
  },
  props: {
    validateLabel: { type: String, default: 'Valider' },
    cancelLabel: { type: String, default: 'Annuler' },
    validateAction: {
      type: Function,
      default: () => {
      }
    },
    cancelAction: {
      type: Function,
      default: () => {
      }
    },
    validationMethod: {
      type: Function,
      default: () => true
    }
  },
  computed: {
    isValid () {
      return this.validationMethod()
    },
    cancelButtonDescriptor () {
      return new ButtonDescriptor('cancel').setValue(this.cancelLabel)
    },
    validateButtonDescriptor () {
      const buttonDescriptor = new ButtonDescriptor('validate').setValue(this.validateLabel)
      buttonDescriptor.type = ButtonDescriptor.typeSubmit
      buttonDescriptor.disabled = !this.isValid
      return buttonDescriptor
    }
  },
  methods: {
    validate (e) {
      if (this.isValid) {
        this.validateAction()
        e.preventDefault()
      }
    }
  }
}
</script>

<style scoped lang="scss">
    .form_title {
        font-size: 1.1rem;
        font-weight: 500;
        margin: 0 0 5px 0;
        border-bottom: 1px solid #e4dccc;
        padding-bottom: 3px;
    }

    .body_actions {
        display: flex;

        .action_separator {
            flex: 1;
        }
    }
</style>
