<template>
  <EntityLayout
    v-model="activeTab"
    :tabs="tabs"
    :footer-opened="switchEditModeOn && isModified"
    @edit-button-pressed="toggleEditMode"
  >
    <template #entity-layout-title>
      {{ title }}
    </template>
    <template #entity-layout-title-note>
      <HeaderAuthorsList :authors="authors" />
    </template>
    <template #entity-layout-content>
      <component
        :is="mainTabComponent"
        v-if="activeTab === 'details'"
        :book-module="bookModule"
        :edit-mode-on="switchEditModeOn"
      />
      <div v-if="activeTab === 'social'">
        <component :is="socialTabComponent" :book-module="bookModule" />
      </div>
    </template>
    <template #entity-layout-footer>
      <MedInputButton
        v-if="isModified"
        :button-descriptor="saveBookButtonDescriptor"
        @click.native="save"
      />
    </template>
  </EntityLayout>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import EntityLayout from '~/components/page/EntityLayout.vue'
import { TabData } from '~/components/widgets/Tabs.vue'
import { BookElectronicModule } from '~/assets/ts/store/book/BookElectronicModule'
import GroupInformation from '~/components/book/groups/mainTab/GroupInformation.vue'
import MainTab from '~/components/book/electronicBook/MainTab.vue'
import ButtonDescriptor from '~/assets/ts/form/ButtonDescriptor'
import MedInputButton from '~/components/form/elements/MedInputButton.vue'
import HeaderAuthorsList from '~/components/book/elements/HeaderAuthorsList.vue'
import SocialTab from '~/components/book/electronicBook/SocialTab.vue'
import { BookPaperModule } from '~/assets/ts/store/book/BookPaperModule'
import { BookAudioModule } from '~/assets/ts/store/book/BookAudioModule'
import bookGroupMembershipModule from '~/assets/ts/store/book/BookGroupMembershipModule'
import EventService from '~/assets/ts/service/EventService'

@Component({
  components: {
    MedInputButton,
    MainTab,
    GroupInformation,
    EntityLayout,
    HeaderAuthorsList,
    SocialTab
  }
})
export default class BookBook extends Vue {
  @Prop({
    type: Number,
    required: false
  }) bookId!: number | null

  @Prop({
    type: Boolean,
    required: false,
    default: false
  }) editModeOn!: boolean

  @Prop() bookModule!: BookElectronicModule | BookPaperModule | BookAudioModule

  @Prop({
    type: String
  }) bookPageUrl!: string

  @Prop({
    type: String
  }) mainTabComponentPath!: string

  @Prop({
    type: String
  }) socialTabComponentPath!: string

  mainTabComponent: any
  socialTabComponent: any

  switchEditModeOn: boolean = false
  loaded: boolean = false
  activeTab: string = 'details'
  eventService: EventService = EventService.getService()

  readonly tabs: TabData[] = [
    {
      id: 'details',
      label: 'Le livre'
    },
    {
      id: 'social',
      label: 'Social',
      disable: true
    }
  ]

  get title () {
    return this.bookModule.book?.title
  }

  get authors () {
    const authors = this.bookModule.book.authors

    return typeof authors === 'undefined' ? [] : authors
  }

  get isModified () {
    return this.bookModule.flagService.flags.isModified ||
      bookGroupMembershipModule.flagService.flags.isModified
  }

  get saveBookButtonDescriptor () {
    const buttonDescriptor = new ButtonDescriptor('save').setValue('Enregistrer')
    buttonDescriptor.type = ButtonDescriptor.typeSubmit
    return buttonDescriptor
  }

  reloadBook () {
    this.loaded = false
    this.bookModule.init()

    if (this.bookId !== null) {
      this.bookModule.get(this.bookId).then(() => {
        this.loaded = true
      })
    }
  }

  save () {
    const isNew = typeof this.bookModule.book.id === 'undefined'
    this.bookModule.save(false)
      .then(() => {
        // Some parts of the page like the reference groups have their own saving logic,
        // waiting for the book to be saved to do their job
        return Promise.all(
          this.eventService.trigger(BookPaperModule.EVENT_BOOK_SAVED).map(
            value => Promise.resolve(value)
          )
        )
      })
      .then(() => {
        this.$toasted.show('Le livre a été sauvegardé', {
          ...this.$config.default.notification_settings,
          type: 'success',
          icon: 'fa-check'
        })

        if (isNew) {
          this.$router.push({
            path: this.bookPageUrl + '/' + this.bookModule.book.id
          })
        }

        this.toggleEditMode()
      })
      .catch((error) => {
        this.$toasted.error(
          'isDisplayable' in error && error.isDisplayable
            ? error.message
            : 'Une erreur s\'est produite et le livre n\'a pas pu être sauvegardé',
          {
            ...this.$config.default.notification_settings,
            icon: 'fa-times'
          }
        )
      })
  }

  toggleEditMode () {
    this.switchEditModeOn = !this.switchEditModeOn
  }

  created () {
    this.mainTabComponent = () => import('~/components/' + this.mainTabComponentPath)
    this.socialTabComponent = () => import('~/components/' + this.socialTabComponentPath)

    this.switchEditModeOn = this.editModeOn
    if (typeof this.$route.query.init === 'undefined' || this.$route.query.init !== 'false') {
      this.reloadBook()
    }
  }
}
</script>
