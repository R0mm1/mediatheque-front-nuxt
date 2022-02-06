import { container } from 'tsyringe'
import { NuxtApp } from '@nuxt/types/app'
import Auth from '~/assets/ts/config/public/Auth'
import Api from '~/assets/ts/config/public/Api'
import Tokens from '~/assets/ts/config/Public'

export default ({ app }: {app: NuxtApp}) => {
  container.register<Auth>(Tokens.auth, { useValue: app.$config.auth })
  container.register<Api>(Tokens.api, { useValue: app.$config.api })
  container.register(Tokens.default, { useValue: app.$config.default })
}
