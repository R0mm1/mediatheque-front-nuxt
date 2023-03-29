import { Module, VuexModule, getModule, Mutation } from 'vuex-module-decorators'
import store from '~/assets/ts/store/store'
import { BookPaperItem } from '~/assets/ts/models/BookPaper'
import { BookElectronicItem } from '~/assets/ts/models/BookElectronic'
import { BookAudioItem } from '~/assets/ts/models/BookAudio'

@Module({
  dynamic: true,
  name: 'bookList',
  store,
  namespaced: true
})
class BookListModule extends VuexModule {
  bookToDelete: BookPaperItem | BookElectronicItem | BookAudioItem | null = null

  bookToDownload: BookElectronicItem | BookAudioItem | null = null

  @Mutation
  setBookToDelete (bookItem: BookPaperItem | BookElectronicItem | BookAudioItem | null) {
    this.bookToDelete = bookItem
  }

  @Mutation
  setBookToDownload (bookItem: BookElectronicItem | BookAudioItem | null) {
    this.bookToDownload = bookItem
  }
}

export default getModule(BookListModule)
