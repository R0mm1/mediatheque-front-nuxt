<template>
  <Author :author-id="authorId" />
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRoute } from "vue-router";
import Author from "~/components/author/Author.vue";

const route = useRoute();
const authorId = computed(() => parseInt(route.params.id as string));
</script>

<style scoped>
.group_information {
  max-width: 350px;
}
</style>
