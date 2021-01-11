<template>
  <span>
    <span
      v-for="(author, index) in authors"
      :key="author.id"
      class="book-author"
      @click="goToAuthorPage(author.id)"
    ><!-- comment is here to connect lines and avoid unwanted white spaces to appears in browser
  --><template v-if="index !== 0">, </template>{{ author.firstname }} {{ author.lastname }}<!--
--></span>
  </span>
</template>

<script lang="ts">

import { Component, Prop, Vue } from 'vue-property-decorator'
import { AuthorEntity } from '../../../assets/ts/entity/AuthorEntity'

@Component({})
export default class HeaderAuthorsList extends Vue {
  @Prop({ type: Array, default: [] }) authors!: AuthorEntity[];

  goToAuthorPage (authorId: number) {
    this.$router.push({
      path: '/author/' + authorId
    })
  }
}
</script>

<style scoped>
.book-author {
  cursor: pointer;
}
</style>
