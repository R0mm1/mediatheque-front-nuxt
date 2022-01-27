import { container } from 'tsyringe'
import { Action, Mutation, VuexModule } from 'vuex-module-decorators'
import { Method } from 'axios'
import {
  AuthorEntity,
  BookEntity, FileEntity,
  GroupEntity,
  UserEntity,
  BookNotationEntity
} from '~/assets/ts/entity/module'
import BookService from '~/assets/ts/service/BookService'
import FlagService from '~/assets/ts/service/FlagService'
import EntityModuleFlagInterface from '~/assets/ts/store/EntityModuleFlagInterface'
import EventService from '~/assets/ts/service/EventService'
import HistoryService from '~/assets/ts/service/HistoryService'
import RequestService from '~/assets/ts/service/RequestService'

export abstract class BookModule extends VuexModule {
    static EVENT_BOOK_SAVED = 'book-saved';

    static baseUrl: string = '/books';

    protected bookService: BookService = new BookService();

    protected eventService: EventService = EventService.getService();

    protected requestService = container.resolve(RequestService);

    historyService: HistoryService = new HistoryService();

    book: BookEntity = this.bookService.getBaseBook();

    tempNewCover: File | null = null; // Can't use undefined instead of null otherwise the attribute won't appear on the state

    // The notation given to the book by the user
    notation: BookNotationEntity | null = null;

    flagService: FlagService<EntityModuleFlagInterface> = new FlagService({
      isModified: false,
      readyToSave: true
    });

    protected getBase<HydraItemType> (id: number, baseUrl: string): Promise<HydraItemType> {
      const request = this.requestService.createRequest(baseUrl + '/' + id)

      return this.requestService.execute<HydraItemType>(request)
    }

    @Mutation init (): void {
      this.notation = null
    }

    @Mutation setHistoryService (historyService: HistoryService) {
      this.historyService = historyService
    }

    @Mutation setBook (book: BookEntity) {
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
      this.book.summary = summary
    }

    @Mutation addAuthor (author: AuthorEntity) {
      const authorAtIndex = this.bookService.hasAuthor(this.book, author)
      if (authorAtIndex === false) {
        const authors = Array.from(this.book.authors)
        authors.push(author)
        this.book.authors = authors
      }
    }

    @Mutation removeAuthor (author: AuthorEntity) {
      const authorAtIndex = this.bookService.hasAuthor(this.book, author)
      if (typeof authorAtIndex === 'number') {
        const authors = Array.from(this.book.authors)
        authors.splice(authorAtIndex, 1)
        this.book.authors = authors
      }
    }

    @Mutation setOwner (owner: string|undefined) {
      this.book.owner = owner
    }

    @Mutation setCover (cover: FileEntity) {
      this.book.cover = cover
    }

    // todo: to be removed
    @Mutation addGroup (group: GroupEntity) {
      this.book.groups.push(group)
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

    @Action({ rawError: true })
    linkNewCover (file: { file: File, name: string }) {
      this.context.commit('setTempNewCover', file.file)

      this.flagService.flags.readyToSave = false

      return this.requestService.sendFile(file.file, '/book/covers')
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
      if (this.notation !== null) {
        return Promise.resolve(this.notation)
      }

      if (typeof this.book.id === 'undefined') {
        return
      }

      const request = this.requestService.createRequest('/book_notations')
        .setQueryParams({
          'book.id': this.book.id
        })

      return this.requestService.execute<any>(request)
        .then((response) => {
          if (response['hydra:member'].length > 0) {
            this.context.commit('setNotation', response['hydra:member'].pop())
          } else {
            this.context.commit('setNotation', null)
          }
          return Promise.resolve(this.notation)
        })
    }

    @Action({ rawError: true })
    updateNote (note: Number) {
      const requestBody: BookNotationEntity = {}
      let url = '/book_notations'
      let method:Method = 'POST'

      if (this.notation === null) {
        requestBody.book = this.book['@id']
        requestBody.note = note
      } else {
        requestBody.note = note
        method = 'PUT'
        url += '/' + this.notation.id
      }

      const request = this.requestService.createRequest(url, method)
        .setBody(requestBody)
        .addHeader('Content-Type', 'application/json')
      return this.requestService.execute(request)
        .then((response) => {
          this.context.commit('setNotation', response)
          return Promise.resolve(response)
        })
    }

    @Action({ rawError: true })
    deleteBook () {
      if (typeof this.book.id === 'undefined') {
        return Promise.reject(new Error('There is no existing loaded book'))
      }

      const request = this.requestService.createRequest('/books/' + this.book.id, 'DELETE')
      return this.requestService.execute(request)
    }
}
