<template>
  <Group>
    <template #group_name>
      Partager le livre
    </template>
    <template #group_content>
      Partagez le livre avec le lien suivant:
      <MedInputTextWithButton v-model="shareLink" :text-with-button-descriptor="shareLinkTextWithButtonDescriptor" />
    </template>
  </Group>
</template>

<script>
import Group from '@/components/page/Group'
import MedInputTextWithButton from '@/components/form/elements/MedInputTextWithButton'
import TextDescriptor from 'assets/ts/form/TextDescriptor'
import TextWithButtonDescriptor from 'assets/ts/form/TextWithButtonDescriptor'

export default {
  name: 'GroupShare',
  components: { MedInputTextWithButton, Group },
  props: { bookModule: { type: Object, required: true } },
  computed: {
    shareLink () {
      return document.URL
    },
    shareLinkTextWithButtonDescriptor () {
      const textDescriptor = new TextDescriptor('shareLink').setDisabled(true)
      return new TextWithButtonDescriptor(textDescriptor).setWithCopyContentButton(true)
    }
  }
}
</script>

<style scoped>

</style>
