<template>
  <AudioBook :book-id="bookId" />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import AudioBook from '~/components/book/AudioBook.vue'

@Component({
  components: { AudioBook }
})
export default class ElectronicBookPage extends Vue {
  bookId!: Number

  created () {
    this.bookId = parseInt(this.$route.params.id)
  }
}
</script>

<style scoped>
</style>
