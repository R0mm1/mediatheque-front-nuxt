import { Action, getModule, Module, Mutation } from 'vuex-module-decorators'
import { BookModule } from '~/assets/ts/store/book/BookModule'
import store from '~/assets/ts/store/store'
import EntityModuleInterface from '~/assets/ts/store/EntityModuleInterface'
import EntityProxyService from '~/assets/ts/service/EntityProxyService'
import HistoryService from '~/assets/ts/service/HistoryService'
import { bookElectronicBaseUrl } from '~/assets/ts/store/book/BookElectronicModule'
import { BookPaper, BookPaperItem } from '~/assets/ts/models/BookPaper'

@Module({ dynamic: true, name: 'bookPaper', store, namespaced: true })
export class BookPaperModule extends BookModule implements EntityModuleInterface<BookPaper> {
    static baseUrl: string = '/paper_books';

    protected proxy: EntityProxyService<BookPaper> = new EntityProxyService(
      this.flagService, this.historyService
    );

    book: BookPaper = new Proxy(this.bookService.getBasePaperBook(), this.proxy);

    @Mutation set (book: BookPaper) {
      this.flagService.reset()
      this.historyService.init()
      this.book = new Proxy(book, this.proxy)
    }

    @Mutation init (): void {
      super.init()
      this.flagService.reset()
      this.historyService.init()
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
      if (typeof this.book.owner === 'string' && this.book.owner.match(/api\/users\/loggedIn\?id=\d*/)) {
        const id = this.book.owner.split('id=').pop()
        this.book.owner = '/api/users/' + id
      }

      const method = this.bookService.isPersisted(this.book) ? 'PUT' : 'POST'
      const url = (bookTypeChanged ? bookElectronicBaseUrl : BookPaperModule.baseUrl) +
            (method === 'PUT' ? ('/' + this.book.id) : '')

      const request = this.requestService.createRequest(url, method)
        .addHeader('Content-Type', 'application/json')
        .setBody(this.bookService.prepareForUpload(this.book))

      return this.requestService.execute<BookPaperItem>(request)
        .then((response: BookPaperItem) => {
          response.authors = this.book.authors
          this.set(response)

          this.eventService.trigger(BookPaperModule.EVENT_BOOK_SAVED)
          return response
        })
    }
}

export default getModule(BookPaperModule)
export const bookPaperBaseUrl = BookPaperModule.baseUrl
