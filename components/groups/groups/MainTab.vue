<template>
  <div id="group-main-tab">
    <component :is="popupComponent" v-if="popupComponent !== null" v-bind="popupProperties" v-on="popupEvents" />
    <div id="tab-content" :class="{'popup-opened': popupComponent !== null}">
      <GroupInformation />
      <GroupBooks :ref-popup="$refs.popup" @display-popup="displayPopup" @hide-popup="hidePopup" />
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import GroupInformation from '~/components/groups/groups/mainTab/GroupInformation.vue'
import GroupBooks from '~/components/groups/groups/mainTab/GroupBooks.vue'

@Component({
  components: {
    GroupBooks,
    GroupInformation
  }
})
export default class MainTab extends Vue {
  popupComponent: Vue | null = null
  popupProperties: Object | null = null
  popupEvents: Object = {}

  displayPopup (popupComponent: Vue, popupProperties: Object, popupEvents: Object) {
    this.popupComponent = popupComponent
    this.popupProperties = popupProperties
    this.popupEvents = popupEvents
  }

  hidePopup () {
    this.popupComponent = null
    this.popupProperties = null
    this.popupEvents = {}
  }
}
</script>

<style scoped lang="scss">
#group-main-tab {
  position: relative;
}

#tab-content {
  display: flex;

  &.popup-opened {
    filter: blur(3px);
  }
}
</style>
