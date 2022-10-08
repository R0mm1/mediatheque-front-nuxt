<template>
  <EntityLayout v-model="activeTab" :tabs="tabs" :footer-opened="false" :editable="false">
    <template #entity-layout-title>
      {{ comment }}
    </template>
    <template #entity-layout-content>
      <MainTab />
    </template>
  </EntityLayout>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import EntityLayout from '~/components/page/EntityLayout.vue'
import { TabData } from '~/components/widgets/Tabs.vue'
import groupModule from '~/assets/ts/store/GroupModule'
import MainTab from '~/components/groups/groups/MainTab.vue'

@Component({
  components: {
    MainTab,
    EntityLayout
  }
})
export default class Group extends Vue {
  @Prop() groupId!: number

  activeTab: string = 'group'
  readonly tabs: TabData[] = [
    {
      id: 'group',
      label: this.$t('reference_groups.the_reference_group').toString()
    }
  ]

  get comment () {
    return groupModule.group.comment
  }

  created () {
    groupModule.get(this.groupId)
  }
}
</script>

<style scoped>

</style>
