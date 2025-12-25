<template>
  <img :src="'/images/loaders/'+type+'.svg'" alt="loading...">
</template>

<script setup lang="ts">
interface Props {
  type?: string
}

withDefaults(defineProps<Props>(), {
  type: 'b'
})
</script>

<style scoped>
</style>
