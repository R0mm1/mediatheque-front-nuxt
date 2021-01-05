import { Module, VuexModule, getModule, Mutation } from 'vuex-module-decorators'
import store from '~/assets/ts/store/store'
import { BookPaperEntity } from '~/assets/ts/entity/BookPaperEntity'
import { BookElectronicEntity } from '~/assets/ts/entity/BookElectronicEntity'
import HistoryService from '~/assets/ts/service/HistoryService'

@Module({ dynamic: true, name: 'bookPopup', store, namespaced: true })
class BookPopupModule extends VuexModule {
    // If the type of the book is modified, a backup is done to keep the data that may not exist anymore in
    // the new type. This avoid the need of replaying the history from the origin.
    bookSnapshot?: BookPaperEntity | BookElectronicEntity;

    // The original book loaded. We keep it in case of a book type change, because some data may be lost otherwise.
    origin?: BookPaperEntity | BookElectronicEntity | null = null;

    // The history of the book
    historyService?: HistoryService = new HistoryService();

    utils: { [key: string]: Function } = {
      getBook: (book: BookPaperEntity | BookElectronicEntity) => {
        if (typeof book.isProxy !== 'undefined' && book.isProxy === true) {
          return book.target
        }
        return book
      }
    };

    /**
     * Get an electronic book from a paper book, or the inverse.
     * The original book used is the backed up one.
     */
    get otherTypeFromSnapshot () {
      return () => {
        // Return a function to avoid caching
        if (typeof this.bookSnapshot === 'undefined') { throw 'There is no book snapshot' }
        if (typeof this.historyService === 'undefined') { throw 'There is no history provided' }

        const initGeneralProps = (book: any, bookType: string) => {
          return book
        }

        const retrieveValue = (book: object, field: string, historyService: HistoryService) => {
          (book as any)[field] = (this.origin as any)[field]
          const fieldHistoryEntry = historyService.getLastFieldModification(field)
          if (typeof fieldHistoryEntry !== 'undefined') {
            (book as any)[field] = fieldHistoryEntry.newVal
          }
          return book
        }

        let book: any = JSON.parse(JSON.stringify(this.bookSnapshot))

        if (typeof this.bookSnapshot.hasBookFile !== 'undefined') {
          // We create a paper book from an electronic book
          delete book.hasBookFile
          delete book.bookFile
          book['@type'] = 'PaperBook'
        } else {
          // We create an electronic book from a paper book

          // bookFile and hasBookFile may have been lost because they doesn't exist on paper books, so we try to
          // restore them from the history
          book = retrieveValue(book, 'bookFile', this.historyService)
          book = retrieveValue(book, 'hasBookFile', this.historyService)
          book['@type'] = 'ElectronicBook'
        }

        return book
      }
    }

    get hasOrigin () {
      return typeof this.origin !== 'undefined' && this.origin !== null
    }

    @Mutation setOrigin (origin: BookPaperEntity | BookElectronicEntity) {
      this.origin = this.utils.getBook(origin)
    }

    @Mutation setHistoryService (historyService: HistoryService) {
      this.historyService = historyService
    }

    @Mutation setBookSnapshot (book: BookPaperEntity | BookElectronicEntity) {
      this.bookSnapshot = this.utils.getBook(book)
    }

    @Mutation init () {
      this.bookSnapshot = undefined
      this.historyService = new HistoryService()
    }
}

export default getModule(BookPopupModule)
