<template>
  <div id="book-list" :class="{withPopupOpened: bookToDeleteDisplayPopup}">
    <List
      ref="list"
      api-endpoint="/books"
      :cols="cols"
      :left-action-bar-properties="leftActionBarProperties"
      details-component-path="book/BookListRowDetails.vue"
      :callback="setBook"
      name="book"
      @custom-action-triggered="customActionTriggered"
    />
    <BookListPopupDelete
      v-if="bookToDeleteDisplayPopup"
      :book-title="bookToDeleteBookTitle"
      @book-delete-cancel="bookDeleteCancel"
      @book-delete-trigger="bookDeleteTrigger"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { container } from 'tsyringe'
import Column from 'assets/ts/list/Column'
import DataSubProperty from 'assets/ts/list/DataSubProperty'
import LeftActionBarElement from 'assets/ts/list/LeftActionBarElement'
import LeftActionBarProperties from 'assets/ts/list/LeftActionBarProperties'
import BookService from 'assets/ts/service/BookService'
import bookElectronicModule from 'assets/ts/store/book/BookElectronicModule'
import bookAudioModule from '~/assets/ts/store/book/BookAudioModule'
import LeftActionBarSeparatorDescriptor from 'assets/ts/list/LeftActionBarSeparatorDescriptor'
import List from '~/components/list/List.vue'
import LeftActionBarLinkDescriptor from 'assets/ts/list/LeftActionBarLinkDescriptor'
import { BookPaperItem } from '~/assets/ts/models/BookPaper'
import { BookElectronicItem } from '~/assets/ts/models/BookElectronic'
import BookListPopupDelete from '~/components/book/BookListPopupDelete.vue'
import BookStoreService from '~/assets/ts/service/BookStoreService'
import RowActionPayload from '~/assets/ts/list/RowActionPayload'
import { BookAudioItem } from '~/assets/ts/models/BookAudio'
import MedSelectDescriptor, { SelectValue } from '~/assets/ts/form/MedSelectDescriptor'
import UserService from '~/assets/ts/service/UserService'
import bookListModule from '~/assets/ts/store/list/BookListModule'

const bookService = container.resolve(BookService)

@Component({
  components: {
    List,
    BookListPopupDelete
  },
  layout (context) {
    return context.$device.isMobile ? 'mobile-layout-with-menu' : 'default'
  }
})
export default class Book extends Vue {
  cols = [
    new Column('title', 'Titre'),
    new Column('year', 'Année'),
    new Column('language', 'Langue'),
    new Column('authors', 'Auteurs')
      .setSearchParameterName('authorFullname')
      .setIsSortable(false)
      .setSubProperties([
        new DataSubProperty('person', [
          new DataSubProperty('firstname'),
          new DataSubProperty('lastname')
        ])
      ])
  ]

  leftActionBarProperties = new LeftActionBarProperties([
    new LeftActionBarElement(
      'separator',
      () => null,
      new LeftActionBarSeparatorDescriptor('add').setLabel('Ajouter').setFaIcon('fas fa-plus')
    ),
    new LeftActionBarElement(
      'element',
      () => null,
      new LeftActionBarLinkDescriptor('addPaper', 'Livre papier', '/book/paper').setFaIcon('fas fa-scroll')
    ),
    new LeftActionBarElement(
      'element',
      () => null,
      new LeftActionBarLinkDescriptor('addElectronic', 'Epub', '/book/electronic/upload').setFaIcon('fas fa-tablet-alt')
    ),
    new LeftActionBarElement(
      'element',
      () => null,
      new LeftActionBarLinkDescriptor('addAudio', 'Audio', '/book/audio').setFaIcon('fas fa-music')
    ),
    new LeftActionBarElement(
      'separator',
      () => null,
      new LeftActionBarSeparatorDescriptor('filters').setLabel('Filtres').setFaIcon('fas fa-sliders-h')
    ),
    new LeftActionBarElement(
      'filter',
      () => null,
      new MedSelectDescriptor('bookType')
        .setOptions([
          {
            label: 'Tous',
            key: 'all',
            value: 'all',
            default: true
          },
          {
            label: 'Papier',
            key: 'paper',
            value: 'paper'
          },
          {
            label: 'Epub',
            key: 'electronic',
            value: 'electronic'
          },
          {
            label: 'Audio',
            key: 'audio',
            value: 'audio'
          }
        ])
        .setFaIcon('fas fa-book')
    ),
    new LeftActionBarElement(
      'filter',
      () => null,
      new MedSelectDescriptor('owner')
        .setOptions(container.resolve(UserService).getUsers().then((data) => {
          const options: SelectValue[] = data['hydra:member']
            .map((user) => {
              return {
                key: user.id?.toString() ?? '',
                value: user.id,
                label: user.firstname + ' ' + user.lastname
              }
            })
            .sort((first, second) => first.label.localeCompare(second.label))

          options.unshift(
            {
              key: 'all',
              value: null,
              label: 'Tous',
              default: true
            }
          )

          return options
        }))
        .setFaIcon('fas fa-user')
    )
  ], false)

