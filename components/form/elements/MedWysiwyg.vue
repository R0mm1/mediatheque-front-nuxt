<template>
  <FormElement
    :label="label"
    :name="name"
    :container-custom-classes="customClasses"
    :label-custom-classes="labelCustomClasses"
    :no-label="noLabel"
  >
    <template #element_content>
      <div v-if="!editModeOn" v-html="editorData" />
      <ckeditor v-if="editModeOn" v-model="editorData" :config="editorConfig" />
    </template>
  </FormElement>
</template>

<script>
import FormElement from '@/components/form/FormElement'

export default {
  name: 'MedWysiwyg',
  components: {
    FormElement
  },
  props: {
    labelCustomClasses: {
      type: String,
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    name: {
      type: String,
      default: ''
    },
    noLabel: {
      default: false,
      type: Boolean
    },
    content: {
      default: '',
      type: String
    },
    editModeOn: {
      default: false,
      type: Boolean
    }
  },
  data () {
    return {
      editorData: '',
      editorConfig: {
        toolbar: [
          { name: 'basicstyles', items: ['Bold', 'Italic', 'Strike', '-', 'RemoveFormat'] }
        ]
      }
    }
  },
  computed: {
    customClasses () {
      const customClasses = ['form_element_wysiwyg']
      if (this.noEdit) {
        customClasses.push('no-edit')
      }
      return customClasses.join(' ')
    }
  },
  watch: {
    editorData (newContent) {
      if (this.content !== newContent) {
        this.$emit('content-changed', newContent)
      }
    },
    content (newValue) {
      this.editorData = newValue
    }
  },
  created () {
    this.editorData = this.content
  }
}
</script>

<style lang="scss">
@import "../../../assets/scss/colors";

.form_element_wysiwyg {
  margin: 0 !important;

  .ck.ck-content {
    border: 1px solid transparent !important;
    box-shadow: none !important;
    background: transparent !important;
    transition: all .3s;
  }
}
</style>
