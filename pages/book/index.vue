<template>
  <client-only>
    <div>
      <List
        ref="list"
        api-endpoint="/books"
        :cols="cols"
        :row-actions="rowActions"
        :left-action-bar-properties="leftActionBarProperties"
        :custom-filters="cCustomFilters"
        @custom-action-triggered="customActionTriggered"
        @list-action-set="setBook"
      />
    </div>
  </client-only>
</template>

<script>
import Vue from 'vue'

import { container } from 'tsyringe'
import Column from 'assets/ts/list/Column'
import DataSubProperty from 'assets/ts/list/DataSubProperty'
import RowAction from 'assets/ts/list/RowAction'

import store from 'assets/js/store'

import BookModule from 'assets/js/store/book'
import LeftActionBarElement from 'assets/ts/list/LeftActionBarElement'
import LeftActionBarProperties from 'assets/ts/list/LeftActionBarProperties'
import LeftActionBarSeparator from 'assets/ts/list/LeftActionBarSeparator'
import LeftActionBarFormSelectDescriptor from 'assets/ts/list/LeftActionBarFormSelectDescriptor'
import Filter from 'assets/ts/list/Filter'
import ButtonDescriptor from 'assets/ts/form/ButtonDescriptor'
import RequestService from 'assets/ts/service/RequestService'
import BookService from 'assets/ts/service/BookService'
import bookElectronicModule from 'assets/ts/store/book/BookElectronicModule'
import BookStoreService from 'assets/ts/service/BookStoreService'
import List from '~/components/list/List'

const requestService = container.resolve(RequestService)
const config = require('../../mediatheque.json')

if (!store.state.book) {
  store.registerModule('book', BookModule)
}

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
        new LeftActionBarSeparator('Ajouter', 'fas fa-plus'),
        new LeftActionBarElement(
          () => {
            this.$router.push({
              path: '/book/paper'
            })
          },
          new ButtonDescriptor('addPaper', 'Livre papier').setFaIcon('fas fa-scroll').setNoDefaultStyle(true)
        ),
        new LeftActionBarElement(
          () => {
            this.$router.push({
              path: '/book/electronic'
            })
          },
          new ButtonDescriptor('addElectronic', 'Epub').setFaIcon('fas fa-tablet-alt').setNoDefaultStyle(true)
        ),
        new LeftActionBarSeparator('Filtres', 'fas fa-sliders-h'),
        new LeftActionBarElement(
          (bookType) => {
            const customFilter = new Filter('bookType', bookType)
            Vue.set(this.customFilters, customFilter.property, customFilter)
          },
          new LeftActionBarFormSelectDescriptor('bookType', {
            all: 'Tous',
            paper: 'Papier',
            electronic: 'Epub'
          }).setDefaultValue('all').setFaIcon('fas fa-book').setNoDefaultStyle(true)
        )
      ], false),
      customFilters: {}
    }
  },
  computed: {
    cCustomFilters () {
      return Object.values(this.customFilters)
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
  },
  store
}
</script>

<style lang="scss">

</style>
