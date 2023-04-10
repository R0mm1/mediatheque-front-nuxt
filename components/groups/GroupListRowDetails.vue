<template>
  <div class="group-list-row-details">
    <MedInputButton :button-descriptor="openGroupPageButtonDescriptor" />
    <MedInputButton :button-descriptor="deleteGroupButtonDescriptor" @click.native.stop="setGroupForDeletion" />
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import MedInputButton from '~/components/form/elements/MedInputButton.vue'
import ButtonDescriptor from '~/assets/ts/form/ButtonDescriptor'
import { ReferenceGroupItem } from '~/assets/ts/models/book/ReferenceGroup'
import groupListModule from '~/assets/ts/store/list/GroupListModule'

@Component({
  components: { MedInputButton }
})
export default class GroupListRowDetails extends Vue {
  @Prop({
    type: Object,
    required: true
  }) data!: ReferenceGroupItem

  get openGroupPageButtonDescriptor (): ButtonDescriptor {
    return new ButtonDescriptor('openGroupPage', 'Ouvrir la page du groupe')
      .setFaIcon('fas fa-arrow-right')
      .setStyle('icon-round')
  }

  get deleteGroupButtonDescriptor (): ButtonDescriptor {
    return new ButtonDescriptor('deleteGroup', 'Supprimer le groupe')
      .setFaIcon('far fa-trash-alt')
      .setStyle('icon-round')
  }

  setGroupForDeletion () {
    groupListModule.setGroupToDelete(this.data)
  }
}
</script>

<style scoped lang="scss">
.group-list-row-details {
  display: flex;
  margin: 5px;

  &::v-deep button {
    margin: 7px;
  }
}
</style>
