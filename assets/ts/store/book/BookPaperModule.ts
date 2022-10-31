import { Action, getModule, Module, Mutation } from 'vuex-module-decorators'
import { container } from 'tsyringe'
import { AxiosError } from 'axios'
import { BookModule } from '~/assets/ts/store/book/BookModule'
import store from '~/assets/ts/store/store'
import EntityModuleInterface from '~/assets/ts/store/EntityModuleInterface'
import EntityProxyService from '~/assets/ts/service/EntityProxyService'
import HistoryService from '~/assets/ts/service/HistoryService'
import { bookElectronicBaseUrl } from '~/assets/ts/store/book/BookElectronicModule'
import { BookPaper, BookPaperItem } from '~/assets/ts/models/BookPaper'
import RequestService from '~/assets/ts/service/RequestService'

@Module({
  dynamic: true,
  name: 'bookPaper',
  store,
  namespaced: true
})
export class BookPaperModule extends BookModule implements EntityModuleInterface<BookPaper> {
  static baseUrl: string = '/paper_books'

  protected proxy: EntityProxyService<BookPaper> = new EntityProxyService(
    this.flagService, this.historyService
  )

  book: BookPaper = new Proxy(this.bookService.getBasePaperBook(), this.proxy)

  @Mutation set (book: BookPaper) {
    this.flagService.reset()
    this.historyService.init()
    this.violations = {}
    this.book = new Proxy(book, this.proxy)
  }

  @Mutation init (): void {
    super.init()
    this.flagService.reset()
    this.historyService.init()
    this.violations = {}
    this.book = new Proxy(this.bookService.getBasePaperBook(), this.proxy)
  }

  @Mutation setHistoryService (historyService: HistoryService) {
    super.setHistoryService(historyService)
    this.proxy.historyService = historyService
  }

  @Action({ rawError: true }) get (id: number) {
    this.historyService.init()
    return super.getBase<BookPaperItem>(id, BookPaperModule.baseUrl)
      .then((bookPaper) => {
        this.set(bookPaper)
        return this.book
      })
  }

  @Action({ rawError: true }) save (bookTypeChanged: boolean = false) {
    const requestService = container.resolve(RequestService)
    const method = this.bookService.isPersisted(this.book) ? 'PUT' : 'POST'
    const url = (bookTypeChanged ? bookElectronicBaseUrl : BookPaperModule.baseUrl) +
      (method === 'PUT' ? ('/' + this.book.id) : '')

    const request = requestService.createRequest(url, method)
      .addHeader('Content-Type', 'application/json')
      .setBody(this.bookService.prepareForUpload(this.book))

    return requestService.execute<BookPaperItem>(request)
      .catch((error: Error | AxiosError) => super.handleViolations(error))
      .then((response: BookPaperItem) => {
        response.authors = this.book.authors
        this.set(response)

        return response
      })
  }
}

export default getModule(BookPaperModule)
export const bookPaperBaseUrl = BookPaperModule.baseUrl
