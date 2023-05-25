import { autoInjectable, singleton, container } from 'tsyringe'
import RequestService from '~/assets/ts/service/RequestService'
import {
  ReferenceGroupBook,
  ReferenceGroupBookCollection,
  ReferenceGroupBookItem
} from '~/assets/ts/models/book/referenceGroup/Book'
import EntityService from '~/assets/ts/service/EntityService'

@autoInjectable()
@singleton()
export default class ReferenceGroupBookService {
  private readonly baseUrl = '/reference_group_books'

  get (id: number): Promise<ReferenceGroupBookItem> {
    const request = this.requestService.createRequest(this.baseUrl + '/' + id)
    return this.requestService.execute(request)
  }

  list (queryArgs: { [index: string]: { [index: string]: string } | string }): Promise<ReferenceGroupBookCollection> {
    const request = this.requestService.createRequest(this.baseUrl)
      .setQueryParams(queryArgs)
    return this.requestService.execute(request)
  }

  delete (id: string) {
    const request = this.requestService.createRequest(this.baseUrl + '/' + id, 'DELETE')
    return this.requestService.execute(request)
  }

  save (referenceGroupBook: Partial<ReferenceGroupBook>): Promise<ReferenceGroupBookItem> {
    const method = referenceGroupBook.id ? 'PUT' : 'POST'
    const url = this.baseUrl + (method === 'PUT' ? '/' + referenceGroupBook.id : '')

    const bookIri = (new EntityService()).getIri(referenceGroupBook.book)
    if (!bookIri) {
      throw new Error('Could not determine book IRI')
    }
    referenceGroupBook.book = bookIri

    const referenceGroupIri = (new EntityService()).getIri(referenceGroupBook.referenceGroup)
    if (!referenceGroupIri) {
      throw new Error('Could not determine referenceGroup IRI')
    }
    referenceGroupBook.referenceGroup = referenceGroupIri

    const request = this.requestService.createRequest(url, method)
      .setBody(referenceGroupBook)
    return this.requestService.execute<ReferenceGroupBookItem>(request)
  }

  private get requestService () {
    return container.resolve(RequestService)
  }
}
