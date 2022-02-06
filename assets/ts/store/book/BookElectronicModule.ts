import { Mutation, getModule, Action, Module } from 'vuex-module-decorators'
import { container } from 'tsyringe'
import { FileEntity } from '~/assets/ts/entity/module'
import store from '~/assets/ts/store/store'
import EntityModuleInterface from '~/assets/ts/store/EntityModuleInterface'
import { BookModule } from '~/assets/ts/store/book/BookModule'
import HistoryService from '~/assets/ts/service/HistoryService'
import EntityProxyService from '~/assets/ts/service/EntityProxyService'
import { bookPaperBaseUrl } from '~/assets/ts/store/book/BookPaperModule'
import RequestService from '~/assets/ts/service/RequestService'
import { BookElectronic, BookElectronicItem } from '~/assets/ts/models/BookElectronic'

@Module({ dynamic: true, name: 'bookElectronic', store, namespaced: true })
export class BookElectronicModule extends BookModule implements EntityModuleInterface<BookElectronic> {
  static baseUrl: string = '/electronic_books'

  protected proxy: EntityProxyService<BookElectronic> = new EntityProxyService(
    this.flagService, this.historyService
  )

  book: BookElectronic = new Proxy(this.bookService.getBaseElectronicBook(), this.proxy)

  tempNewFile?: File = undefined

    @Action({ rawError: true }) downloadEbook () {
    // todo: better way to avoid TS errors "Property XXX does not exist on type "ThisType<any>"
    // when accessing this.context.state.XXX?
    const state = (this.context.state as { tempNewFile: File })

    let promise
    if (typeof this.book.bookFile === 'object' && this.book.bookFile !== null) {
      const requestService = container.resolve(RequestService)
      const request = requestService.createRequest('/book_files/' + this.book.bookFile.id).setResponseType('blob')
      promise = requestService.execute<Blob>(request)
        .then(blob => URL.createObjectURL(blob))
    } else if (typeof state.tempNewFile !== 'undefined') {
      promise = new Promise((resolve) => {
        return resolve(URL.createObjectURL(state.tempNewFile))
      })
    }

    if (typeof promise !== 'undefined') {
      promise
        .then((url) => {
          const a = document.createElement('a')
          a.href = (url as string)
          a.download = (this.book.bookFile as FileEntity).path
          document.body.appendChild(a)
          a.click()
          document.body.removeChild(a)
        })
        .catch((error) => {
          console.error(error)
          alert('Impossible de télécharger le fichier')
        })
    }
  }

    @Action({ rawError: true }) get (id: number) {
      this.historyService.init()
      return super.getBase<BookElectronicItem>(id, BookElectronicModule.baseUrl)
        .then((book: BookElectronicItem) => {
          const electronicBook = {
            ...book,
            hasBookFile: (typeof book.bookFile === 'object')
          }
          this.set(electronicBook)
          return this.book
        })
    }

    @Action({ rawError: true }) save (bookTypeChanged: boolean = false): Promise<any> {
      const requestService = container.resolve(RequestService)
      const method = this.bookService.isPersisted(this.book) ? 'PUT' : 'POST'
      const url = (bookTypeChanged ? bookPaperBaseUrl : BookElectronicModule.baseUrl) +
            (method === 'PUT' ? ('/' + this.book.id) : '')
      const request = requestService.createRequest(url, method)
        .setBody(this.bookService.prepareForUpload(this.book))
        .addHeader('Content-Type', 'application/json')

      return requestService.execute<BookElectronicItem>(request)
        .then((response: BookElectronicItem) => {
          response.authors = this.book.authors
          this.set(response)

          this.eventService.trigger(BookElectronicModule.EVENT_BOOK_SAVED)
        })
    }

    @Mutation set (book: BookElectronic) {
      this.flagService.reset()
      this.historyService.init()
      this.book = new Proxy(book, this.proxy)
    }

    @Mutation unlinkBookFile () {
      this.historyService.addEntry('bookFile', undefined, this.book.bookFile)
      this.book.bookFile = undefined
      this.book.hasBookFile = false
      this.flagService.flags.isModified = true
    }

    @Mutation setTempNewFile (bookFile: File) {
      this.tempNewFile = bookFile
    }

    @Mutation setBookFile (bookFile: FileEntity) {
      this.book.bookFile = bookFile
    }

    @Mutation init (): void {
      super.init()
      this.flagService.reset()
      this.historyService.init()
      this.book = new Proxy(this.bookService.getBaseElectronicBook(), this.proxy)
    }

    @Mutation setHistoryService (historyService: HistoryService) {
      super.setHistoryService(historyService)
      this.proxy.historyService = historyService
    }

    @Action({ rawError: true }) linkNewFile (file: { file: File, name: string }) {
      const requestService = container.resolve(RequestService)
      this.context.commit('setTempNewFile', file.file)

      this.flagService.flags.readyToSave = false

      return requestService.sendFile(file.file, '/book_files')
        .then((response: any) => {
          this.context.commit('setBookFile', response)
          this.flagService.flags.readyToSave = true
          return Promise.resolve(response)
        })
        .catch((response: any) => {
          this.flagService.flags.readyToSave = true
          return Promise.reject(response)
        })
    }
}

export default getModule(BookElectronicModule)
export const bookElectronicBaseUrl = BookElectronicModule.baseUrl
