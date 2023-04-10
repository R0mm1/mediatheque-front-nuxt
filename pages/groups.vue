<template>
  <div id="group-list" :class="{withPopupOpened: groupToDeleteDisplayPopup}">
    <List
      ref="list"
      api-endpoint="/reference_groups"
      details-component-path="groups/GroupListRowDetails.vue"
      :left-action-bar-properties="leftActionBarProperties"
      :cols="cols"
      :callback="setGroup"
      name="group"
    />
    <GroupListPopupDelete
      v-if="groupToDeleteDisplayPopup"
      :group-comment="groupToDeleteComment"
      @group-delete-cancel="groupDeleteCancel"
      @group-delete-trigger="groupDeleteTrigger"
    />
  </div>
</template>

<script>
import { container } from 'tsyringe'
import Column from 'assets/ts/list/Column'
import List from '@/components/list/List'
import LeftActionBarProperties from 'assets/ts/list/LeftActionBarProperties'
import groupListModule from '~/assets/ts/store/list/GroupListModule'
import ReferenceGroupService from '~/assets/ts/service/book/ReferenceGroupService'
import GroupListPopupDelete from '~/components/groups/GroupListPopupDelete'

const referenceGroupService = container.resolve(ReferenceGroupService)

export default {
  name: 'Groups',
  components: {
    GroupListPopupDelete,
    List
  },
  layout (context) {
    return context.$device.isMobile ? 'mobile-layout-with-menu' : 'default'
  },
  data () {
    return {
      cols: [
        new Column('comment', this.$t('reference_groups.comment').toString())
          .setIsSearchable(false)
      ],
      leftActionBarProperties: new LeftActionBarProperties()
        .setHasAddButton(false),
      groupToDeleteDisplayPopup: false
    }
  },
  computed: {
    groupToDelete () {
      return groupListModule.groupToDelete
    },
    groupToDeleteComment () {
      return groupListModule.groupToDelete?.comment ?? ''
    }
  },
  watch: {
    groupToDelete () {
      this.groupToDeleteDisplayPopup = groupListModule.groupToDelete !== null
    }
  },
  methods: {
    setGroup (group) {
      window.location.href = '/group/' + group.id
    },
    groupDeleteCancel () {
      groupListModule.setGroupToDelete(null)
    },
    groupDeleteTrigger () {
      referenceGroupService
        .delete(groupListModule.groupToDelete.id)
        .then(() => {
          groupListModule.setGroupToDelete(null)
          this.$refs.list.load()
        })
        .catch((error) => {
          this.$toasted.show(error, {
            ...this.$config.default.notification_settings,
            type: 'error',
            icon: 'fa-times'
          })
        })
    }
  }
}
</script>

<style lang="scss">
#group-list {
  position: relative;

  &.withPopupOpened #vueListContainer {
    filter: blur(8px);
  }
}
</style>
