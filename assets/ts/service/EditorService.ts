import { autoInjectable, singleton, container } from 'tsyringe'
import RequestService from '~/assets/ts/service/RequestService'
import { EditorCollection } from '~/assets/ts/models/Editor'

@autoInjectable()
@singleton()
export default class EditorService {
  private readonly baseUrl = '/editors'

  getEditors (): Promise<EditorCollection> {
    const requestService = container.resolve(RequestService)
    const request = requestService.createRequest(this.baseUrl, 'GET')
    return requestService.execute(request)
  }
}
