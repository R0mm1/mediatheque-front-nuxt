import { autoInjectable, singleton } from 'tsyringe'
import axios from 'axios'
import config from '~/mediatheque.json'

@autoInjectable()
@singleton()
export default class UserinfoService {
  getUserInfos () {
    const accessToken = window.sessionStorage.getItem('access_token')
    if (accessToken === null) {
      return Promise.reject(new Error('No access token'))
    } else {
      return axios.post(
        config.auth.userinfo_endpoint,
        null,
        {
          headers: {
            Authorization: 'Bearer ' + accessToken
          }
        })
    }
  }
}
