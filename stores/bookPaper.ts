import { defineStore } from 'pinia'
import { container } from 'tsyringe'
import type { BookPaper, BookPaperItem } from '~/assets/ts/models/BookPaper'
import { type BookState } from '~/stores/book'
import BookService from '~/assets/ts/service/BookService'
import FlagService from '~/assets/ts/service/FlagService'
import type EntityModuleFlagInterface from '~/assets/ts/store/EntityModuleFlagInterface'
import EventService from '~/assets/ts/service/EventService'
import HistoryService from '~/assets/ts/service/HistoryService'
import EntityProxyService from '~/assets/ts/service/EntityProxyService'
import RequestService from '~/assets/ts/service/RequestService'

export interface BookPaperState extends Omit<BookState, 'book'> {
  book: BookPaper
  proxy: EntityProxyService<BookPaper>
}

export const bookPaperBaseUrl = '/paper_books'

export const useBookPaperStore = defineStore('bookPaper', {
  state: (): BookPaperState => {
    const bookService = new BookService()
    const flagService = new FlagService({
      isModified: false,
      readyToSave: true
    })
    const historyService = new HistoryService()
    const proxy = new EntityProxyService<BookPaper>(flagService, historyService)

    return {
      book: new Proxy(bookService.getBasePaperBook(), proxy),
      violations: {},
      tempNewCover: null,
      notation: null,
      flagService,
      historyService,
      bookService,
      eventService: EventService.getService(),
      proxy
    }
  },

  getters: {
    isModified: (state) => state.flagService.flags.isModified,
    isReadyToSave: (state) => state.flagService.flags.readyToSave
  },

  actions: {
    // Import all base book actions
    ...useBaseBookActions(),

    set(book: BookPaper) {
      this.flagService.reset()
      this.historyService.init()
      this.violations = {}
      this.book = new Proxy(book, this.proxy)
    },

    init(): void {
      this.flagService.reset()
      this.historyService.init()
      this.violations = {}
      this.notation = null
      this.book = new Proxy(this.bookService.getBasePaperBook(), this.proxy)
    },

    setHistoryService(historyService: HistoryService) {
      this.historyService = historyService
      this.proxy.historyService = historyService
    },

    async get(id: number) {
      this.historyService.init()
      const requestService = container.resolve(RequestService)
      const request = requestService.createRequest(`${bookPaperBaseUrl}/${id}`)

      const bookPaper = await requestService.execute<BookPaperItem>(request)
      this.set(bookPaper)
      return this.book
    },

    async save(bookTypeChanged: boolean = false): Promise<BookPaperItem> {
      const requestService = container.resolve(RequestService)
      const method = this.bookService.isPersisted(this.book) ? 'PUT' : 'POST'
      const url = (bookTypeChanged ? '/electronic_books' : bookPaperBaseUrl) +
        (method === 'PUT' ? ('/' + this.book.id) : '')

      const request = requestService.createRequest(url, method)
        .addHeader('Content-Type', 'application/json')
        .setBody(this.bookService.prepareForUpload(this.book))

      try {
        const response = await requestService.execute<BookPaperItem>(request)
        response.authors = this.book.authors
        this.set(response)
        return response
      } catch (error: any) {
        return this.handleViolations(error)
      }
    },

    // Methods from base book store that need to be accessible
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

// Helper function to share base book actions
function useBaseBookActions() {
  return {
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
      this.book.summary = summary
    },
    setOwner(owner: string | undefined) {
      this.book.owner = owner
    },
    setEditor(editor: any) {
      this.book.editor = editor
    },
    setCover(cover: any) {
      this.book.cover = cover
    },
    unlinkCover() {
      this.book.cover = null
      this.tempNewCover = null
    },
    addAuthor(author: any) {
      const authorAtIndex = this.bookService.hasAuthor(this.book, author)
      if (authorAtIndex === false) {
        const authors = Array.from(this.book.authors)
        authors.push(author)
        this.book.authors = authors
      }
    },
    removeAuthor(author: any) {
      const authorAtIndex = this.bookService.hasAuthor(this.book, author)
      if (typeof authorAtIndex === 'number') {
        const authors = Array.from(this.book.authors)
        authors.splice(authorAtIndex, 1)
        this.book.authors = authors
      }
    }
  }
}
