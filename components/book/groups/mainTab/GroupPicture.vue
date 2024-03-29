<template>
  <Group custom-class="picture">
    <template #group_name>
      Couverture
    </template>
    <template #group_content>
      <InputPicture name="picture" :src="src" :with-manipulation-buttons="editModeOn" :wait-before-ready="uploading" @picture-changed="pictureChanged" />
    </template>
  </Group>
</template>

<script>
import { container } from 'tsyringe'
import Group from '@/components/page/Group'
import InputPicture from '@/components/form/elements/MedInputPicture'
import RequestService from '@/assets/ts/service/RequestService'

export default {
  name: 'GroupPicture',
  components: { InputPicture, Group },
  props: {
    bookModule: { type: Object, required: true },
    editModeOn: { type: Boolean, required: true }
  },
  data () {
    return {
      src: Promise.resolve(''),
      uploading: false
    }
  },
  computed: {
    cover () {
      const cover = this.bookModule.book.cover

      if (typeof cover === 'undefined' || cover === null) {
        return ''
      } else if (typeof cover === 'string') {
        return cover
      } else if (typeof cover === 'object' && typeof cover['@id'] !== 'undefined') {
        return cover['@id']
      } else if (typeof cover === 'object' && cover.id === 0 && this.bookModule.tempNewCover instanceof File) {
        return this.bookModule.tempNewCover
      }
      return ''
    }
  },
  watch: {
    cover () {
      this.load()
    }
  },
  created () {
    this.load()
  },
  methods: {
    pictureChanged (newFile) {
      this.bookModule.unlinkCover()
      if (typeof newFile !== 'undefined') {
        this.uploading = true
        this.bookModule
          .linkNewCover({
            file: newFile,
            name: newFile.name
          })
          .finally(() => {
            this.uploading = false
          })
      }
    },
    load () {
      if (this.cover.length === 0) { return }

      const setFile = (file) => {
        const urlCreator = window.URL || window.webkitURL
        return Promise.resolve(urlCreator.createObjectURL(file))
      }

      if (this.cover instanceof File) {
        this.src = setFile(this.cover)
      } else {
        const requestService = container.resolve(RequestService)
        const request = requestService.createRequest(this.cover).setResponseType('blob')
        this.src = requestService.execute(request, {
          skipCommonUrlBase: true
        })
          .then(data => setFile(data))
          .catch((error) => {
            console.error(error)
          })
      }
    }
  }
}
</script>

<style lang="scss">
</style>
