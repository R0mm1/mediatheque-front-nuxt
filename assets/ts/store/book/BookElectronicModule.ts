import { Mutation, getModule, Action, Module } from 'vuex-module-decorators'
import { container } from 'tsyringe'
import { AxiosError } from 'axios'
import { FileEntity } from '~/assets/ts/entity/module'
import store from '~/assets/ts/store/store'
import EntityModuleInterface from '~/assets/ts/store/EntityModuleInterface'
import { BookModule } from '~/assets/ts/store/book/BookModule'
import HistoryService from '~/assets/ts/service/HistoryService'
import EntityProxyService from '~/assets/ts/service/EntityProxyService'
import { bookPaperBaseUrl } from '~/assets/ts/store/book/BookPaperModule'
import RequestService from '~/assets/ts/service/RequestService'
import { BookElectronic, BookElectronicItem } from '~/assets/ts/models/BookElectronic'
import { ElectronicBookInformation } from '~/assets/ts/models/electronicBookInformation/ElectronicBookInformation'
import { Image } from '~/assets/ts/models/electronicBookInformation/Image'
import BookWithFileHelper from '~/assets/ts/store/book/BookWithFileHelper'

@Module({
  dynamic: true,
  name: 'bookElectronic',
  store,
  namespaced: true
})
export class BookElectronicModule extends BookModule implements EntityModuleInterface<BookElectronic> {
  static baseUrl: string = '/electronic_books'

  protected proxy: EntityProxyService<BookElectronic> = new EntityProxyService(
    this.flagService, this.historyService
  )

  protected bookWithFileHelper = new BookWithFileHelper()

  book: BookElectronic = new Proxy(this.bookService.getBaseElectronicBook(), this.proxy)

  tempNewFile?: File = undefined

  get ebookFilename () {
    const name = typeof this.book.title === 'string' && this.book.title.length > 0 ? this.book.title : 'Nouveau livre'
    return name + '.epub'
  }

  @Action({ rawError: true }) downloadEbook (): Promise<void> {
    if (typeof this.book.bookFile === 'object' && this.book.bookFile !== null) {
      this.bookWithFileHelper.downloadBookFile(
        this.ebookFilename,
        'book_files/' + this.book.bookFile.id,
        'electronic_book_file_download_tokens'
      )
      return Promise.resolve()
    } else {
      return Promise.reject(new Error('bookFile property is empty or null'))
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
      .catch((error: Error | AxiosError) => super.handleViolations(error))
      .then((response: BookElectronicItem) => {
        response.authors = this.book.authors
        this.set(response)

        this.eventService.trigger(BookElectronicModule.EVENT_BOOK_SAVED)
      })
  }

  @Mutation set (book: BookElectronic) {
    this.flagService.reset()
    this.historyService.init()
    this.violations = {}
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
    this.violations = {}
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

  @Action({ rawError: true }) extractInfo (file: { file: File, name: string }) {
    const requestService = container.resolve(RequestService)
    this.context.commit('setTempNewFile', file.file)

    return requestService.sendFile(file.file, 'electronic_book_information/electronic_book_informations', 'electronicBook')
  }

  @Action({ rawError: true }) createBookFromElectronicBookInformation (electronicBookInformation: ElectronicBookInformation) {
    if (typeof electronicBookInformation.id === 'undefined') {
      throw new TypeError('Cannot create book from a not-persisted ElectronicBookInformation')
    }

    const requestService = container.resolve(RequestService)

    const formData = new FormData()
    formData.append('electronic_book_information_id', electronicBookInformation.id)

    const request = requestService.createRequest('book_files', 'POST')
    request.setBody(formData)
    request.addHeader('Content-Type', 'Content-Type')

    return requestService.execute(request)
      .then((response: any) => {
        this.context.commit('setBookFile', response)
        return Promise.resolve(response)
      })
  }

  @Action({ rawError: true }) createCoverFromElectronicBookInformationImage (electronicBookInformationImage: Image) {
    if (typeof electronicBookInformationImage.id === 'undefined') {
      throw new TypeError('Cannot create cover from a not-persisted ElectronicBookInformation Image')
    }

    const requestService = container.resolve(RequestService)

    const formData = new FormData()
    formData.append('electronic_book_information_image_id', electronicBookInformationImage.id)

    const request = requestService.createRequest('book/covers', 'POST')
    request.setBody(formData)
    request.addHeader('Content-Type', 'Content-Type')

    return requestService.execute(request)
      .then((response: any) => {
        this.context.commit('setCover', response)
        return Promise.resolve(response)
      })
  }

  @Action({ rawError: true }) deleteElectronicBookInformation (electronicBookInformation: ElectronicBookInformation) {
    if (typeof electronicBookInformation.id === 'undefined') {
      throw new TypeError('Cannot delete a not-persisted ElectronicBookInformation')
    }

    const requestService = container.resolve(RequestService)
    const request = requestService.createRequest('electronic_book_information/electronic_book_informations/' + electronicBookInformation.id, 'DELETE')
    return requestService.execute(request)
  }
}

export default getModule(BookElectronicModule)
export const bookElectronicBaseUrl = BookElectronicModule.baseUrl
