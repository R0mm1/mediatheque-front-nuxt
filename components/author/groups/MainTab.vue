<template>
  <div id="author-main-tab">
    <GroupInformation :edit-mode-on="editModeOn" />
    <GroupBibliography v-if="!editModeOn" />
  </div>
</template>

<script lang="ts">

import { Component, Prop, Vue } from 'vue-property-decorator'
import GroupInformation from '~/components/author/groups/mainTab/GroupInformation.vue'
import GroupBibliography from '~/components/author/groups/mainTab/GroupBibliography.vue'

@Component({
  components: {
    GroupBibliography,
    GroupInformation
  }
})
export default class MainTab extends Vue {
  @Prop({
    type: Boolean,
    required: true
  }) editModeOn!: boolean
}
</script>

<style scoped lang="scss">
#author-main-tab {
  display: flex;
}
</style>
