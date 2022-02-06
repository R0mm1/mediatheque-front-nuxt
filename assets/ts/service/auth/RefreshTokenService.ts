import { inject, injectable, singleton } from 'tsyringe'
import axios from 'axios'
import Tokens from '~/assets/ts/config/Public'
import Auth from '~/assets/ts/config/public/Auth'

@injectable()
@singleton()
export default class RefreshTokenService {
  constructor (@inject(Tokens.auth) private configAuth: Auth) {
  }

  refresh () : Promise<void> {
    const refreshToken = window.sessionStorage.getItem('refresh_token')
    if (refreshToken === null) {
      return Promise.reject(new Error('No refresh token'))
    } else {
      return axios.post(
        this.configAuth.token_endpoint,
        (new URLSearchParams({
          client_id: this.configAuth.client_id,
          grant_type: 'refresh_token',
          refresh_token: refreshToken
        })).toString(),
        {
          headers: {
            'Content-type': 'application/x-www-form-urlencoded'
          }
        })
        .then((response) => {
          window.sessionStorage.setItem('access_token', response.data.access_token)
          window.sessionStorage.setItem('refresh_token', response.data.refresh_token)
        })
        .finally(() => window.sessionStorage.removeItem('code_verifier'))
    }
  }
}
