import { autoInjectable, singleton } from 'tsyringe'
import axios from 'axios'
import Navigator from '~/assets/ts/objects/Navigator'

const config = require('~/mediatheque.json')

@autoInjectable()
@singleton()
export default class LogoutService {
  logout () {
    const accessToken = window.sessionStorage.getItem('access_token')
    const refreshToken = window.sessionStorage.getItem('refresh_token')
    if (accessToken === null || refreshToken === null) {
      window.sessionStorage.removeItem('access_token')
      window.sessionStorage.removeItem('refresh_token')
      return Promise.reject(new Error('Missing tokens'))
    }

    return axios.post(
      config.auth.end_session_endpoint,
      (new URLSearchParams({
        client_id: config.auth.client_id,
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
        Navigator.navigate(config.default.page)
      })
  }
}
