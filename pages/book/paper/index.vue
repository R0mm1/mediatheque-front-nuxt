<template>
  <PaperBook :book-id="null" :edit-mode-on="true" />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import PaperBook from '~/components/book/PaperBook.vue'

@Component({
  components: { PaperBook }
})
export default class NewPaperBookPage extends Vue {
}
</script>

<style scoped>
</style>
