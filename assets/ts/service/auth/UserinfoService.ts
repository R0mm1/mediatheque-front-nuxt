import { inject, autoInjectable, singleton } from 'tsyringe'
import axios from 'axios'
import Tokens from '~/assets/ts/config/Public'
import Auth from '~/assets/ts/config/public/Auth'

@autoInjectable()
@singleton()
export default class UserinfoService {
  constructor (@inject(Tokens.auth) private configAuth: Auth) {
  }

  getUserInfos () {
    const accessToken = window.sessionStorage.getItem('access_token')
    if (accessToken === null) {
      return Promise.reject(new Error('No access token'))
    } else {
      return axios.post(
        this.configAuth.userinfo_endpoint,
        null,
        {
          headers: {
            Authorization: 'Bearer ' + accessToken
          }
        })
    }
  }
}
