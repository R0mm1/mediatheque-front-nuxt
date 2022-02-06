<template>
  <div class="book-list-row-details">
    <div class="details-summary">
      {{ summary }}
    </div>
    <div class="details-right-col">
      <MedInputButton :button-descriptor="openBookPageButtonDescriptor" />
    </div>
  </div>
</template>

<script lang="ts">

import { Vue, Component, Prop } from 'vue-property-decorator'
import { BookEntity } from '~/assets/ts/entity/module'
import ButtonDescriptor from '~/assets/ts/form/ButtonDescriptor'
import MedInputButton from '~/components/form/elements/MedInputButton.vue'

@Component({
  components: { MedInputButton }
})
export default class BookListRowDetails extends Vue {
  @Prop({ type: Object, required: true }) data!: BookEntity

  get summary () {
    if (typeof this.data.shortSummary === 'string' && this.data.shortSummary.length > 0) {
      return this.data.shortSummary + '…'
    }
    return ''
  }

  get openBookPageButtonDescriptor () {
    return new ButtonDescriptor('openBookPage', 'Ouvrir la page du livre')
  }
}
</script>

<style scoped>
.book-list-row-details {
  display: flex;
}

.details-summary{
  max-width: 500px;
  overflow: hidden;
}

.details-right-col{
  display: flex;
  justify-content: center;
  flex-direction: column;
  margin-left: 15px;
}

</style>
