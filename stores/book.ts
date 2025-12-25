import { defineStore } from 'pinia'
import { container } from 'tsyringe'
import type { Method } from 'axios'
import type {
  FileEntity,
  BookNotationEntity
} from '~/assets/ts/entity/module'
import BookService from '~/assets/ts/service/BookService'
import FlagService from '~/assets/ts/service/FlagService'
import type EntityModuleFlagInterface from '~/assets/ts/store/EntityModuleFlagInterface'
import EventService from '~/assets/ts/service/EventService'
import HistoryService from '~/assets/ts/service/HistoryService'
import RequestService from '~/assets/ts/service/RequestService'
import type { Book, BookItem } from '~/assets/ts/models/Book'
import type { EditorItem } from '~/assets/ts/models/Editor'
import type { AuthorItem } from '~/assets/ts/models/Author'
import type Violation from '~/assets/ts/models/Violation'
import DisplayableError from '~/assets/ts/objects/error/DisplayableError'
import type { ReferenceGroupBookItem } from '~/assets/ts/models/book/referenceGroup/Book'
import UserService from '~/assets/ts/service/UserService'

export interface BookState {
  book: BookItem
  violations: Record<string, Violation>
  tempNewCover: File | null
  notation: BookNotationEntity | null
  flagService: FlagService<EntityModuleFlagInterface>
  historyService: HistoryService
  bookService: BookService
  eventService: EventService
}

export const EVENT_BOOK_SAVED = 'book-saved'
export const baseUrl = '/books'

export const useBookStore = defineStore('book', {
  state: (): BookState => {
    const bookService = new BookService()
    return {
      book: bookService.getBaseBook(),
      violations: {},
      tempNewCover: null,
      notation: null,
      flagService: new FlagService({
        isModified: false,
        readyToSave: true
      }),
      historyService: new HistoryService(),
      bookService,
      eventService: EventService.getService()
    }
  },

  getters: {
    isModified: (state) => state.flagService.flags.isModified,
    isReadyToSave: (state) => state.flagService.flags.readyToSave
  },

  actions: {
    init(): void {
      this.notation = null
    },

    setHistoryService(historyService: HistoryService) {
      this.historyService = historyService
    },

    setBook(book: Book) {
      this.book = book
    },

    setTitle(title: string) {
      this.book.title = title
    },

    setYear(year: string) {
      this.book.year = year
    },

    setPageCount(pageCount: string) {
      this.book.pageCount = parseInt(pageCount)
    },

    setIsbn(isbn: string) {
      this.book.isbn = isbn
    },

    setLanguage(language: string) {
      this.book.language = language
    },

    setSummary(summary: string) {
      // Vue 3: No need for Vue.set(), reactivity is automatic
      this.book.summary = summary
    },

    setGroupMembership(groupMemberships: Partial<ReferenceGroupBookItem>[]) {
      // Vue 3: No need for Vue.set(), reactivity is automatic
      this.book.groupMemberships = groupMemberships
    },

    addAuthor(author: AuthorItem) {
      const authorAtIndex = this.bookService.hasAuthor(this.book, author)
      if (authorAtIndex === false) {
        const authors = Array.from(this.book.authors)
        authors.push(author)
        this.book.authors = authors
      }
    },

    removeAuthor(author: AuthorItem) {
      const authorAtIndex = this.bookService.hasAuthor(this.book, author)
      if (typeof authorAtIndex === 'number') {
        const authors = Array.from(this.book.authors)
        authors.splice(authorAtIndex, 1)
        this.book.authors = authors
      }
    },

    setOwner(owner: string | undefined) {
      this.book.owner = owner
    },

    setCover(cover: FileEntity) {
      this.book.cover = cover
    },

    unlinkCover() {
      this.book.cover = null
      this.tempNewCover = null
    },

    setTempNewCover(cover: File) {
      this.tempNewCover = cover
    },

    setNotation(notation: BookNotationEntity | null) {
      this.notation = notation
    },

    setEditor(editor: EditorItem | undefined) {
      this.book.editor = editor
    },

    async linkNewCover(file: { file: File; name: string }) {
      const requestService = container.resolve(RequestService)
      this.setTempNewCover(file.file)
      this.flagService.flags.readyToSave = false

      try {
        const response = await requestService.sendFile(file.file, '/book/covers')
        this.setCover(response)
        this.flagService.flags.readyToSave = true
        return response
      } catch (error) {
        this.flagService.flags.readyToSave = true
        throw error
      }
    },

    async getNotation() {
      const requestService = container.resolve(RequestService)
      const userService = container.resolve(UserService)

      if (this.notation !== null) {
        return this.notation
      }

      if (typeof this.book.id === 'undefined') {
        return
      }

      const bookId: number = this.book.id
      const self = await userService.getSelf()

      const request = requestService.createRequest('/book_notations')
        .setQueryParams({
          'book.id': bookId,
          'user.id': (self.id as number)
        })

      const response = await requestService.execute<any>(request)
      if (response['hydra:member'].length > 0) {
        this.setNotation(response['hydra:member'].pop())
      } else {
        this.setNotation(null)
      }

      return this.notation
    },

    async updateNote(note: Number) {
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

      const response = await requestService.execute(request)
      this.setNotation(response)
      return response
    },

    async deleteBook() {
      const requestService = container.resolve(RequestService)
      if (typeof this.book.id === 'undefined') {
        throw new Error('There is no existing loaded book')
      }

      const request = requestService.createRequest('/books/' + this.book.id, 'DELETE')
      return requestService.execute(request)
    },

    handleViolations(error: Error | any) {
      if ('response' in error && error.response?.status === 422) {
        const violations: Violation[] = (error.response.data as any)?.violations ?? []
        violations.forEach((violation) => {
          // Vue 3: No need for Vue.set(), reactivity is automatic
          this.violations[violation.propertyPath] = violation
        })
        throw new DisplayableError('Vérifiez les données du formulaire')
      }
      throw error
    },

    async getBase<HydraItemType>(id: number, baseUrl: string): Promise<HydraItemType> {
      const requestService = container.resolve(RequestService)
      const request = requestService.createRequest(baseUrl + '/' + id)
      return requestService.execute<HydraItemType>(request)
    }
  }
})
