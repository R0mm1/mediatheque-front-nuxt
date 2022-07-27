<template>
  <div id="authentication_layout">
    <Header :no-user="true" />
    <Nuxt />
  </div>
</template>

<script>
import 'reflect-metadata'
import Header from '~/components/header/Header'

export default {
  components: { Header }
}
</script>
<style>
</style>
