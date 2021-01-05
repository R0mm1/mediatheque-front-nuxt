<template>
  <FormulateInput
    type="files"
    :label="filesDescriptor.label"
    :add-label="true"
    :name="filesDescriptor.name"

    :max-files="filesDescriptor.maxFiles"
    :download-action="filesDescriptor.downloadAction"
    :files="files"
    :on-file-added="filesDescriptor.onFileAdded"
    :on-file-removed="filesDescriptor.onFileRemoved"
  />
</template>

<script lang="ts">

import { Component, Prop, Vue } from 'vue-property-decorator'
import FilesDescriptor from '@/assets/ts/form/FilesDescriptor'

@Component({})
export default class MedFiles extends Vue {
  @Prop({ type: Object, required: true }) filesDescriptor!: FilesDescriptor;
  @Prop({ type: Array, required: true }) files!: File[];
}
</script>

<style scoped>

</style>
