<template>
  <div>
    <List
      ref="list"
      api-endpoint="/reference_groups"
      :left-action-bar-properties="leftActionBarProperties"
      :cols="cols"
      :callback="setGroup"
      name="group"
    />
  </div>
</template>

<script>
import Column from 'assets/ts/list/Column'
import List from '@/components/list/List'
import LeftActionBarProperties from 'assets/ts/list/LeftActionBarProperties'

export default {
  name: 'Groups',
  components: {
    List
  },
  layout (context) {
    return context.$device.isMobile ? 'mobile-layout-with-menu' : 'default'
  },
  data () {
    return {
      cols: [
        new Column('comment', this.$t('reference_groups.comment'))
          .setIsSearchable(false)
      ],
      leftActionBarProperties: new LeftActionBarProperties()
        .setHasAddButton(false)
    }
  },
  methods: {
    setGroup (group) {
      window.location.href = '/group/' + group.id
    }
  }
}
</script>

<style scoped>

</style>
