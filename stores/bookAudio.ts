import { defineStore } from 'pinia'
import { container } from 'tsyringe'
import type { FileEntity } from '~/assets/ts/entity/FileEntity'
import type { BookAudio, BookAudioItem } from '~/assets/ts/models/BookAudio'
import { type BookState, EVENT_BOOK_SAVED } from '~/stores/book'
import BookService from '~/assets/ts/service/BookService'
import FlagService from '~/assets/ts/service/FlagService'
import type EntityModuleFlagInterface from '~/assets/ts/store/EntityModuleFlagInterface'
import EventService from '~/assets/ts/service/EventService'
import HistoryService from '~/assets/ts/service/HistoryService'
import EntityProxyService from '~/assets/ts/service/EntityProxyService'
import RequestService from '~/assets/ts/service/RequestService'
import BookWithFileHelper from '~/assets/ts/store/book/BookWithFileHelper'

export interface BookAudioState extends Omit<BookState, 'book'> {
  book: BookAudio
  tempNewFile?: File
  proxy: EntityProxyService<BookAudio>
}

export const bookAudioBaseUrl = '/audio_books'

export const useBookAudioStore = defineStore('bookAudio', {
  state: (): BookAudioState => {
    const bookService = new BookService()
    const flagService = new FlagService({
      isModified: false,
      readyToSave: true
    })
    const historyService = new HistoryService()
    const proxy = new EntityProxyService<BookAudio>(flagService, historyService)

    return {
      book: new Proxy(bookService.getBaseAudioBook(), proxy),
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
    audioBookFilename: (state) => {
      const name = typeof state.book.title === 'string' && state.book.title.length > 0
        ? state.book.title
        : 'Nouveau livre'
      let extension = '.'
      if (typeof state.book.bookFile !== 'string') {
        extension += state.book.bookFile?.path.split('.').pop() ?? ''
      }
      return name + (extension ?? '')
    }
  },

  actions: {
    // Import all base book actions
    ...useBaseBookActions(),

    async get(id: number) {
      this.historyService.init()
      const requestService = container.resolve(RequestService)
      const request = requestService.createRequest(`${bookAudioBaseUrl}/${id}`)

      const book = await requestService.execute<BookAudioItem>(request)
      const audioBook = {
        ...book,
        hasBookFile: (typeof book.bookFile === 'object')
      }
      this.set(audioBook)
      return this.book
    },

    async save(): Promise<any> {
      const requestService = container.resolve(RequestService)
      const method = this.bookService.isPersisted(this.book) ? 'PUT' : 'POST'
      const request = requestService
        .createRequest(bookAudioBaseUrl + (method === 'PUT' ? ('/' + this.book.id) : ''), method)
        .setBody(this.bookService.prepareForUpload(this.book))
        .addHeader('Content-Type', 'application/json')

      try {
        const response = await requestService.execute<BookAudioItem>(request)
        response.authors = this.book.authors
        this.set(response)
        this.eventService.trigger(EVENT_BOOK_SAVED)
        return response
      } catch (error: any) {
        return this.handleViolations(error)
      }
    },

    set(book: BookAudio) {
      this.flagService.reset()
      this.historyService.init()
      this.violations = {}
      this.book = new Proxy(book, this.proxy)
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
      this.book = new Proxy(this.bookService.getBaseAudioBook(), this.proxy)
    },

    unlinkBookFile() {
      this.historyService.addEntry('bookFile', undefined, this.book.bookFile)
      this.book.bookFile = undefined
      this.book.hasBookFile = false
      this.flagService.flags.isModified = true
    },

    async linkNewFile(file: { file: File; name: string }) {
      const requestService = container.resolve(RequestService)
      this.setTempNewFile(file.file)
      this.flagService.flags.readyToSave = false

      try {
        const response = await requestService.sendFile(file.file, '/audio_book_files')
        this.setBookFile(response)
        this.flagService.flags.readyToSave = true
        return response
      } catch (error) {
        this.flagService.flags.readyToSave = true
        throw error
      }
    },

    async downloadBookFile(): Promise<void> {
      if (typeof this.book.bookFile === 'object' && this.book.bookFile !== null) {
        const bookWithFileHelper = new BookWithFileHelper()
        bookWithFileHelper.downloadBookFile(
          this.audioBookFilename,
          'audio_book_files/' + this.book.bookFile.id,
          'audio_book_file_download_tokens'
        )
        return
      } else {
        throw new Error('bookFile property is empty or null')
      }
    },

    // Methods from base book store
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
