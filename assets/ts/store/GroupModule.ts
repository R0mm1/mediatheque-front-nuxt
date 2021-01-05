import { Action, Module, VuexModule, getModule, Mutation } from 'vuex-module-decorators'
import { container } from 'tsyringe'
import store from '~/assets/ts/store/store'
import { GroupEntity } from '~/assets/ts/entity/GroupEntity'
import { BookEntity } from '~/assets/ts/entity/module'
import EntityService from '~/assets/ts/service/EntityService'
import RequestService from '~/assets/ts/service/RequestService'

const requestService = container.resolve(RequestService)

@Module({ dynamic: true, name: 'group', store, namespaced: true })
class GroupModule extends VuexModule {
    private baseGroup = {
      books: []
    };

    private entityService = new EntityService();

    group: GroupEntity = { ...this.baseGroup };

    @Mutation setComment (comment: string) {
      this.group.comment = comment
    }

    @Mutation addBook (bookIRI: string) {
      this.group.books.push(bookIRI)
    }

    @Mutation init () {
      this.group = { ...this.baseGroup }
    }

    @Mutation set (group: GroupEntity) {
      this.group = group
    }

    @Action({ rawError: true }) list (queryArgs: { [index: string]: { [index: string]: string } | string }) {
      const request = requestService.createRequest('/reference_groups')
        .setQueryParams(queryArgs)

      return requestService.execute(request)
    }

    @Action save () {
      const group = JSON.parse(JSON.stringify(this.group))

      const method = typeof group.id !== 'undefined' ? 'PUT' : 'POST'
      const url = '/reference_groups' + (method === 'PUT' ? '/' + group.id : '')
      const request = requestService.createRequest(url, method)
        .addHeader('Content-Type', 'application/json')
        .setBody(
          (() => {
            group.books = group.books.map((book: BookEntity | string) => {
              return this.entityService.getIri(book)
            })
            return group
          })()
        )

      return requestService.execute(request)
    }
}

export default getModule(GroupModule)
