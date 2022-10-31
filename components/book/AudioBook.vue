<template>
  <BookBook
    :book-id="bookId"
    :edit-mode-on="editModeOn"
    :book-module="bookModule"
    book-page-url="/book/audio"
    main-tab-component-path="book/audioBook/MainTab.vue"
    social-tab-component-path="book/audioBook/SocialTab.vue"
  />
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import BookBook from '~/components/book/Book.vue'
import bookAudioModule from '~/assets/ts/store/book/BookAudioModule'

@Component({
  components: { BookBook }
})
export default class PaperBook extends Vue {
  @Prop({ type: Number, required: false }) bookId!: number|null
  @Prop({ type: Boolean, required: false, default: false }) editModeOn!:boolean

  bookModule = bookAudioModule
}
</script>

<style scoped>

</style>
