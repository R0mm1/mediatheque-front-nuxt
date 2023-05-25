<template>
  <Group custom-class="information">
    <template #group_name>
      {{ $t('reference_groups.entity_layout.group_information') }}
    </template>

    <template #group_content>
      <MedInputText v-model="comment" :text-descriptor="commentTextDescriptor" />
    </template>
  </Group>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Group from '~/components/page/Group.vue'
import referenceGroupModule from '~/assets/ts/store/book/ReferenceGroupModule'
import TextDescriptor from '~/assets/ts/form/TextDescriptor'
import MedInputText from '~/components/form/elements/MedInputText.vue'

@Component({
  components: {
    MedInputText,
    Group
  }
})
export default class GroupInformation extends Vue {
  get comment () {
    return referenceGroupModule.referenceGroup.comment
  }

  get commentTextDescriptor () {
    return new TextDescriptor('comment')
      .setLabel(this.$t('reference_groups.comment').toString())
      .setEditModeOn(false)
      .setDataCy('referenceGroupComment')
  }
}
</script>

<style scoped lang="scss">
.group_information{
  min-width: 350px;
}
</style>
