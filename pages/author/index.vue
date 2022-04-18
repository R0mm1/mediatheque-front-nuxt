<template>
  <Author :author-id="null" />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Author from '~/components/author/Author.vue'

@Component({
  components: { Author }
})
export default class NewAuthorPage extends Vue {
}
</script>

<style scoped>

</style>
