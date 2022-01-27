import { autoInjectable, singleton } from 'tsyringe'
import axios from 'axios'

const config = require('../../../../mediatheque.json')

@autoInjectable()
@singleton()
export default class RefreshTokenService {
  refresh () : Promise<void> {
    const refreshToken = window.sessionStorage.getItem('refresh_token')
    if (refreshToken === null) {
      return Promise.reject(new Error('No refresh token'))
    } else {
      return axios.post(
        config.auth.token_endpoint,
        (new URLSearchParams({
          client_id: config.auth.client_id,
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
