<template>
  <div id="default_layout">
    <Header />
    <Nuxt />
  </div>
</template>

<style>
html {
  height: 100%;
  font-family:
    'Source Sans Pro',
    -apple-system,
    BlinkMacSystemFont,
    'Segoe UI',
    Roboto,
    'Helvetica Neue',
    Arial,
    sans-serif;
  font-size: 16px;
  word-spacing: 1px;
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  -moz-osx-font-smoothing: grayscale;
  -webkit-font-smoothing: antialiased;
  box-sizing: border-box;
}

body {
  margin: 0;
  height: 100%;
}

#__nuxt, #__layout, #default_layout{
  height: 100%;
}

#default_layout{
  display: flex;
  flex-direction: column;
}

#default_layout > div{
  overflow: auto;
  height: 100%;
  display: flex;
  flex-direction: column;
}

*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
}
</style>
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
