<template>
  <Group :group-id="groupId" />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Group from '~/components/groups/Group.vue'

@Component({
  components: { Group }
})
export default class GroupPage extends Vue {
  groupId!: Number

  created () {
    this.groupId = parseInt(this.$route.params.id)
  }
}
</script>

<style scoped>

</style>
