<template>
  <Popup :is-displayed="true" data-cy="popupBookDelete">
    <template #popup_header>
      {{ $t('reference_groups.remove_element.popup.header') }}
    </template>
    <template #popup_body>
      {{ $t('reference_groups.remove_element.popup.body', {bookTitle, groupComment}) }}
    </template>
    <template #popup_footer>
      <MedInputButton :button-descriptor="cancelButtonDescriptor" @click.native="$emit('group-book-delete-cancel')" />
      <MedInputButton :button-descriptor="deleteButtonDescriptor" @click.native="$emit('group-book-delete-trigger')" />
    </template>
  </Popup>
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'
import Popup from '~/components/widgets/Popup.vue'
import MedInputButton from '~/components/form/elements/MedInputButton.vue'
import ButtonDescriptor from '~/assets/ts/form/ButtonDescriptor'

@Component({
  components: {
    MedInputButton,
    Popup
  }
})
export default class GroupBookDeletePopup extends Vue {
  @Prop({ type: String, default: '' }) groupComment!:string
  @Prop({ type: String, default: '' }) bookTitle!:string

  deleteButtonDescriptor = (new ButtonDescriptor('remove', this.$t('reference_groups.remove_element.popup.action.remove').toString()))
    .setDataCy('buttonRemove')

  cancelButtonDescriptor = (new ButtonDescriptor('cancel', this.$t('reference_groups.remove_element.popup.action.cancel').toString()))
    .setDataCy('buttonCancel')
}
</script>

<style scoped lang="scss">
.widget_popup {
  z-index: 1;
  max-width: 500px;
  top: 50px;
  left: 50%;
  transform: translateX(-50%);
}
</style>
