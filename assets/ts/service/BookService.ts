import { GroupEntity } from '@/assets/ts/entity/module'
import EntityService from '@/assets/ts/service/EntityService'
import { BookPaper, BookPaperItem } from '~/assets/ts/models/BookPaper'
import { Book } from '~/assets/ts/models/Book'
import { BookElectronic, BookElectronicItem } from '~/assets/ts/models/BookElectronic'
import { BookAudio, BookAudioItem } from '~/assets/ts/models/BookAudio'
import { Author } from '~/assets/ts/models/Author'

export type BookTypes = 'ElectronicBook' | 'PaperBook' | 'AudioBook'

export default class BookService {
  static bookElectronic: BookTypes = 'ElectronicBook'
  static bookPaper: BookTypes = 'PaperBook'
  static bookAudio: BookTypes = 'AudioBook'

  entityService: EntityService = new EntityService()

  getBaseBook (): Book {
    return {
      title: '',
      cover: null,
      authors: [],
      groupMemberships: []
    }
  }

  getBasePaperBook (): BookPaper {
    return {
      ...this.getBaseBook()
    }
  }

  getBaseElectronicBook (): BookElectronic {
    return {
      ...this.getBaseBook(),
      hasBookFile: false,
      bookFile: null
    }
  }

  getBaseAudioBook (): BookAudio {
    return {
      ...this.getBaseBook(),
      bookFile: null,
      hasBookFile: false
    }
  }

  isPersisted (book: Book): boolean {
    return typeof book.id !== 'undefined'
  }

  hasAuthor (book: Book, author: Author): boolean | number {
    let hasAuthor: boolean | number = false
    book.authors.forEach((bookAuthor: Author, index) => {
      if (author.id === bookAuthor.id) { hasAuthor = index }
    })
    return hasAuthor
  }

  prepareForUpload (book: BookPaper | BookElectronic) {
    const bookPrepared: any = {
      ...book,
      cover: this.entityService.getIri(book.cover),
      authors: book.authors.map((author: Author) :string => {
        return '/authors/' + author.id
      }),
      editor: this.entityService.getIri(book.editor)
    }

    if (typeof bookPrepared.bookFile !== 'undefined' && 'bookFile' in book) {
      bookPrepared.bookFile = this.entityService.getIri(book.bookFile)
    }

    return JSON.stringify(bookPrepared)
  }

  getBookUrl (book: Partial<BookPaperItem | BookElectronicItem | BookAudioItem>) {
    if (typeof book['@type'] === 'undefined' || typeof book.id === 'undefined') {
      throw new TypeError('Both @type and id properties need to be defined')
    }

    if (book['@type'] !== 'ElectronicBook' && book['@type'] !== 'PaperBook' && book['@type'] !== 'AudioBook') {
      throw new Error('Invalid book type')
    }

    const matchingType: Record<BookTypes, string> = {
      ElectronicBook: 'electronic/',
      PaperBook: 'paper/',
      AudioBook: 'audio/'
    }

    return '/book/' + matchingType[book['@type']] + book.id
  }
}
