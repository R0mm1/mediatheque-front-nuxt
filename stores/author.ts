import { defineStore } from 'pinia'
import { container } from 'tsyringe'
import type { Author } from '~/assets/ts/models/Author'
import type { Person } from '~/assets/ts/entity/module'
import FlagService from '~/assets/ts/service/FlagService'
import HistoryService from '~/assets/ts/service/HistoryService'
import EntityProxyService from '~/assets/ts/service/EntityProxyService'
import RequestService from '~/assets/ts/service/RequestService'
import type EntityModuleInterface from '~/assets/ts/store/EntityModuleInterface'

export interface AuthorModuleFlagInterface {
  isModified: boolean
  readyToSave: boolean
  fetching: boolean
}

export interface AuthorState {
  author: Author
  violations: Record<string, any>
  flagService: FlagService<AuthorModuleFlagInterface>
  historyService: HistoryService
  proxy: EntityProxyService<Author>
}

export const useAuthorStore = defineStore('author', {
  state: (): AuthorState => {
    const flagService = new FlagService<AuthorModuleFlagInterface>({
      isModified: false,
      readyToSave: true,
      fetching: false
    })
    const historyService = new HistoryService()
    const proxy = new EntityProxyService<Author>(flagService, historyService)

    const baseAuthor: Author = {
      person: {
        firstname: '',
        lastname: ''
      } as Person
    }

    const author = new Proxy<Author>(baseAuthor, proxy)
    author.person = new Proxy<Person>(author.person, proxy)

    return {
      author,
      violations: {},
      flagService,
      historyService,
      proxy
    }
  },

  getters: {
    isModified: (state) => state.flagService.flags.isModified,
    isReadyToSave: (state) => state.flagService.flags.readyToSave,
    isFetching: (state) => state.flagService.flags.fetching
  },

  actions: {
    async get(id: number): Promise<Author | undefined> {
      this.flagService.flags.fetching = true

      try {
        const requestService = container.resolve(RequestService)
        const request = requestService.createRequest(`/authors/${id}`)
        const result = await requestService.execute<Author>(request)
        this.set(result)
        return result
      } finally {
        this.flagService.flags.fetching = false
      }
    },

    async save(): Promise<Author> {
      const requestService = container.resolve(RequestService)
      const method = typeof this.author.id !== 'undefined' ? 'PUT' : 'POST'
      const url = '/authors' + (method === 'PUT' ? '/' + this.author.id : '')

      const request = requestService.createRequest(url, method)
        .setBody(this.author)
        .addHeader('Content-Type', 'application/json')

      try {
        const response = await requestService.execute<Author>(request)
        this.set(response)
        return response
      } catch (error: any) {
        return this.handleViolations(error)
      }
    },

    new() {
      const baseAuthor: Author = {
        person: {
          firstname: '',
          lastname: ''
        } as Person
      }

      this.author = new Proxy<Author>(baseAuthor, this.proxy)
      this.author.person = new Proxy<Person>(this.author.person, this.proxy)
      this.flagService.reset()
      this.violations = {}
    },

    set(entity: Author): void {
      this.author = new Proxy<Author>(entity, this.proxy)
      this.author.person = new Proxy<Person>(this.author.person, this.proxy)
      this.flagService.reset()
      this.violations = {}
    },

    setFirstname(firstname: string) {
      this.author.person.firstname = firstname
    },

    setLastname(lastname: string) {
      this.author.person.lastname = lastname
    },

    handleViolations(error: any) {
      if ('response' in error && error.response?.status === 422) {
        const violations = (error.response.data as any)?.violations ?? []
        violations.forEach((violation: any) => {
          this.violations[violation.propertyPath] = violation
        })
        throw new Error('Vérifiez les données du formulaire')
      }
      throw error
    }
  }
})
