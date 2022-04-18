<template>
  <div id="default_layout">
    <Header :no-user="true" />
    <Nuxt />
  </div>
</template>

<style>
</style>
<script>
import 'reflect-metadata'
import Header from '~/components/header/Header'

export default {
  components: { Header }
}
</script>
