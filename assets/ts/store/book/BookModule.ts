import Vue from 'vue'
import { container } from 'tsyringe'
import { Action, Mutation, VuexModule } from 'vuex-module-decorators'
import { AxiosError, Method } from 'axios'
import {
  FileEntity,
  BookNotationEntity
} from '~/assets/ts/entity/module'
import BookService from '~/assets/ts/service/BookService'
import FlagService from '~/assets/ts/service/FlagService'
import EntityModuleFlagInterface from '~/assets/ts/store/EntityModuleFlagInterface'
import EventService from '~/assets/ts/service/EventService'
import HistoryService from '~/assets/ts/service/HistoryService'
import RequestService from '~/assets/ts/service/RequestService'
import { Book, BookItem } from '~/assets/ts/models/Book'
import { EditorItem } from '~/assets/ts/models/Editor'
import { AuthorItem } from '~/assets/ts/models/Author'
import Violation from '~/assets/ts/models/Violation'
import DisplayableError from '~/assets/ts/objects/error/DisplayableError'
import { ReferenceGroupBookItem } from '~/assets/ts/models/book/referenceGroup/Book'
import UserService from '~/assets/ts/service/UserService'

export abstract class BookModule extends VuexModule {
  static EVENT_BOOK_SAVED = 'book-saved'

  static baseUrl: string = '/books'

  protected bookService: BookService = new BookService()

  protected eventService: EventService = EventService.getService()

  historyService: HistoryService = new HistoryService()

  book: BookItem = this.bookService.getBaseBook()

  violations: Record<string, Violation> = {}

  tempNewCover: File | null = null // Can't use undefined instead of null otherwise the attribute won't appear on the state

  // The notation given to the book by the user
  notation: BookNotationEntity | null = null

  flagService: FlagService<EntityModuleFlagInterface> = new FlagService({
    isModified: false,
    readyToSave: true
  })

  protected getBase<HydraItemType> (id: number, baseUrl: string): Promise<HydraItemType> {
    const requestService = container.resolve(RequestService)
    const request = requestService.createRequest(baseUrl + '/' + id)

    return requestService.execute<HydraItemType>(request)
  }

  @Mutation init (): void {
    this.notation = null
  }

  @Mutation setHistoryService (historyService: HistoryService) {
    this.historyService = historyService
  }

  @Mutation setBook (book: Book) {
    this.book = book
  }

  @Mutation setTitle (title: string) {
    this.book.title = title
  }

  @Mutation setYear (year: string) {
    this.book.year = year
  }

  @Mutation setPageCount (pageCount: string) {
    this.book.pageCount = parseInt(pageCount)
  }

  @Mutation setIsbn (isbn: string) {
    this.book.isbn = isbn
  }

  @Mutation setLanguage (language: string) {
    this.book.language = language
  }

  @Mutation setSummary (summary: string) {
    Vue.set(this.book, 'summary', summary)
  }

  @Mutation setGroupMembership (groupMemberships: Partial<ReferenceGroupBookItem>[]) {
    Vue.set(this.book, 'groupMemberships', groupMemberships)
  }

  @Mutation addAuthor (author: AuthorItem) {
    const authorAtIndex = this.bookService.hasAuthor(this.book, author)
    if (authorAtIndex === false) {
      const authors = Array.from(this.book.authors)
      authors.push(author)
      this.book.authors = authors
    }
  }

  @Mutation removeAuthor (author: AuthorItem) {
    const authorAtIndex = this.bookService.hasAuthor(this.book, author)
    if (typeof authorAtIndex === 'number') {
      const authors = Array.from(this.book.authors)
      authors.splice(authorAtIndex, 1)
      this.book.authors = authors
    }
  }

  @Mutation setOwner (owner: string | undefined) {
    this.book.owner = owner
  }

  @Mutation setCover (cover: FileEntity) {
    this.book.cover = cover
  }

  @Mutation unlinkCover () {
    this.book.cover = null
    this.tempNewCover = null
  }

  @Mutation setTempNewCover (cover: File) {
    this.tempNewCover = cover
  }

  @Mutation setNotation (notation: BookNotationEntity | null) {
    this.notation = notation
  }

  @Mutation setEditor (editor: EditorItem | undefined) {
    this.book.editor = editor
  }

  @Action({ rawError: true })
  linkNewCover (file: { file: File, name: string }) {
    const requestService = container.resolve(RequestService)
    this.context.commit('setTempNewCover', file.file)

    this.flagService.flags.readyToSave = false

    return requestService.sendFile(file.file, '/book/covers')
      .then((response: Response) => {
        this.context.commit('setCover', response)
        this.flagService.flags.readyToSave = true
        return Promise.resolve(response)
      })
      .catch((response: any) => {
        this.flagService.flags.readyToSave = true
        return Promise.reject(response)
      })
  }

  @Action({ rawError: true })
  getNotation () {
    const requestService = container.resolve(RequestService)
    const userService = container.resolve(UserService)

    if (this.notation !== null) {
      return Promise.resolve(this.notation)
    }

    if (typeof this.book.id === 'undefined') {
      return
    }

    const bookId: number = this.book.id

    return userService.getSelf().then((self) => {
      const request = requestService.createRequest('/book_notations')
        .setQueryParams({
          'book.id': bookId,
          'user.id': (self.id as number)
        })

      return requestService.execute<any>(request)
        .then((response) => {
          if (response['hydra:member'].length > 0) {
            this.context.commit('setNotation', response['hydra:member'].pop())
          } else {
            this.context.commit('setNotation', null)
          }
          return Promise.resolve(this.notation)
        })
    })
  }

  @Action({ rawError: true })
  updateNote (note: Number) {
    if (typeof this.book['@id'] === 'undefined') {
      throw new TypeError('The book is not loaded from db')
    }

    const requestService = container.resolve(RequestService)
    const requestBody: BookNotationEntity = {}
    let url = '/book_notations'
    let method: Method = 'POST'

    if (this.notation === null) {
      requestBody.book = this.book['@id']
      requestBody.note = note
    } else {
      requestBody.note = note
      method = 'PUT'
      url += '/' + this.notation.id
    }

    const request = requestService.createRequest(url, method)
      .setBody(requestBody)
      .addHeader('Content-Type', 'application/json')
    return requestService.execute(request)
      .then((response) => {
        this.context.commit('setNotation', response)
        return Promise.resolve(response)
      })
  }

  @Action({ rawError: true })
  deleteBook () {
    const requestService = container.resolve(RequestService)
    if (typeof this.book.id === 'undefined') {
      return Promise.reject(new Error('There is no existing loaded book'))
    }

    const request = requestService.createRequest('/books/' + this.book.id, 'DELETE')
    return requestService.execute(request)
  }

  protected handleViolations (error: Error | AxiosError) {
    if ('response' in error && error.response?.status === 422) {
      const violations: Violation[] = (error.response.data as any)?.violations ?? []
      violations.forEach((violation) => {
        Vue.set(this.violations, violation.propertyPath, violation)
      })
      return Promise.reject(new DisplayableError('Vérifiez les données du formulaire'))
    }
    return Promise.reject(error)
  }
}
