<template>
  <Popup :is-displayed="isDisplayed">
    <template #popup_header>
      Confirmez la suppression du livre
    </template>
    <template #popup_body>
      Voulez-vous vraiment supprimer le livre suivant?
      <div class="book-name">
        {{ bookTitle }}
      </div>
      Cette action est définitive.
    </template>
    <template #popup_footer>
      <MedInputButton :button-descriptor="cancelButtonDescriptor" @click.native="$emit('book-delete-cancel')" />
      <MedInputButton :button-descriptor="deleteButtonDescriptor" @click.native="$emit('book-delete-trigger')" />
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
export default class BookListPopupDelete extends Vue {
  @Prop({ type: Boolean, default: false }) isDisplayed!: boolean
  @Prop({ type: String, default: '' }) bookTitle!:string

  deleteButtonDescriptor = new ButtonDescriptor('delete', 'Supprimer')
  cancelButtonDescriptor = new ButtonDescriptor('cancel', 'Annuler')
}
</script>

<style scoped>
.widget_popup{
  margin-top: 40px;
}
.book-name{
  margin: 10px 0;
  font-style: italic;
}
</style>
