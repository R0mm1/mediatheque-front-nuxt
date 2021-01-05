<template>
  <div id="book-social-tab">
    <GroupBookRead :book-module="bookModule" />
    <GroupShare :book-module="bookModule" />
  </div>
</template>

<script>
import GroupBookRead from '../groups/socialTab/GroupBookRead'
import GroupShare from '../groups/socialTab/GroupShare'

export default {
  name: 'SocialTab',
  components: { GroupShare, GroupBookRead },
  props: { bookModule: { type: Object, required: true } }
}
</script>

<style scoped>
  #book-social-tab{
    display: flex;
  }
</style>
