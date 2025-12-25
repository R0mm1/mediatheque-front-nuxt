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

<script setup lang="ts">
import BookBook from "~/components/book/Book.vue";
import bookElectronicModule from "~/assets/ts/store/book/BookElectronicModule";

interface Props {
  bookId?: number | null;
  editModeOn?: boolean;
}

withDefaults(defineProps<Props>(), {
  bookId: null,
  editModeOn: false,
});

const bookModule = bookElectronicModule;
</script>
