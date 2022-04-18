<template>
  <div>Please wait...</div>
</template>

<script lang="ts">
import Vue from 'vue'
import { container } from 'tsyringe'

import LoginService from '~/assets/ts/service/auth/LoginService'

export default Vue.extend({
  layout: 'authentication',
  created () {
    const loginService = container.resolve(LoginService)
    loginService.login()
  }
})
</script>

<style scoped>

</style>
