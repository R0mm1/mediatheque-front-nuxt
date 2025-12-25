<template>
  <span>
    <span
      v-for="(author, index) in authors"
      :key="author.id"
      class="book-author"
      @click="goToAuthorPage(author.id)"
      ><!-- comment is here to connect lines and avoid unwanted white spaces to appears in browser
  --><template v-if="index !== 0">, </template>{{ author.person.firstname }}
      {{ author.person.lastname
      }}<!--
--></span
    >
  </span>
</template>

<script setup lang="ts">
import { useRouter } from "vue-router";
import { Author } from "~/assets/ts/models/Author";

interface Props {
  authors?: Author[];
}

withDefaults(defineProps<Props>(), {
  authors: () => [],
});

const router = useRouter();

const goToAuthorPage = (authorId: number) => {
  router.push({
    path: "/author/" + authorId,
  });
};
</script>

<style scoped>
.book-author {
  cursor: pointer;
}
</style>
