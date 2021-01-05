<template>
  <img :src="'/images/loaders/'+type+'.svg'" alt="loading...">
</template>

<script>
export default {
  name: 'Loader',
  props: {
    type: {
      type: String,
      default: 'b'
    }
  }
}
</script>

<style scoped>
</style>
