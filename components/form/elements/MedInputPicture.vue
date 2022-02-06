<template>
  <FormElement :name="name" container-custom-classes="form_element_picture">
    <template #element_label>
      <span />
    </template>

    <template #element_content>
      <div
        class="picture_preview"
        :style="'background-image: url('+pictureSrc+')'"
        @click="displayFileChooser"
      >
        <Loader v-if="isPictureLoading" class="loader" type="s" />
        <div v-if="!hasPictureLoaded && !isPictureLoading" class="preview_default">
          <i class="far fa-image" />
        </div>
      </div>
      <div class="picture_buttons">
        <MedInputButton :button-descriptor="buttonUploadDescriptor" @click.native="displayFileChooser" />
        <MedInputButton :button-descriptor="buttonDownloadDescriptor" @click.native="download" />
        <MedInputButton :button-descriptor="buttonDeleteDescriptor" @click.native="clear" />
      </div>
      <input ref="inputFile" type="file" :name="name" @change="reloadPreview">
    </template>
  </FormElement>
</template>

<script>
import Loader from '@/components/widgets/Loader'
import FormElement from '@/components/form/FormElement'
import ButtonDescriptor from 'assets/ts/form/ButtonDescriptor'
import MedInputButton from '@/components/form/elements/MedInputButton'

export default {
  name: 'InputPicture',
  components: { MedInputButton, Loader, FormElement },
  props: {
    name: { type: String, default: '' },
    src: { type: Promise, required: true },
    autofillSrcOnChange: { type: Boolean, default: false }
  },
  data () {
    return {
      pictureSrc: '',
      isPictureLoading: false
    }
  },
  computed: {
    hasPictureLoaded () {
      return typeof this.pictureSrc !== 'undefined' && this.pictureSrc.length > 0
    },
    buttonUploadDescriptor () {
      return new ButtonDescriptor('upload').setFaIcon('fas fa-file-upload')
    },
    buttonDownloadDescriptor () {
      const buttonDescriptor = new ButtonDescriptor('download').setFaIcon('fas fa-file-download')
      buttonDescriptor.disabled = !this.hasPictureLoaded
      return buttonDescriptor
    },
    buttonDeleteDescriptor () {
      const buttonDescriptor = new ButtonDescriptor('delete').setFaIcon('fas fa-trash-alt')
      buttonDescriptor.disabled = !this.hasPictureLoaded
      return buttonDescriptor
    }
  },
  watch: {
    src (newSrc) {
      this.setSrc(newSrc)
    }
  },
  created () {
    this.setSrc(this.src)
  },
  methods: {
    displayFileChooser () {
      this.$refs.inputFile.click()
    },
    reloadPreview (e) {
      this.isPictureLoading = true

      const file = e.target.files[0]

      if (this.autofillSrcOnChange) {
        this.pictureSrc = URL.createObjectURL(file)
      }

      this.$emit('picture-changed', file)

      this.isPictureLoading = false
    },
    clear () {
      if (!this.hasPictureLoaded) {
        return
      }

      this.pictureSrc = ''
      this.$emit('picture-changed', undefined)
    },
    download () {
      if (!this.hasPictureLoaded) {
        return
      }

      const a = document.createElement('a')
      a.href = this.pictureSrc
      a.download = 'picture'
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
    },
    setSrc (newSrc) {
      this.isPictureLoading = true
      Promise.resolve(newSrc)
        .then((src) => {
          this.pictureSrc = src
          this.isPictureLoading = false
        })
        .catch((error) => {
          console.error(error)
          this.isPictureLoading = false
        })
    }
  }
}
</script>

<style scoped lang="scss">
    @import "../../../assets/scss/colors";
    @import "../../../assets/scss/breakpoints";

    input[type="file"] {
        display: none;
    }

    .picture_preview {
        display: flex;
        width: 160px;
        height: 251px;
        margin: auto;
        background-repeat: no-repeat;
        background-size: contain;
        background-position: center;
        position: relative;

        .preview_default {
            margin: auto;
            font-size: 5rem;
            color: #4d4d4d;
        }

        .loader {
            height: 50px;
            margin: auto;
        }
    }

    .picture_buttons {
        display: flex;
        justify-content: center;
        border-top: 1px solid $shade2;
        padding-top: 7px;
        margin-top: 10px;

        @include phone-portrait {
            border-top: none;
            padding-top: 0;
            flex-direction: column;
            margin-right: 25px;
            margin-top: 0;
        }

        .form_element_button {
            width: 15px;
            margin: 0 3px;
            height: 15px;
            text-align: center;
            border-radius: 5px;

            @include phone-portrait {
                margin: 3px 0;
            }
        }
    }
</style>

<style lang="scss">
    @import "../../../assets/scss/breakpoints";

    @include phone-portrait {
        .form_element_picture {
            > .element_content {
                display: flex;
                flex-direction: row;
            }

            > .element_label {
                display: none;
            }
        }
    }
</style>
