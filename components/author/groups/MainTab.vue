<template>
  <div id="author-main-tab">
    <GroupInformation />
    <GroupBibliography />
  </div>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator'
import GroupInformation from '~/components/author/groups/mainTab/GroupInformation.vue'
import GroupBibliography from '~/components/author/groups/mainTab/GroupBibliography.vue'

@Component({
  components: { GroupBibliography, GroupInformation }
})
export default class MainTab extends Vue {
}
</script>

<style scoped lang="scss">
  #author-main-tab{
    display: flex;

    > div{
      max-width: 450px;
    }
  }
</style>
