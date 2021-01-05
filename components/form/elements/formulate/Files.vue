<template>
  <div
    :class="`formulate-input-element formulate-input-element--${context.type}`"
    :data-type="context.type"
  >
    <SimpleList :elements="listElements" :actions="listRowActions" />

    <div class="files_buttons">
      <MedInputButton
        v-if="!isFileLoading && !maxFilesReached"
        :button-descriptor="buttonAddDescriptor"
        @click.native="displayFileChooser"
      />
    </div>

    <Loader v-if="isFileLoading" class="loader" type="s" />

    <input ref="inputFile" type="file" :name="name" @change="addFile">
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import SimpleList, { Element, Action } from '@/components/widgets/SimpleList.vue'
import MedInputButton from '@/components/form/elements/MedInputButton.vue'
import ButtonDescriptor from '@/assets/ts/form/ButtonDescriptor'
import Loader from '@/components/widgets/Loader.vue'
import MedFile from '~/assets/ts/objects/MedFile'

@Component({
  components: { Loader, MedInputButton, SimpleList }
})
export default class Files extends Vue {
  @Prop({ type: Object, required: true }) context!: any;

  @Prop({ default: '', type: String })name!:string;
  @Prop({ default: null, type: Number })maxFiles!:number|null;
  @Prop({ default: null, type: Function })downloadAction!:null | ((bookId: string)=>any)
  @Prop({ type: Array, required: true })files!:any[];
  @Prop({ type: Function, required: true }) onFileAdded!:((file: MedFile)=>any)
  @Prop({ type: Function })onFileRemoved?:(()=>any)

  isFileLoading: boolean = false

  displayFileChooser () {
    if (!this.maxFilesReached) {
      (this.$refs.inputFile as HTMLInputElement).click()
    }
  }

  addFile (e: Event) {
    const input = e.target as HTMLInputElement
    if (input.files === null) {
      return
    }

    this.isFileLoading = true
    const file = new MedFile()
      .setFile(input.files[0])
      .setName(input.files[0].name)
      .setIsNew(true)
    Promise.resolve(this.onFileAdded(file))
      .then(() => {
        this.isFileLoading = false
      })
  }

  downloadFile (fileId: string) {
    if (typeof this.downloadAction === 'function') {
      this.downloadAction(fileId)
    }
  }

  get maxFilesReached () {
    if (this.maxFiles === null) {
      return false
    }
    return Object.keys(this.files).length >= this.maxFiles
  }

  get listElements () {
    return this.files.map((medFile) => {
      return new Element(medFile.id, medFile.name, medFile)
    })
  }

  get listRowActions () {
    const actions = []

    const getButtonDescriptor = (name: string, faIcon: string) => {
      return (new ButtonDescriptor(name)).setFaIcon(faIcon)
    }

    if (typeof this.onFileRemoved === 'function') {
      actions.push(new Action(getButtonDescriptor('fileRemove', 'fas fa-trash-alt'), this.onFileRemoved))
    }
    if (typeof this.downloadAction === 'function') {
      actions.push(new Action(getButtonDescriptor('fileDownload', 'fas fa-file-download'), this.downloadFile))
    }
    return actions
  }

  get buttonAddDescriptor () {
    return new ButtonDescriptor('add', 'Ajouter')
  }
}
</script>

<style scoped>
input[type='file'] {
  display: none;
}

.files_buttons .form_element_button {
  float: right;
}
</style>

<style lang="scss">
.form_element_files {
  > .element_label {
    line-height: 2rem;
  }

  > .element_content {
    margin-top: 5px;
  }

  .form_element_button2 .element_content {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
