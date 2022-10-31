<template>
  <BookBook
    :book-id="bookId"
    :edit-mode-on="editModeOn"
    :book-module="bookModule"
    book-page-url="/book/paper"
    main-tab-component-path="book/paperBook/MainTab.vue"
    social-tab-component-path="book/paperBook/SocialTab.vue"
  />
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import bookPaperModule from '~/assets/ts/store/book/BookPaperModule'
import BookBook from '~/components/book/Book.vue'

@Component({
  components: { BookBook }
})
export default class PaperBook extends Vue {
  @Prop({ type: Number, required: false }) bookId!: number|null
  @Prop({ type: Boolean, required: false, default: false }) editModeOn!:boolean

  bookModule = bookPaperModule
}
</script>
