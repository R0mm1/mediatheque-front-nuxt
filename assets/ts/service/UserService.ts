import { autoInjectable, singleton, container } from 'tsyringe'
import RequestService from '~/assets/ts/service/RequestService'
import { User, UserCollection } from '~/assets/ts/models/User'

@autoInjectable()
@singleton()
export default class UserService {
  private readonly baseUrl = '/users'

  getUsers (): Promise<UserCollection> {
    const requestService = container.resolve(RequestService)
    const request = requestService.createRequest(this.baseUrl, 'GET')
    return requestService.execute(request)
  }

  getSelf (): Promise<User> {
    const storageKey = 'self'
    const sessionContent = window.sessionStorage.getItem(storageKey)
    if (sessionContent) {
      return Promise.resolve((JSON.parse(sessionContent)))
    }

    const requestService = container.resolve(RequestService)
    const request = requestService.createRequest('/self', 'GET')
    return requestService.execute<User>(request)
      .then((response) => {
        window.sessionStorage.setItem(storageKey, JSON.stringify(response))
        return Promise.resolve(response)
      })
  }
}
