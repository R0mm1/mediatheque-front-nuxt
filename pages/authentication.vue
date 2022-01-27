<template>
  <div>Please wait...</div>
</template>

<script lang="ts">
import Vue from 'vue'
import { container } from 'tsyringe'

import LoginService from '~/assets/ts/service/auth/LoginService'

const loginService = container.resolve(LoginService)

export default Vue.extend({
  layout: 'login',
  created () {
    loginService.login()
  }
})
</script>

<style scoped>

</style>
