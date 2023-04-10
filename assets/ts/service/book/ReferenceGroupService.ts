import { autoInjectable, singleton, container } from 'tsyringe'
import RequestService from '~/assets/ts/service/RequestService'
import { ReferenceGroup, ReferenceGroupItem } from '~/assets/ts/models/book/ReferenceGroup'

@autoInjectable()
@singleton()
export default class ReferenceGroupService {
  private readonly baseUrl = '/reference_groups'

  get (id: number): Promise<ReferenceGroupItem> {
    const request = this.requestService.createRequest(this.baseUrl + '/' + id)
    return this.requestService.execute(request)
  }

  list (queryArgs: { [index: string]: { [index: string]: string } | string }) {
    const request = this.requestService.createRequest(this.baseUrl)
      .setQueryParams(queryArgs)
    return this.requestService.execute(request)
  }

  save (referenceGroup: Partial<ReferenceGroup>) {
    const method = referenceGroup.id ? 'PUT' : 'POST'
    const url = this.baseUrl + (method === 'PUT' ? '/' + referenceGroup.id : '')
    const request = this.requestService.createRequest(url, method)
    request.setBody(referenceGroup)
    return this.requestService.execute<ReferenceGroup>(request)
  }

  sort (referenceGroupId: number, referenceGroupBookIds: string[]) {
    const request = this.requestService.createRequest(this.baseUrl + '/' + referenceGroupId + '/sort', 'PUT')
    request.setBody({
      books: referenceGroupBookIds
    })
    return this.requestService.execute(request)
  }

  delete (referenceGroupId: number) {
    const request = this.requestService.createRequest(this.baseUrl + '/' + referenceGroupId, 'DELETE')
    return this.requestService.execute(request)
  }

  private get requestService () {
    return container.resolve(RequestService)
  }
}
