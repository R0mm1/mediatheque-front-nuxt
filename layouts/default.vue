<template>
  <div id="default_layout" class="med_layout">
    <Header />
    <Nuxt />
  </div>
</template>

<script>
import 'reflect-metadata'
import LoginWorkflowService from 'assets/ts/service/auth/LoginWorkflowService'
import Header from '~/components/header/Header'

export default {
  components: { Header },
  middleware () {
    (new LoginWorkflowService()).start()
  }
}
</script>

<style>
@import "assets/scss/layout.scss";
</style>
