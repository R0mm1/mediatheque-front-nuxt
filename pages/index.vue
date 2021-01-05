<template>
  <div class="home_row">
    <GroupEntitiesCount />
    <GroupAuthorsBooksDistribution />
  </div>
</template>

<script>
import GroupAuthorsBooksDistribution from '~/components/index/GroupAuthorsBooksDistribution.vue'
import GroupEntitiesCount from '~/components/index/GroupEntitiesCount.vue'

export default {
  name: 'Index',
  components: { GroupEntitiesCount, GroupAuthorsBooksDistribution }
}
</script>

<style scoped lang="scss">
.home_row {
  display: flex;
}
</style>