  setBook (selectedBook: BookPaperItem | BookElectronicItem | BookAudioItem) {
    window.location.href = bookService.getBookUrl(selectedBook)
  }

  customActionTriggered (action: RowActionPayload, book: BookPaperItem | BookElectronicItem) {
    switch (action.action) {
      case 'download_electronic':
        if (typeof book.id === 'undefined') {
          throw new TypeError('The book id is not defined')
        }

        bookElectronicModule.get(book.id).then(() => {
          bookElectronicModule.downloadEbook()
        })
        break
      case 'download_audio':
        if (typeof book.id === 'undefined') {
          throw new TypeError('The book id is not defined')
        }

        bookAudioModule.get(book.id).then(() => {
          bookAudioModule.downloadBookFile()
        })
        break
    }
  }

  bookDeleteCancel () {
    bookListModule.setBookToDelete(null)
  }

  bookDeleteTrigger () {
    if (bookListModule.bookToDelete === null) {
      return
    }
    const bookStore = (new BookStoreService()).getStore(bookListModule.bookToDelete)
    bookStore.setBook(bookListModule.bookToDelete)
    bookStore.deleteBook()
      .then(() => {
        bookListModule.setBookToDelete(null);
        (this.$refs.list as any).load()
      })
      .catch((error) => {
        this.$toasted.show(error, {
          ...this.$config.default.notification_settings,
          type: 'error',
          icon: 'fa-times'
        })
      })
  }

  bookToDeleteDisplayPopup: boolean = false

  get bookToDeleteBookTitle () {
    return bookListModule.bookToDelete?.title
  }

  get bookToDelete () {
    return bookListModule.bookToDelete
  }

  @Watch('bookToDelete')
  bookToDeleteChanged () {
    this.bookToDeleteDisplayPopup = bookListModule.bookToDelete !== null
  }

  get bookToDownload () {
    return bookListModule.bookToDownload
  }

  @Watch('bookToDownload')
  bookToDownloadChanged () {
    if (this.bookToDownload === null || !this.bookToDownload.id) {
      return
    }

    const downloadErrorHandler = (err: Error) => {
      this.$toast.error(
        this.$t('books.list.download_book_error').toString(),
        {
          ...this.$config.default.notification_settings,
          duration: 3000,
          icon: 'fa-times'
        }
      )
      console.error(err)
    }

    switch (this.bookToDownload['@type']) {
      case BookService.bookElectronic:
        bookElectronicModule.get(this.bookToDownload.id)
          .then(() => bookElectronicModule.downloadEbook())
          .catch((err: Error) => {
            downloadErrorHandler(err)
          })
          .finally(() => bookElectronicModule.init())
        break
      case BookService.bookAudio:
        bookAudioModule.get(this.bookToDownload.id)
          .then(() => bookAudioModule.downloadBookFile())
          .catch((err: Error) => {
            downloadErrorHandler(err)
          })
          .finally(() => bookAudioModule.init())
        break
      default:
        downloadErrorHandler(new Error('Cannot download books of type ' + this.bookToDownload['@type']))
    }
  }
}
</script>

<style lang="scss">
#book-list {
  position: relative;

  &.withPopupOpened #vueListContainer {
    filter: blur(8px);
  }
}
</style>
