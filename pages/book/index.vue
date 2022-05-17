<template>
  <div id="book-list" :class="{withPopupOpened: bookDeleteDisplayPopup}">
    <List
      ref="list"
      api-endpoint="/books"
      :cols="cols"
      :row-actions="rowActions"
      :left-action-bar-properties="leftActionBarProperties"
      details-component-path="book/BookListRowDetails.vue"
      :callback="setBook"
      @custom-action-triggered="customActionTriggered"
    />
    <BookListPopupDelete
      :is-displayed="bookDeleteDisplayPopup"
      :book-title="bookDeleteBookTitle"
      @book-delete-cancel="bookDeleteCancel"
      @book-delete-trigger="bookDeleteTrigger"
    />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import Column from 'assets/ts/list/Column'
import DataSubProperty from 'assets/ts/list/DataSubProperty'
import RowAction from 'assets/ts/list/RowAction'
import LeftActionBarElement from 'assets/ts/list/LeftActionBarElement'
import LeftActionBarProperties from 'assets/ts/list/LeftActionBarProperties'
import LeftActionBarFormSelectDescriptor from 'assets/ts/list/LeftActionBarFormSelectDescriptor'
import BookService from 'assets/ts/service/BookService'
import bookElectronicModule from 'assets/ts/store/book/BookElectronicModule'
import LeftActionBarSeparatorDescriptor from 'assets/ts/list/LeftActionBarSeparatorDescriptor'
import List from '~/components/list/List.vue'
import LeftActionBarLinkDescriptor from 'assets/ts/list/LeftActionBarLinkDescriptor'
import { BookPaperItem } from '~/assets/ts/models/BookPaper'
import { BookElectronicItem } from '~/assets/ts/models/BookElectronic'
import BookListPopupDelete from '~/components/book/BookListPopupDelete.vue'
import BookStoreService from '~/assets/ts/service/BookStoreService'
import RowActionPayload from '~/assets/ts/list/RowActionPayload'

@Component({
  components: { List, BookListPopupDelete }
})
export default class Book extends Vue {
  bookDeleteDisplayPopup: boolean = false
  bookDeleteBook: BookPaperItem | BookElectronicItem | null = null

  get bookDeleteBookTitle () {
    return this.bookDeleteBook?.title
  }

  cols = [
    new Column('title', 'Titre'),
    new Column('year', 'Année'),
    new Column('language', 'Langue'),
    new Column('authors', 'Auteurs')
      .setSearchParameterName('authorFullname')
      .setSubProperties([
        new DataSubProperty('firstname'),
        new DataSubProperty('lastname')
      ])
  ]

  rowActions = [
    new RowAction('download', '', 'fas fa-file-download')
      .setIsDisplayed((book: BookPaperItem | BookElectronicItem) => {
        return typeof book['@type'] === 'string' && book['@type'] === BookService.bookElectronic
      }),
    new RowAction('delete', '', 'far fa-trash-alt')
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
      new LeftActionBarLinkDescriptor('addElectronic', 'Epub', '/book/electronic').setFaIcon('fas fa-tablet-alt')
    ),
    new LeftActionBarElement(
      'separator',
      () => null,
      new LeftActionBarSeparatorDescriptor('filters').setLabel('Filtres').setFaIcon('fas fa-sliders-h')
    ),
    new LeftActionBarElement(
      'filter',
      () => null,
      new LeftActionBarFormSelectDescriptor('bookType', {
        all: 'Tous',
        paper: 'Papier',
        electronic: 'Epub'
      }).setDefaultValue('all').setFaIcon('fas fa-book').setNoDefaultStyle(true)
    )
  ], false)

  setBook (selectedBook: BookPaperItem | BookElectronicItem) {
    const type = selectedBook['@type']
    if (type !== 'ElectronicBook' && type !== 'PaperBook') {
      throw new Error('Invalid book type')
    }

    const matchingType = {
      ElectronicBook: 'electronic/',
      PaperBook: 'paper/'
    }

    window.location.href = '/book/' + matchingType[type] + selectedBook.id
  }

  customActionTriggered (action: RowActionPayload, book: BookPaperItem | BookElectronicItem) {
    switch (action.action) {
      case 'download':
        if (typeof book.id === 'undefined') {
          throw new TypeError('The book id is not defined')
        }
        bookElectronicModule.get(book.id).then(() => {
          bookElectronicModule.downloadEbook()
        })
        break
      case 'delete': {
        this.bookDeleteBook = book
        this.bookDeleteDisplayPopup = true
        break
      }
    }
  }

  bookDeleteCancel () {
    this.bookDeleteDisplayPopup = false
    this.bookDeleteBook = null
  }

  bookDeleteTrigger () {
    if (this.bookDeleteBook === null) {
      return
    }
    const bookStore = (new BookStoreService()).getStore(this.bookDeleteBook)
    bookStore.setBook(this.bookDeleteBook)
    bookStore.deleteBook()
      .then(() => {
        this.bookDeleteDisplayPopup = false
        this.bookDeleteBook = null;
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
}
</script>

<style lang="scss">
#book-list{
  position: relative;

  &.withPopupOpened #vueListContainer{
    filter: blur(8px);
  }
}
</style>
