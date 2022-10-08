<template>
  <div id="group-main-tab">
    <GroupInformation />
    <GroupBooks />
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'
import GroupInformation from '~/components/groups/groups/mainTab/GroupInformation.vue'
import GroupBooks from '~/components/groups/groups/mainTab/GroupBooks'

@Component({
  components: {
    GroupBooks,
    GroupInformation
  }
})
export default class MainTab extends Vue {
}
</script>

<style scoped lang="scss">
#group-main-tab {
  display: flex;
}
</style>
