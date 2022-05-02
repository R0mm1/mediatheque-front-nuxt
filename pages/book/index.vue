<template>
  <div>
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
  </div>
</template>

<script>
import { Component, Vue } from 'vue-property-decorator'
import Column from 'assets/ts/list/Column'
import DataSubProperty from 'assets/ts/list/DataSubProperty'
import RowAction from 'assets/ts/list/RowAction'
import LeftActionBarElement from 'assets/ts/list/LeftActionBarElement'
import LeftActionBarProperties from 'assets/ts/list/LeftActionBarProperties'
import LeftActionBarFormSelectDescriptor from 'assets/ts/list/LeftActionBarFormSelectDescriptor'
import BookService from 'assets/ts/service/BookService'
import bookElectronicModule from 'assets/ts/store/book/BookElectronicModule'
import BookStoreService from 'assets/ts/service/BookStoreService'
import LeftActionBarSeparatorDescriptor from 'assets/ts/list/LeftActionBarSeparatorDescriptor'
import List from '~/components/list/List'
import LeftActionBarLinkDescriptor from 'assets/ts/list/LeftActionBarLinkDescriptor'

@Component({
  components: { List }
})
export default class Book extends Vue {
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
      .setIsDisplayed((book) => {
        return typeof book['@type'] === 'string' && book['@type'] === BookService.bookElectronic
      }),
    new RowAction('delete', '', 'far fa-trash-alt')
      .setNeedConfirm(true, 'Re-cliquez pour confirmer la suppression')
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

  setBook (selectedBook) {
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
              ...this.$config.default.notification_settings,
              type: 'error',
              icon: 'fa-times'
            })
          })

        break
      }
    }
  }
}
</script>

<style lang="scss">

</style>
