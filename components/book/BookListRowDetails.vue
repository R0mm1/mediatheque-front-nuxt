<template>
  <div class="book-list-row-details">
    <div class="details-summary">
      <template v-if="hasSummary">
        {{ summary }}
      </template>
      <template v-else>
        <i>Pas de résumé disponible</i>
      </template>
    </div>
    <div class="details-right-col">
      <MedInputButton :button-descriptor="openBookPageButtonDescriptor" />
    </div>
  </div>
</template>

<script lang="ts">

import { Vue, Component, Prop } from 'vue-property-decorator'
import ButtonDescriptor from '~/assets/ts/form/ButtonDescriptor'
import MedInputButton from '~/components/form/elements/MedInputButton.vue'
import { BookItem } from '~/assets/ts/models/Book'

@Component({
  components: { MedInputButton }
})
export default class BookListRowDetails extends Vue {
  @Prop({ type: Object, required: true }) data!: BookItem

  get summary () {
    if (this.hasSummary) {
      return this.data.shortSummary + '…'
    }
    return ''
  }

  get openBookPageButtonDescriptor () {
    return new ButtonDescriptor('openBookPage', 'Ouvrir la page du livre')
  }

  get hasSummary () {
    return typeof this.data.shortSummary === 'string' && this.data.shortSummary.length > 0
  }
}
</script>

<style scoped lang="scss">

@import "~/assets/scss/colors.scss";

.book-list-row-details {
  display: flex;
  margin: 5px 0;
}

.details-summary{
  width: 515px;
  overflow: hidden;
  border-right: $shade0 1px solid;
  padding-right: 15px;
}

.details-right-col{
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin-left: 15px;
}

</style>
