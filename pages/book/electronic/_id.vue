<template>
  <ElectronicBook :book-id="bookId" />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import ElectronicBook from '~/components/book/ElectronicBook.vue'

@Component({
  components: { ElectronicBook }
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
