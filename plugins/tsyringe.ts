import { defineNuxtPlugin, useRuntimeConfig } from '#app'
import { container } from 'tsyringe'
import type Auth from '~/assets/ts/config/public/Auth'
import type Api from '~/assets/ts/config/public/Api'
import Tokens from '~/assets/ts/config/Public'

export default defineNuxtPlugin((nuxtApp) => {
  const runtimeConfig = useRuntimeConfig()

  container.register<Auth>(Tokens.auth, {
    useValue: runtimeConfig.public.auth
  })
  container.register<Api>(Tokens.api, { useValue: runtimeConfig.public.api })
  container.register(Tokens.default, {
    useValue: runtimeConfig.public.default
  })
})
