import { defineStore } from 'pinia'
import { container } from 'tsyringe'
import type { FileEntity } from '~/assets/ts/entity/module'
import type { BookElectronic, BookElectronicItem } from '~/assets/ts/models/BookElectronic'
import type { ElectronicBookInformation } from '~/assets/ts/models/electronicBookInformation/ElectronicBookInformation'
import type { Image } from '~/assets/ts/models/electronicBookInformation/Image'
import { type BookState, EVENT_BOOK_SAVED } from '~/stores/book'
import BookService from '~/assets/ts/service/BookService'
import FlagService from '~/assets/ts/service/FlagService'
import type EntityModuleFlagInterface from '~/assets/ts/store/EntityModuleFlagInterface'
import EventService from '~/assets/ts/service/EventService'
import HistoryService from '~/assets/ts/service/HistoryService'
import EntityProxyService from '~/assets/ts/service/EntityProxyService'
import RequestService from '~/assets/ts/service/RequestService'
import BookWithFileHelper from '~/assets/ts/store/book/BookWithFileHelper'

export interface BookElectronicState extends Omit<BookState, 'book'> {
  book: BookElectronic
  tempNewFile?: File
  proxy: EntityProxyService<BookElectronic>
}

export const bookElectronicBaseUrl = '/electronic_books'

export const useBookElectronicStore = defineStore('bookElectronic', {
  state: (): BookElectronicState => {
    const bookService = new BookService()
    const flagService = new FlagService({
      isModified: false,
      readyToSave: true
    })
    const historyService = new HistoryService()
    const proxy = new EntityProxyService<BookElectronic>(flagService, historyService)

    return {
      book: new Proxy(bookService.getBaseElectronicBook(), proxy),
      violations: {},
      tempNewCover: null,
      tempNewFile: undefined,
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
    isReadyToSave: (state) => state.flagService.flags.readyToSave,
    ebookFilename: (state) => {
      const name = typeof state.book.title === 'string' && state.book.title.length > 0
        ? state.book.title
        : 'Nouveau livre'
      return name + '.epub'
    }
  },

  actions: {
    // Import all base book actions
    ...useBaseBookActions(),

    async downloadEbook(): Promise<void> {
      if (typeof this.book.bookFile === 'object' && this.book.bookFile !== null) {
        const bookWithFileHelper = new BookWithFileHelper()
        bookWithFileHelper.downloadBookFile(
          this.ebookFilename,
          'book_files/' + this.book.bookFile.id,
          'electronic_book_file_download_tokens'
        )
        return
      } else {
        throw new Error('bookFile property is empty or null')
      }
    },

    async get(id: number) {
      this.historyService.init()
      const requestService = container.resolve(RequestService)
      const request = requestService.createRequest(`${bookElectronicBaseUrl}/${id}`)

      const book = await requestService.execute<BookElectronicItem>(request)
      const electronicBook = {
        ...book,
        hasBookFile: (typeof book.bookFile === 'object')
      }
      this.set(electronicBook)
      return this.book
    },

    async save(bookTypeChanged: boolean = false): Promise<any> {
      const requestService = container.resolve(RequestService)
      const method = this.bookService.isPersisted(this.book) ? 'PUT' : 'POST'
      const url = (bookTypeChanged ? '/paper_books' : bookElectronicBaseUrl) +
        (method === 'PUT' ? ('/' + this.book.id) : '')
      const request = requestService.createRequest(url, method)
        .setBody(this.bookService.prepareForUpload(this.book))
        .addHeader('Content-Type', 'application/json')

      try {
        const response = await requestService.execute<BookElectronicItem>(request)
        response.authors = this.book.authors
        this.set(response)
        this.eventService.trigger(EVENT_BOOK_SAVED)
        return response
      } catch (error: any) {
        return this.handleViolations(error)
      }
    },

    set(book: BookElectronic) {
      this.flagService.reset()
      this.historyService.init()
      this.violations = {}
      this.book = new Proxy(book, this.proxy)
    },

    unlinkBookFile() {
      this.historyService.addEntry('bookFile', undefined, this.book.bookFile)
      this.book.bookFile = undefined
      this.book.hasBookFile = false
      this.flagService.flags.isModified = true
    },

    setTempNewFile(bookFile: File) {
      this.tempNewFile = bookFile
    },

    setBookFile(bookFile: FileEntity) {
      this.book.bookFile = bookFile
    },

    init(): void {
      this.flagService.reset()
      this.historyService.init()
      this.violations = {}
      this.notation = null
      this.book = new Proxy(this.bookService.getBaseElectronicBook(), this.proxy)
    },

    setHistoryService(historyService: HistoryService) {
      this.historyService = historyService
      this.proxy.historyService = historyService
    },

    async linkNewFile(file: { file: File; name: string }) {
      const requestService = container.resolve(RequestService)
      this.setTempNewFile(file.file)
      this.flagService.flags.readyToSave = false

      try {
        const response = await requestService.sendFile(file.file, '/book_files')
        this.setBookFile(response)
        this.flagService.flags.readyToSave = true
        return response
      } catch (error) {
        this.flagService.flags.readyToSave = true
        throw error
      }
    },

    async extractInfo(file: { file: File; name: string }) {
      const requestService = container.resolve(RequestService)
      this.setTempNewFile(file.file)
      return requestService.sendFile(file.file, 'electronic_book_information/electronic_book_informations', 'electronicBook')
    },

    async createBookFromElectronicBookInformation(electronicBookInformation: ElectronicBookInformation) {
      if (typeof electronicBookInformation.id === 'undefined') {
        throw new TypeError('Cannot create book from a not-persisted ElectronicBookInformation')
      }

      const requestService = container.resolve(RequestService)
      const formData = new FormData()
      formData.append('electronic_book_information_id', electronicBookInformation.id)

      const request = requestService.createRequest('book_files', 'POST')
      request.setBody(formData)
      request.addHeader('Content-Type', 'Content-Type')

      const response = await requestService.execute(request)
      this.setBookFile(response)
      return response
    },

    async createCoverFromElectronicBookInformationImage(electronicBookInformationImage: Image) {
      if (typeof electronicBookInformationImage.id === 'undefined') {
        throw new TypeError('Cannot create cover from a not-persisted ElectronicBookInformation Image')
      }

      const requestService = container.resolve(RequestService)
      const formData = new FormData()
      formData.append('electronic_book_information_image_id', electronicBookInformationImage.id)

      const request = requestService.createRequest('book/covers', 'POST')
      request.setBody(formData)
      request.addHeader('Content-Type', 'Content-Type')

      const response = await requestService.execute(request)
      this.setCover(response)
      return response
    },

    async deleteElectronicBookInformation(electronicBookInformation: ElectronicBookInformation) {
      if (typeof electronicBookInformation.id === 'undefined') {
        throw new TypeError('Cannot delete a not-persisted ElectronicBookInformation')
      }

      const requestService = container.resolve(RequestService)
      const request = requestService.createRequest(
        'electronic_book_information/electronic_book_informations/' + electronicBookInformation.id,
        'DELETE'
      )
      return requestService.execute(request)
    },

    // Methods from base book store that need to be accessible
    setCover(cover: any) {
      this.book.cover = cover
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

// Helper function to share base book actions (simplified approach)
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
