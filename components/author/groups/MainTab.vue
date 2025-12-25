<template>
  <div id="author-main-tab">
    <GroupInformation :edit-mode-on="editModeOn" />
    <GroupBibliography v-if="!editModeOn" />
  </div>
</template>

<script setup lang="ts">
import GroupInformation from "~/components/author/groups/mainTab/GroupInformation.vue";
import GroupBibliography from "~/components/author/groups/mainTab/GroupBibliography.vue";

interface Props {
  editModeOn: boolean;
}

defineProps<Props>();
</script>

<style scoped lang="scss">
#author-main-tab {
  display: flex;
}
</style>
