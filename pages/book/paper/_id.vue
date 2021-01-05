<template>
  <PaperBook :book-id="bookId" />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import PaperBook from '~/components/book/PaperBook.vue'

@Component({
  components: { PaperBook }
})
export default class PaperBookPage extends Vue {
  bookId!: Number;

  created () {
    this.bookId = parseInt(this.$route.params.id)
  }
}
</script>

<style scoped>
</style>
