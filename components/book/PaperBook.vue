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

<script setup lang="ts">
import bookPaperModule from "~/assets/ts/store/book/BookPaperModule";
import BookBook from "~/components/book/Book.vue";

interface Props {
  bookId?: number | null;
  editModeOn?: boolean;
}

withDefaults(defineProps<Props>(), {
  bookId: null,
  editModeOn: false,
});

const bookModule = bookPaperModule;
</script>
