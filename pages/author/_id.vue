<template>
  <Author :author-id="authorId" />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

@Component({})
export default class AuthorPage extends Vue {
  authorId!:Number

  created () {
    this.authorId = parseInt(this.$route.params.id)
  }
}
</script>

<style scoped>
.group_information{
  max-width: 350px;
}
</style>
