<template>
  <AudioBook :book-id="null" :edit-mode-on="true" />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import AudioBook from '~/components/book/AudioBook.vue'

@Component({
  components: { AudioBook }
})
export default class NewAudioBookPage extends Vue {
}
</script>

<style scoped>
</style>
