<template>
  <client-only>
    <div>
      <List
        ref="list"
        api-endpoint="/books"
        :cols="cols"
        :row-actions="rowActions"
        :left-action-bar-properties="leftActionBarProperties"
        details-component-path="book/BookListRowDetails.vue"
        @custom-action-triggered="customActionTriggered"
        @list-action-set="setBook"
      />
    </div>
  </client-only>
</template>

<script>
import { container } from 'tsyringe'
import Column from 'assets/ts/list/Column'
import DataSubProperty from 'assets/ts/list/DataSubProperty'
import RowAction from 'assets/ts/list/RowAction'
import LeftActionBarElement from 'assets/ts/list/LeftActionBarElement'
import LeftActionBarProperties from 'assets/ts/list/LeftActionBarProperties'
import LeftActionBarFormSelectDescriptor from 'assets/ts/list/LeftActionBarFormSelectDescriptor'
import ButtonDescriptor from 'assets/ts/form/ButtonDescriptor'
import RequestService from 'assets/ts/service/RequestService'
import BookService from 'assets/ts/service/BookService'
import bookElectronicModule from 'assets/ts/store/book/BookElectronicModule'
import BookStoreService from 'assets/ts/service/BookStoreService'
import LeftActionBarSeparatorDescriptor from 'assets/ts/list/LeftActionBarSeparatorDescriptor'
import List from '~/components/list/List'

const requestService = container.resolve(RequestService)
const config = require('../../mediatheque.json')

export default {
  name: 'Book',
  components: {
    List
  },
  data () {
    return {
      isPopupDisplayed: false,
      bookPopupElementId: null,
      bookPopupElementType: 'PaperBook',
      bookHasBeenModified: false,
      cols: [
        new Column('title', 'Titre'),
        new Column('year', 'Année'),
        new Column('language', 'Langue'),
        new Column('authors', 'Auteurs')
          .setSearchParameterName('authorFullname')
          .setSubProperties([
            new DataSubProperty('firstname'),
            new DataSubProperty('lastname')
          ])
      ],
      rowActions: [
        new RowAction('download', '', 'fas fa-file-download')
          .setIsDisplayed((book) => {
            return typeof book['@type'] === 'string' && book['@type'] === BookService.bookElectronic
          }),
        new RowAction('delete', '', 'far fa-trash-alt')
          .setNeedConfirm(true, 'Re-cliquez pour confirmer la suppression')
      ],
      leftActionBarProperties: new LeftActionBarProperties([
        new LeftActionBarElement(
          'separator',
          () => null,
          new LeftActionBarSeparatorDescriptor('add').setLabel('Ajouter').setFaIcon('fas fa-plus')
        ),
        new LeftActionBarElement(
          'element',
          () => {
            this.$router.push({
              path: '/book/paper'
            })
            return null
          },
          new ButtonDescriptor('addPaper', 'Livre papier').setFaIcon('fas fa-scroll').setNoDefaultStyle(true)
        ),
        new LeftActionBarElement(
          'element',
          () => {
            this.$router.push({
              path: '/book/electronic'
            })
            return null
          },
          new ButtonDescriptor('addElectronic', 'Epub').setFaIcon('fas fa-tablet-alt').setNoDefaultStyle(true)
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
    }
  },
  mounted () {
    const urlParts = document.URL.split('#')
    const bookId = (urlParts.length > 1) ? urlParts[1] : null

    if (bookId !== null) {
      const request = requestService.createRequest('/books/' + bookId)
      requestService.execute(request)
        .then(book => this.setBook(book))
        .catch((error) => {
          this.$toasted.show("L'identifiant " + bookId + ' ne correspond à aucun livre', {
            ...config.default.notification_settings,
            type: 'error',
            icon: 'fa-times'
          })
          console.error(error)
        })
    }
  },
  methods: {
    setBook (selectedBook) {
      const type = selectedBook['@type']
      if (type !== 'ElectronicBook' && type !== 'PaperBook') {
        throw new Error('Invalid book type')
      }

      const matchingType = {
        ElectronicBook: 'electronic/',
        PaperBook: 'paper/'
      }

      this.$router.push({
        path: '/book/' + matchingType[type] + selectedBook.id
      })
    },
    customActionTriggered (action, book) {
      switch (action) {
        case 'download':
          bookElectronicModule.get(book.id).then(() => {
            bookElectronicModule.downloadEbook()
          })
          break
        case 'delete': {
          const bookStore = (new BookStoreService()).getStore(book)
          bookStore.setBook(book)
          bookStore.deleteBook().then(() => {
            this.$refs.list.load()
          })
            .catch((error) => {
              this.$toasted.show(error, {
                ...config.default.notification_settings,
                type: 'error',
                icon: 'fa-times'
              })
            })

          break
        }
      }
    },
    bookSaved () {
      this.bookHasBeenModified = true
    },
    closePopup () {
      if (this.bookHasBeenModified === true) {
        this.$refs.list.load()
      }
      this.isPopupDisplayed = false
    }
  }
}
</script>

<style lang="scss">

</style>
