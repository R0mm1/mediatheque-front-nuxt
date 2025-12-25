<template>
  <PaperBook :book-id="bookId" />
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import PaperBook from "~/components/book/PaperBook.vue";

const route = useRoute();
const bookId = computed(() => parseInt(route.params.id as string));
</script>

<style scoped></style>
