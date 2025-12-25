<template>
  <AudioBook :book-id="bookId" />
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import AudioBook from "~/components/book/AudioBook.vue";

const route = useRoute();
const bookId = computed(() => parseInt(route.params.id as string));
</script>

<style scoped></style>
