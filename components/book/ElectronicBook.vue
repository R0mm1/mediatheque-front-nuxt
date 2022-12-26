<template>
  <BookBook
    :book-id="bookId"
    :edit-mode-on="editModeOn"
    :book-module="bookModule"
    book-page-url="/book/electronic"
    main-tab-component-path="book/electronicBook/MainTab.vue"
    social-tab-component-path="book/electronicBook/SocialTab.vue"
  />
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import BookBook from '~/components/book/Book.vue'
import bookElectronicModule from '~/assets/ts/store/book/BookElectronicModule'

@Component({
  components: { BookBook }
})
export default class PaperBook extends Vue {
  @Prop({ type: Number, required: false }) bookId!: number|null
  @Prop({ type: Boolean, required: false, default: false }) editModeOn!:boolean

  bookModule = bookElectronicModule
}
</script>
