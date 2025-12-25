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
    :add-button-label="filesDescriptor.addButtonLabel"
  />
</template>

<script setup lang="ts">
import FilesDescriptor from "@/assets/ts/form/FilesDescriptor";

interface Props {
  filesDescriptor: FilesDescriptor;
  files: File[];
}

defineProps<Props>();
</script>

<style scoped></style>
