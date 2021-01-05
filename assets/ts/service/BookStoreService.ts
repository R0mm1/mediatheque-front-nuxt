import { BookPaperEntity } from '~/assets/ts/entity/BookPaperEntity'
import { BookElectronicEntity } from '~/assets/ts/entity/BookElectronicEntity'
import bookElectronicModule, { BookElectronicModule } from '~/assets/ts/store/book/BookElectronicModule'
import bookPaperModule, { BookPaperModule } from '~/assets/ts/store/book/BookPaperModule'
import BookService from '~/assets/ts/service/BookService'

export default class BookStoreService {
  getStore (book: BookPaperEntity | BookElectronicEntity): BookElectronicModule | BookPaperModule {
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
