<template>
  <Popup :is-displayed="isDisplayed">
    <template #popup_header>
      Lecture automatique du résumé
    </template>
    <template #popup_body>
      <Tabs v-model="activeTab" :tabs="tabs">
        <template #tab-content>
          <div
            v-if="activeTab === 'camera'"
            id="video-container"
            class="process-step"
            :class="{'current-step': step === 'capture'}"
          >
            <div id="delimiter">
              <div id="delimiter-left" />
              <div id="delimiter-central" />
              <div id="delimiter-right" />
            </div>
            <video ref="cameraStream">Le flux vidéo n'est pas disponible.</video>
          </div>
          <div
            v-if="activeTab === 'file'"
            id="link-container"
            class="process-step"
            :class="{'current-step': step === 'capture'}"
          >
            <MedFiles :files-descriptor="fileDescriptor" :files="[]" />
          </div>
          <div
            id="treatment-container"
            class="process-step"
            :class="{'current-step': step === 'recognition' || step === 'done'}"
          >
            <canvas ref="capturedImage" />
            <div v-if="typeof recognizedText !== 'string'" id="progress-details">
              <div id="progress-bar">
                <div id="progress-done" :style="{'width': ocrRecognitionProcessDone+'%'}" />
              </div>
            </div>
            <div v-if="typeof recognizedText === 'string'" id="result">
              {{ recognizedText }}
            </div>
          </div>
          <div id="error-container" class="error-step" :class="{'current-step': step === 'failure'}">
            {{ error }}
          </div>
        </template>
      </Tabs>
    </template>
    <template #popup_footer>
      <MedInputButton
        v-if="step === 'capture' || step === 'done' || step === 'error'"
        :button-descriptor="cancelButtonDescriptor"
        @click.native="$emit('cancel')"
      />
      <MedInputButton
        v-if="step==='capture' && activeTab==='camera'"
        :button-descriptor="readSummaryButtonDescriptor"
        @click.native="readSummary"
      />
      <MedInputButton
        v-if="step==='done' || step==='error'"
        :button-descriptor="retryButtonDescriptor"
        @click.native="reinit"
      />
      <MedInputButton v-if="step==='done'" :button-descriptor="validateButtonDescriptor" @click.native="updateSummary" />
    </template>
  </Popup>
</template>

<script lang="ts">
import { Component, Emit, Prop, Vue, Watch } from 'vue-property-decorator'
import Tesseract from 'tesseract.js'
import Popup from '~/components/widgets/Popup.vue'
import MedInputButton from '~/components/form/elements/MedInputButton.vue'
import ButtonDescriptor from '~/assets/ts/form/ButtonDescriptor'
import Tabs, { TabData } from '~/components/widgets/Tabs.vue'
import MedInputText from '~/components/form/elements/MedInputText.vue'
import FilesDescriptor from '~/assets/ts/form/FilesDescriptor'
import MedFiles from '~/components/form/elements/MedFiles.vue'
import MedFile from '~/assets/ts/objects/MedFile'
import bookPaperModule from '~/assets/ts/store/book/BookPaperModule'

type ProcessStep = 'capture' | 'recognition' | 'done' | 'error';
type TabId = 'file' | 'camera';

@Component({
  components: {
    MedFiles,
    MedInputText,
    Tabs,
    Popup,
    MedInputButton
  }
})
export default class BookEditPopupOcrSummary extends Vue {
  @Prop({
    type: Boolean,
    default: false
  }) isDisplayed!: boolean

  readonly tabs: TabData[] = [
    {
      id: 'file',
      label: 'Fichier'
    },
    {
      id: 'camera',
      label: 'Caméra'
    }
  ]

  readSummaryButtonDescriptor = new ButtonDescriptor('readSummary', 'Lire')
  validateButtonDescriptor = new ButtonDescriptor('validate', 'Valider')
  retryButtonDescriptor = new ButtonDescriptor('retry', 'Essayer de nouveau')
  cancelButtonDescriptor = (new ButtonDescriptor('cancel', 'Annuler')).setStyle('negative')

  fileDescriptor = (new FilesDescriptor())
    .setName('file')
    .setMaxFiles(1)
    .setOnFileAdded(this.setFile.bind(this))
    .setAddButtonLabel('Charger une image')

  setFile (medFile: MedFile) {
    if (typeof medFile.file === 'object') {
      (this as BookEditPopupOcrSummary).file = medFile.file
    }
    return Promise.resolve()
  }

  file: File | null = null

  @Watch('file')
  fileChanged () {
    this.readSummary()
  }

  ocrRecognitionProcessDone = 0

  step: ProcessStep = 'capture'

  recognizedText: string | null = null

  activeTab: TabId = 'file'

  @Watch('activeTab')
  activeTabChanged () {
    this.reinit()
  }

  error: string | null = null

