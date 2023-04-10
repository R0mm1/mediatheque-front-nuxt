<template>
  <Popup :is-displayed="true">
    <template #popup_header>
      Confirmez la suppression du groupe
    </template>
    <template #popup_body>
      Voulez-vous vraiment supprimer le groupe suivant?
      <div class="group-comment">
        {{ groupComment }}
      </div>
      Cette action est définitive.
    </template>
    <template #popup_footer>
      <MedInputButton :button-descriptor="cancelButtonDescriptor" @click.native="$emit('group-delete-cancel')" />
      <MedInputButton :button-descriptor="deleteButtonDescriptor" @click.native="$emit('group-delete-trigger')" />
    </template>
  </Popup>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import Popup from '~/components/widgets/Popup.vue'
import MedInputButton from '~/components/form/elements/MedInputButton.vue'
import ButtonDescriptor from '~/assets/ts/form/ButtonDescriptor'

@Component({
  components: { MedInputButton, Popup }
})
export default class GroupListPopupDelete extends Vue {
  @Prop({ type: String, default: '' }) groupComment!:string

  deleteButtonDescriptor = new ButtonDescriptor('delete', 'Supprimer')
  cancelButtonDescriptor = new ButtonDescriptor('cancel', 'Annuler')
}
</script>

<style scoped>
.group-comment{
  margin: 10px 0;
  font-style: italic;
}
</style>
