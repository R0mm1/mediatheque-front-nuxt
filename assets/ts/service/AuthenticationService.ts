import { autoInjectable, singleton } from 'tsyringe'

import { AxiosResponse } from 'axios'
import Request from '~/assets/ts/objects/Request'

const config = require('../../../mediatheque.json')

@autoInjectable()
@singleton()
export default class AuthenticationService {
    protected readonly tokenKey: string = 'JWT_TOKEN';
    protected readonly refreshTokenKey: string = 'JWT_REFRESH_TOKEN';

    login (username: string, password: string) {
      const request = new Request('/security/login', 'POST')
      request.setBody({
        username,
        password
      })
      request.setBaseUrl('http://' + config.api.endpoint + config.api.commonUrlBase)
      return request.trigger()
        .then((response) => {
          if (response.status !== 200) {
            return Promise.reject(response.status)
          } else {
            return Promise.resolve(response)
          }
        })
        .then(response => Promise.resolve(response.data))
        .then((response: any) => this.handleTokensInResponse(response))
    }

    isLoggedIn (): boolean {
      return this.getToken() !== null
    }

    logout () {
      localStorage.removeItem(this.tokenKey)
      localStorage.removeItem(this.refreshTokenKey)
    }

    getToken (): null | string {
      return localStorage.getItem(this.tokenKey)
    }

    refreshToken () {
      const refreshToken = localStorage.getItem(this.refreshTokenKey)

      if (refreshToken === null) {
        return Promise.reject(new Error('no_refresh_token_defined'))
      }

      const request = new Request(config.api.paths.security_refresh_token, 'POST')
      request.setBody({
        refresh_token: refreshToken
      })

      return request.trigger()
        .then((response: AxiosResponse) => this.handleTokensInResponse(response.data))
    }

    protected handleTokensInResponse (response: any) {
      localStorage.setItem(this.tokenKey, response.token)
      localStorage.setItem(this.refreshTokenKey, response.refresh_token)
      return Promise.resolve()
    }
}
