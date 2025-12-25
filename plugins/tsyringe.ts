import { container } from 'tsyringe'
import type Auth from '~/assets/ts/config/public/Auth'
import type Api from '~/assets/ts/config/public/Api'
import Tokens from '~/assets/ts/config/Public'

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig()

  container.register<Auth>(Tokens.auth, { useValue: config.public.auth as Auth })
  container.register<Api>(Tokens.api, { useValue: config.public.api as Api })
  container.register(Tokens.default, { useValue: config.public.default })

  return {
    provide: {
      container
    }
  }
})
