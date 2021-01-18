
import bookElectronicModule, { BookElectronicModule } from '~/assets/ts/store/book/BookElectronicModule'
import bookPaperModule, { BookPaperModule } from '~/assets/ts/store/book/BookPaperModule'
import BookService from '~/assets/ts/service/BookService'
import { BookPaperItem } from '~/assets/ts/models/BookPaper'
import { BookElectronicItem } from '~/assets/ts/models/BookElectronic'

export default class BookStoreService {
  getStore (book: BookPaperItem | BookElectronicItem): BookElectronicModule | BookPaperModule {
    if (typeof book['@type'] === 'undefined') {
      throw new TypeError('Could not determine book type due to invalid property')
    }
    const stores: {[index: string]: BookElectronicModule | BookPaperModule} = {}
    stores[BookService.bookElectronic] = bookElectronicModule
    stores[BookService.bookPaper] = bookPaperModule

    const store = stores[book['@type']]
    if (typeof store === 'undefined') {
      throw new TypeError('Could not determine the book type due to invalid property')
    }

    return store
  }
}
