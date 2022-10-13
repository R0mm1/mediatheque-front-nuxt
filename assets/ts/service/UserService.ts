import { autoInjectable, singleton, container } from 'tsyringe'
import RequestService from '~/assets/ts/service/RequestService'
import { UserCollection } from '~/assets/ts/models/User'

@autoInjectable()
@singleton()
export default class UserService {
  private readonly baseUrl = '/users'

  getUsers (): Promise<UserCollection> {
    const requestService = container.resolve(RequestService)
    const request = requestService.createRequest(this.baseUrl, 'GET')
    return requestService.execute(request)
  }
}
