<template>
  <div class="book-list-row-details">
    <div v-if="hasSummary" class="summary-container details-summary">
      {{ summary }}
    </div>
    <div v-else class="summary-container no-summary">
      Pas de résumé disponible
    </div>

    <div class="details-right-col">
      <MedInputButton :button-descriptor="openBookPageButtonDescriptor" />
      <MedInputButton :button-descriptor="deleteBookButtonDescriptor" @click.native.stop="setBookForDeletion" />
      <MedInputButton
        v-if="isDownloadButtonDisplayed"
        :button-descriptor="downloadBookButtonDescriptor"
        @click.native.stop="setBookForDownload"
      />
    </div>
  </div>
</template>

<script lang="ts">

import { Vue, Component, Prop } from 'vue-property-decorator'
import ButtonDescriptor from '~/assets/ts/form/ButtonDescriptor'
import MedInputButton from '~/components/form/elements/MedInputButton.vue'
import { BookItem } from '~/assets/ts/models/Book'
import bookListModule from '~/assets/ts/store/list/BookListModule'
import BookService from '~/assets/ts/service/BookService'
import { BookElectronicItem } from '~/assets/ts/models/BookElectronic'
import { BookAudioItem } from '~/assets/ts/models/BookAudio'
import { BookPaperItem } from '~/assets/ts/models/BookPaper'

@Component({
  components: { MedInputButton }
})
export default class BookListRowDetails extends Vue {
  @Prop({
    type: Object,
    required: true
  }) data!: BookItem

  get summary (): string {
    if (this.hasSummary) {
      return this.data.shortSummary + '…'
    }
    return ''
  }

  get openBookPageButtonDescriptor (): ButtonDescriptor {
    return new ButtonDescriptor('openBookPage', 'Ouvrir la page du livre')
      .setFaIcon('fas fa-arrow-right')
      .setStyle('icon-round')
  }

  get deleteBookButtonDescriptor (): ButtonDescriptor {
    return new ButtonDescriptor('deleteBook', 'Supprimer le livre')
      .setFaIcon('far fa-trash-alt')
      .setStyle('icon-round')
  }

  get downloadBookButtonDescriptor (): ButtonDescriptor {
    const downloadButtonIds = {
      [BookService.bookElectronic]: 'download_electronic',
      [BookService.bookAudio]: 'download_audio'
    }

    const bookType = this.data['@type'] ?? ''

    return new ButtonDescriptor(
      downloadButtonIds[bookType] ?? '',
      this.$t('books.list.download_book_button_label').toString()
    )
      .setFaIcon('fas fa-file-download')
      .setStyle('icon-round')
  }

  get hasSummary (): boolean {
    return typeof this.data.shortSummary === 'string' && this.data.shortSummary.length > 0
  }

  setBookForDeletion () {
    bookListModule.setBookToDelete(this.data)
  }

  setBookForDownload () {
    if (this.isDownloadable(this.data)) {
      bookListModule.setBookToDownload(this.data)
    }
  }

  get isDownloadButtonDisplayed (): boolean {
    return this.isDownloadable(this.data)
  }

  isDownloadable (data: BookPaperItem | BookElectronicItem | BookAudioItem): data is BookAudioItem | BookElectronicItem {
    return typeof this.data['@type'] === 'string' &&
      (this.data['@type'] === BookService.bookAudio || this.data['@type'] === BookService.bookElectronic)
  }
}
</script>

<style scoped lang="scss">

@import "~/assets/scss/colors.scss";

.book-list-row-details {
  display: flex;
  margin: 5px 0;
}

.summary-container {
  width: 515px;
  border-right: $shade0 1px solid;

  &.details-summary {
    overflow: hidden;
    padding-right: 15px;
  }

  &.no-summary {
    display: flex;
    align-items: center;
    justify-content: center;
    font-style: italic;
    color: $textDisabled;
  }
}

.details-right-col {
  display: flex;
  align-items: center;
  margin-left: 8px;

  &::v-deep button {
    margin: 7px;
  }
}

</style>
