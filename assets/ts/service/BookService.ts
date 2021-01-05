import { BookEntity, BookPaperEntity, BookElectronicEntity, AuthorEntity, GroupEntity } from '@/assets/ts/entity/module'
import EntityService from '@/assets/ts/service/EntityService'

const config = require('../../../mediatheque.json')

export default class BookService {
    static bookElectronic: string = 'ElectronicBook';
    static bookPaper: string = 'PaperBook';

    entityService: EntityService = new EntityService();

    getBaseBook (): BookEntity {
      return {
        cover: null,
        authors: [],
        groups: []
      }
    }

    getBasePaperBook (): BookPaperEntity {
      return {
        ...this.getBaseBook(),
        '@type': BookService.bookPaper
      }
    }

    getBaseElectronicBook (): BookElectronicEntity {
      return {
        ...this.getBaseBook(),
        hasBookFile: false,
        '@type': BookService.bookElectronic,
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

    prepareForUpload (book: BookPaperEntity | BookElectronicEntity) {
      const bookPrepared: any = {
        ...book,
        cover: this.entityService.getIri(book.cover),
        authors: book.authors.map((author: AuthorEntity) :string => {
          return config.api.commonUrlBase + '/authors/' + author.id
        }),
        groups: book.groups.map((group: GroupEntity): string => {
          return config.api.commonUrlBase + '/reference_groups/' + group.id
        })
      }

      if (typeof bookPrepared.bookFile !== 'undefined') {
        bookPrepared.bookFile = this.entityService.getIri(book.bookFile)
      }

      return JSON.stringify(bookPrepared)
    }
}
