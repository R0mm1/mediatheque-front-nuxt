<template>
  <GroupInformation :book-module="bookElectronicModule" :edit-mode-on="editModeOn">
    <template #specific-fields>
      <MedFiles :files-descriptor="filesDescriptor" :files="electronicFile" />
    </template>
  </GroupInformation>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import GroupInformation from '@/components/book/groups/mainTab/GroupInformation.vue'
import bookElectronicModule from '@/assets/ts/store/book/BookElectronicModule'
import MedFile from '~/assets/ts/objects/MedFile'
import FilesDescriptor from '~/assets/ts/form/FilesDescriptor'
import MedFiles from '~/components/form/elements/MedFiles.vue'

@Component({
  components: {
    GroupInformation,
    MedFiles
  }
})
export default class PaperGroupInformation extends Vue {
  @Prop({ type: Boolean, required: true }) editModeOn!:boolean

  bookElectronicModule = bookElectronicModule

  get filesDescriptor () {
    return new FilesDescriptor()
      .setMaxFiles(1)
      .setName('electronicBook')
      .setLabel('Livre')
      .setOnFileAdded(this.setElectronicBook.bind(this))
      .setOnFileRemoved(this.removeElectronicBook.bind(this))
      .setDownloadAction(this.downloadEbook.bind(this))
  }

  setElectronicBook (file: MedFile) {
    if (!(file.file instanceof File)) {
      throw new TypeError('file property of MedFile must be a File')
    }
    bookElectronicModule.linkNewFile(file as {file: File, name: string})
  }

  removeElectronicBook () {
    bookElectronicModule.unlinkBookFile()
  }

  downloadEbook () {
    bookElectronicModule.downloadEbook()
  }

  get electronicFile () {
    const filesArray = []

    if (typeof bookElectronicModule.book.bookFile === 'object' && bookElectronicModule.book.bookFile !== null) {
      filesArray.push(
        new MedFile()
          .setFile(bookElectronicModule.book.bookFile.path)
          .setName(bookElectronicModule.ebookFilename)
          .setId(bookElectronicModule.book.bookFile.id.toString())
          .setIsNew(false)
      )
    }

    return filesArray
  }
}
</script>

<style scoped>

</style>
