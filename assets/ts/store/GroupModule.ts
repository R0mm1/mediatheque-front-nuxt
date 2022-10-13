import { Action, Module, VuexModule, getModule, Mutation } from 'vuex-module-decorators'
import { container } from 'tsyringe'
import store from '~/assets/ts/store/store'
import EntityService from '~/assets/ts/service/EntityService'
import RequestService from '~/assets/ts/service/RequestService'
import { Book } from '~/assets/ts/models/Book'
import { ReferenceGroup, ReferenceGroupItem } from '~/assets/ts/models/ReferenceGroup'

@Module({
  dynamic: true,
  name: 'group',
  store,
  namespaced: true
})
class GroupModule extends VuexModule {
  private baseUrl = '/reference_groups'

  private baseGroup = {
    books: []
  }

  private entityService = new EntityService()

  group: ReferenceGroup = { ...this.baseGroup }

  @Mutation setComment (comment: string) {
    this.group.comment = comment
  }

  @Mutation addBook (bookIRI: string) {
    this.group.books.push(bookIRI)
  }

  @Mutation init () {
    this.group = { ...this.baseGroup }
  }

  @Mutation set (group: ReferenceGroup) {
    this.group = group
  }

  @Action({ rawError: true }) get (id: number): Promise<ReferenceGroupItem | undefined> {
    const request = container.resolve(RequestService).createRequest(this.baseUrl + '/' + id)
    const requestService = container.resolve(RequestService)
    return requestService.execute<ReferenceGroupItem>(request)
      .then((result) => {
        this.set(result)
        return Promise.resolve(this.group)
      })
  }

  @Action({ rawError: true }) list (queryArgs: { [index: string]: { [index: string]: string } | string }) {
    const requestService = container.resolve(RequestService)
    const request = requestService.createRequest(this.baseUrl)
      .setQueryParams(queryArgs)

    return requestService.execute(request)
  }

  @Action save () {
    const requestService = container.resolve(RequestService)
    const group = JSON.parse(JSON.stringify(this.group))

    const method = typeof group.id !== 'undefined' ? 'PUT' : 'POST'
    const url = this.baseUrl + (method === 'PUT' ? '/' + group.id : '')
    const request = requestService.createRequest(url, method)
      .addHeader('Content-Type', 'application/json')
      .setBody(
        (() => {
          group.books = group.books.map((book: Book | string) => {
            return this.entityService.getIri(book)
          })
          return group
        })()
      )

    return requestService.execute(request)
  }
}

export default getModule(GroupModule)
