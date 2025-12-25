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

<script setup lang="ts">
import BookBook from "~/components/book/Book.vue";
import bookAudioModule from "~/assets/ts/store/book/BookAudioModule";

interface Props {
  bookId?: number | null;
  editModeOn?: boolean;
}

withDefaults(defineProps<Props>(), {
  bookId: null,
  editModeOn: false,
});

const bookModule = bookAudioModule;
</script>

<style scoped></style>
