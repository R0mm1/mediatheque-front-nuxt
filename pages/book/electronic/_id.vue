<template>
  <ElectronicBook :book-id="bookId" />
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import ElectronicBook from "~/components/book/ElectronicBook.vue";

const route = useRoute();
const bookId = computed(() => parseInt(route.params.id as string));
</script>

<style scoped></style>
