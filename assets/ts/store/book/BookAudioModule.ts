import { Action, getModule, Module, Mutation } from 'vuex-module-decorators'
import { container } from 'tsyringe'
import { AxiosError } from 'axios'
import store from '~/assets/ts/store/store'
import { BookModule } from '~/assets/ts/store/book/BookModule'
import EntityModuleInterface from '~/assets/ts/store/EntityModuleInterface'
import { BookAudio, BookAudioItem } from '~/assets/ts/models/BookAudio'
import RequestService from '~/assets/ts/service/RequestService'
import EntityProxyService from '~/assets/ts/service/EntityProxyService'
import { FileEntity } from '~/assets/ts/entity/FileEntity'
import BookWithFileHelper from '~/assets/ts/store/book/BookWithFileHelper'

@Module({
  dynamic: true,
  name: 'bookAudio',
  store,
  namespaced: true
})
export class BookAudioModule extends BookModule implements EntityModuleInterface<BookAudio> {
  static baseUrl: string = '/audio_books'

  protected proxy: EntityProxyService<BookAudio> = new EntityProxyService(
    this.flagService, this.historyService
  )

  protected bookWithFileHelper = new BookWithFileHelper()

  book: BookAudio = new Proxy(this.bookService.getBaseAudioBook(), this.proxy)

  tempNewFile?: File

  get audioBookFilename () {
    const name = typeof this.book.title === 'string' && this.book.title.length > 0 ? this.book.title : 'Nouveau livre'
    let extension = '.'
    if (typeof this.book.bookFile !== 'string') {
      extension += this.book.bookFile?.path.split('.').pop() ?? ''
    }
    return name + (extension ?? '')
  }

  @Action({ rawError: true }) get (id: number) {
    this.historyService.init()
    return super.getBase<BookAudioItem>(id, BookAudioModule.baseUrl)
      .then((book: BookAudioItem) => {
        const audioBook = {
          ...book,
          hasBookFile: (typeof book.bookFile === 'object')
        }
        this.set(audioBook)
        return this.book
      })
  }

  @Action({ rawError: true }) save (): Promise<any> {
    const requestService = container.resolve(RequestService)
    const method = this.bookService.isPersisted(this.book) ? 'PUT' : 'POST'
    const request = requestService
      .createRequest(BookAudioModule.baseUrl + (method === 'PUT' ? ('/' + this.book.id) : ''), method)
      .setBody(this.bookService.prepareForUpload(this.book))
      .addHeader('Content-Type', 'application/json')

    return requestService.execute<BookAudioItem>(request)
      .catch((error: Error | AxiosError) => super.handleViolations(error))
      .then((response: BookAudioItem) => {
        response.authors = this.book.authors
        this.set(response)

        this.eventService.trigger(BookAudioModule.EVENT_BOOK_SAVED)
      })
  }

  @Mutation set (book: BookAudio) {
    this.flagService.reset()
    this.historyService.init()
    this.violations = {}
    this.book = new Proxy(book, this.proxy)
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

  @Mutation unlinkBookFile () {
    this.historyService.addEntry('bookFile', undefined, this.book.bookFile)
    this.book.bookFile = undefined
    this.book.hasBookFile = false
    this.flagService.flags.isModified = true
  }

  @Action({ rawError: true }) linkNewFile (file: { file: File, name: string }) {
    const requestService = container.resolve(RequestService)
    this.context.commit('setTempNewFile', file.file)

    this.flagService.flags.readyToSave = false

    return requestService.sendFile(file.file, '/audio_book_files')
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

  @Action({ rawError: true }) downloadBookFile (): Promise<void> {
    if (typeof this.book.bookFile === 'object' && this.book.bookFile !== null) {
      this.bookWithFileHelper.downloadBookFile(
        this.audioBookFilename,
        'audio_book_files/' + this.book.bookFile.id,
        'audio_book_file_download_tokens'
      )
      return Promise.resolve()
    } else {
      return Promise.reject(new Error('bookFile property is empty or null'))
    }
  }
}

export default getModule(BookAudioModule)