  @Watch('isDisplayed')
  @Watch('activeTab')
  isDisplayChanged () {
    if (this.isDisplayed && this.activeTab === 'camera') {
      Vue.nextTick(() => {
        const video = (this.$refs.cameraStream as HTMLVideoElement)
        navigator.mediaDevices.getUserMedia({
          video: true,
          audio: false
        })
          // on success, stream it in video tag
          .then(function (stream) {
            video.srcObject = stream
            video.play()
          })
          .catch(function (err) {
            console.error('An error occurred: ' + err)
          })
      })
    } else {
      const video = (this.$refs.cameraStream as HTMLVideoElement | undefined)
      if (typeof video !== 'undefined') {
        video.srcObject = null
      }
    }
  }

  getImageFromCamera (): Promise<Blob | null> {
    return new Promise((resolve, reject) => {
      const video = (this.$refs.cameraStream as HTMLVideoElement | undefined)
      const canvas = (this.$refs.capturedImage as HTMLCanvasElement | undefined)

      if (typeof video === 'undefined' || typeof canvas === 'undefined') {
        return reject(new Error('Could not find required elements, are we on the right tab?'))
      }

      console.log(canvas, canvas.getContext('2d') === null)
      const context = canvas.getContext('2d')
      if (context !== null) {
        const ratioWidth = video.videoWidth / video.clientWidth
        const ratioHeight = video.videoHeight / video.clientHeight
        canvas.width = 175
        canvas.height = 250
        context.drawImage(
          video,
          (video.videoWidth - (175 * ratioWidth)) / 2,
          0,
          175 * ratioWidth,
          250 * ratioHeight,
          0,
          0,
          175,
          250
        )

        context.canvas.toBlob(data => resolve(data))
      } else {
        reject(new Error('Could not get context from canvas'))
      }
    })
  }

  getImageFromFile (): Promise<Blob | null> {
    return new Promise((resolve, reject) => {
      if (this.file === null) {
        return reject(new Error('File is null'))
      }
      const canvas = (this.$refs.capturedImage as HTMLCanvasElement | undefined)

      if (typeof canvas === 'undefined') {
        return reject(new Error('Could not find canvas'))
      }

      createImageBitmap(this.file).then((image) => {
        canvas.height = 250
        const imgRatio = canvas.height / image.height
        canvas.width = image.width * imgRatio

        canvas.getContext('2d')?.drawImage(image, 0, 0, image.width, image.height, 0, 0, canvas.width, canvas.height)
      })
      resolve(new Blob([this.file]))
    })
  }

  readSummary () {
    this.recognizedText = null
    this.step = 'recognition'
    this.ocrRecognitionProcessDone = 0

    let blobPromise: Promise<Blob | null> | null = null
    if (this.activeTab === 'camera') {
      blobPromise = this.getImageFromCamera()
    } else if (this.activeTab === 'file') {
      blobPromise = this.getImageFromFile()
    }

    if (blobPromise === null) {
      console.error('Could not determine which image source to use')
      return
    }

    blobPromise
      .then((blob) => {
        if (blob === null) {
          return Promise.reject(new Error('Blob is null'))
        }

        const file = new File([blob], 'capturedImage')

        try {
          Tesseract
            .recognize(
              file,
              'fra',
              {
                logger: (m) => {
                  if (m.status === 'recognizing text') {
                    this.ocrRecognitionProcessDone = m.progress * 100
                  }
                }
              }
            )
            .then(({ data: { text } }) => {
              this.ocrRecognitionProcessDone = 100
              this.recognizedText = text
              this.step = 'done'
            })
            .catch(err => this.displayStandardError(err))
        } catch (err) {
          console.error(err)
          this.displayStandardError(null)
        }
      })
      .catch(err => this.displayStandardError(err))
  }

  displayStandardError (consoleError: Error | string | null) {
    if (consoleError !== null) {
      console.error(consoleError)
    }
    this.error = 'La reconnaissance du texte a échoué'
    this.step = 'error'
  }

  reinit () {
    this.step = 'capture'
    this.recognizedText = null
  }

  @Emit('summary-updated')
  updateSummary () {
    if (typeof this.recognizedText === 'string') {
      bookPaperModule.setSummary(this.recognizedText)
      this.reinit()
    }
  }
}
</script>

<style scoped lang="scss">
@import "~assets/scss/colors.scss";

.process-step {
  display: none;
  padding: 7px 0;

  &.current-step {
    display: block;
  }
}

#video-container {
  position: relative;

  &.current-step {
    display: block;
  }

  #delimiter {
    position: absolute;
    display: flex;
    justify-content: center;
    left: 0;
    right: 0;

    #delimiter-left, #delimiter-right {
      background-color: rgba(255, 255, 255, .3);
      flex: 1;
    }

    #delimiter-central {
      border: 1px solid red;
      height: 250px;
      width: 175px;
    }
  }

  video {
    height: 250px;
  }
}

#treatment-container {
  &.current-step {
    display: flex;
  }

  #progress-details {
    padding: 0 20px;
    display: flex;
    flex-direction: column;
    justify-content: center;
  }

  #progress-bar, #progress-done {
    width: 250px;
    height: 2rem;
  }

  #progress-done {
    background: $shade0;
  }

  #progress-bar {
    border: 1px solid $shade0;
    border-radius: 5px;
    overflow: hidden;
  }

  canvas {
    height: 250px;
  }

  #result {
    max-width: 250px;
    font-size: .9rem;
    padding-left: 20px;
  }
}
</style>
