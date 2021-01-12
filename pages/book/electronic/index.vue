<template>
  <ElectronicBook :book-id="null" :edit-mode-on="true" />
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import ElectronicBook from '~/components/book/ElectronicBook.vue'

@Component({
  components: { ElectronicBook }
})
export default class NewElectronicBookPage extends Vue {
}
</script>

<style scoped>
</style>
