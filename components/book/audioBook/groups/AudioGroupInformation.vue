<template>
  <GroupInformation :book-module="bookAudioModule" :edit-mode-on="editModeOn">
    <template #specific-fields>
      <MedFiles :files-descriptor="filesDescriptor" :files="audioBookFile" />
    </template>
  </GroupInformation>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import GroupInformation from '@/components/book/groups/mainTab/GroupInformation.vue'
import bookAudioModule from '~/assets/ts/store/book/BookAudioModule'
import MedFile from '~/assets/ts/objects/MedFile'
import FilesDescriptor from '~/assets/ts/form/FilesDescriptor'
import MedFiles from '~/components/form/elements/MedFiles.vue'

@Component({
  components: {
    GroupInformation,
    MedFiles
  }
})
export default class AudioGroupInformation extends Vue {
  @Prop({ type: Boolean, required: true }) editModeOn!:boolean

  bookAudioModule = bookAudioModule

  get filesDescriptor () {
    const filesDescriptor = new FilesDescriptor()
      .setMaxFiles(1)
      .setName('audioBook')
      .setLabel('Livre')
      .setOnFileAdded(this.setAudioBook.bind(this))
      .setDownloadAction(this.downloadAudioBook.bind(this))

    if (this.editModeOn) {
      filesDescriptor
        .setOnFileRemoved(this.removeAudioBook.bind(this))
    }

    return filesDescriptor
  }

  setAudioBook (file: MedFile) {
    if (!(file.file instanceof File)) {
      throw new TypeError('file property of MedFile must be a File')
    }
    return this.bookAudioModule.linkNewFile(file as {file: File, name: string})
  }

  removeAudioBook () {
    this.bookAudioModule.unlinkBookFile()
  }

  downloadAudioBook () {
    this.bookAudioModule.downloadBookFile()
  }

  get audioBookFile () {
    const filesArray = []

    if (typeof this.bookAudioModule.book.bookFile === 'object' && this.bookAudioModule.book.bookFile !== null) {
      filesArray.push(
        new MedFile()
          .setFile(this.bookAudioModule.book.bookFile.path)
          .setName(this.bookAudioModule.audioBookFilename)
          .setId(this.bookAudioModule.book.bookFile.id.toString())
          .setIsNew(false)
      )
    }

    return filesArray
  }
}
</script>

<style scoped>

</style>
