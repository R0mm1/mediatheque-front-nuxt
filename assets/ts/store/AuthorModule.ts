import { Action, Module, Mutation, VuexModule, getModule } from 'vuex-module-decorators'
import { container } from 'tsyringe'
import EntityModuleInterface from '~/assets/ts/store/EntityModuleInterface'
import store from '~/assets/ts/store/store'
import FlagService from '~/assets/ts/service/FlagService'
import EntityModuleFlagInterface from '~/assets/ts/store/EntityModuleFlagInterface'
import EntityProxyService from '~/assets/ts/service/EntityProxyService'
import HistoryService from '~/assets/ts/service/HistoryService'
import RequestService from '~/assets/ts/service/RequestService'
import { Author } from '~/assets/ts/models/Author'
import Person from '~/assets/ts/models/Person'

export interface AuthorModuleFlagInterface extends EntityModuleFlagInterface{
  fetching: boolean
}

@Module({ dynamic: true, name: 'author', store, namespaced: true })
class AuthorModule extends VuexModule implements EntityModuleInterface<Author> {
  protected baseUrl = '/authors'
  protected baseAuthor = {
    books: [],
    person: {}
  }

  author: Author = this.baseAuthor

  flagService = new FlagService<AuthorModuleFlagInterface>({
    isModified: false,
    readyToSave: true,
    fetching: false
  })

  proxy = new EntityProxyService(this.flagService, new HistoryService())

    @Mutation new () {
    this.author = new Proxy<Author>(this.baseAuthor, this.proxy)
    this.author.person = new Proxy<Person>(this.author.person, this.proxy)
    this.flagService.reset()
  }

    @Mutation set (entity: Author): void {
      this.flagService.reset()
      entity.person = new Proxy<Person>(entity.person, this.proxy)
      this.author = new Proxy<Author>(entity, this.proxy)
    }

    @Mutation setFirstname (firstname: string) {
      this.author.person.firstname = firstname
    }

    @Mutation setLastname (lastname: string) {
      this.author.person.lastname = lastname
    }

    @Action({ rawError: true }) get (id: number): Promise<Author | undefined> {
      this.flagService.flags.fetching = true
      const request = container.resolve(RequestService).createRequest(this.baseUrl + '/' + id)
      const requestService = container.resolve(RequestService)
      return requestService.execute<Author>(request)
        .then((result) => {
          this.set(result)
          return Promise.resolve(this.author)
        })
        .finally(() => {
          this.flagService.flags.fetching = false
        })
    }

    @Action save (): Promise<Author | boolean> {
      const method = typeof this.author.id === 'undefined' ? 'POST' : 'PUT'
      const url = this.baseUrl + (method === 'PUT' ? '/' + this.author.id : '')
      const requestService = container.resolve(RequestService)
      this.author.person.id = this.author.person['@id'] // To please ApiPlatform
      const request = requestService.createRequest(url, method)
        .setBody(this.author)
        .addHeader('Content-Type', 'application/json')

      return requestService.execute<Author>(request)
        .then((author: Author) => {
          this.set(author)
          return Promise.resolve(author)
        })
    }
}

export default getModule(AuthorModule)
