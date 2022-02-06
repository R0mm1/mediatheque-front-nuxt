import { autoInjectable, inject, singleton } from 'tsyringe'
import axios from 'axios'
import Navigator from '~/assets/ts/objects/Navigator'
import Tokens from '~/assets/ts/config/Public'
import Auth from '~/assets/ts/config/public/Auth'
import Default from '~/assets/ts/config/public/Default'

@autoInjectable()
@singleton()
export default class LogoutService {
  constructor (@inject(Tokens.auth) private configAuth: Auth, @inject(Tokens.default) private configDefault: Default) {
  }

  logout () {
    const accessToken = window.sessionStorage.getItem('access_token')
    const refreshToken = window.sessionStorage.getItem('refresh_token')
    if (accessToken === null || refreshToken === null) {
      window.sessionStorage.removeItem('access_token')
      window.sessionStorage.removeItem('refresh_token')
      return Promise.reject(new Error('Missing tokens'))
    }

    return axios
      .post(
        this.configAuth.end_session_endpoint,
        (new URLSearchParams({
          client_id: this.configAuth.client_id,
          refresh_token: refreshToken
        })).toString(),
        {
          headers: {
            Authorization: 'Bearer ' + accessToken,
            'Content-type': 'application/x-www-form-urlencoded'
          }
        }
      )
      .then(() => {
        window.sessionStorage.removeItem('access_token')
        window.sessionStorage.removeItem('refresh_token')
        Navigator.navigate(this.configDefault.page)
      })
  }
}
