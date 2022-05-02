import { BookEntity, AuthorEntity, GroupEntity } from '@/assets/ts/entity/module'
import EntityService from '@/assets/ts/service/EntityService'
import { BookPaper } from '~/assets/ts/models/BookPaper'
import { Book } from '~/assets/ts/models/Book'
import { BookElectronic } from '~/assets/ts/models/BookElectronic'

export default class BookService {
  static bookElectronic: string = 'ElectronicBook'
  static bookPaper: string = 'PaperBook'

  entityService: EntityService = new EntityService()

  getBaseBook (): Book {
    return {
      title: '',
      cover: null,
      authors: [],
      groups: []
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

  isPersisted (book: BookEntity): boolean {
    return typeof book.id !== 'undefined'
  }

  hasAuthor (book: BookEntity, author: AuthorEntity): boolean | number {
    let hasAuthor: boolean | number = false
    book.authors.forEach((bookAuthor: AuthorEntity, index) => {
      if (author.id === bookAuthor.id) { hasAuthor = index }
    })
    return hasAuthor
  }

  prepareForUpload (book: BookPaper | BookElectronic) {
    const bookPrepared: any = {
      ...book,
      cover: this.entityService.getIri(book.cover),
      authors: book.authors.map((author: AuthorEntity) :string => {
        return '/authors/' + author.id
      }),
      groups: book.groups.map((group: GroupEntity): string => {
        return '/reference_groups/' + group.id
      })
    }

    if (typeof bookPrepared.bookFile !== 'undefined' && 'bookFile' in book) {
      bookPrepared.bookFile = this.entityService.getIri(book.bookFile)
    }

    return JSON.stringify(bookPrepared)
  }
}
