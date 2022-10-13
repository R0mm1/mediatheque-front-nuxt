<template>
  <EntityLayout v-model="activeTab" :tabs="tabs" :footer-opened="switchEditModeOn && isModified" @edit-button-pressed="toggleEditMode">
    <template #entity-layout-title>
      {{ title }}
    </template>
    <template #entity-layout-title-note>
      <HeaderAuthorsList :authors="authors" />
    </template>
    <template #entity-layout-content>
      <MainTab v-if="activeTab === 'details'" :book-module="bookModule" :edit-mode-on="switchEditModeOn" />
      <div v-if="activeTab === 'social'">
        <SocialTab :book-module="bookModule" />
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
import MedInputButton from '~/components/form/elements/MedInputButton.vue'
import bookAudioModule from '~/assets/ts/store/book/BookAudioModule'
import { TabData } from '~/components/widgets/Tabs.vue'
import HeaderAuthorsList from '~/components/book/elements/HeaderAuthorsList.vue'
import ButtonDescriptor from '~/assets/ts/form/ButtonDescriptor'
import MainTab from '~/components/book/audioBook/MainTab.vue'
import SocialTab from '~/components/book/audioBook/SocialTab.vue'

@Component({
  components: {
    EntityLayout,
    MedInputButton,
    HeaderAuthorsList,
    MainTab,
    SocialTab
  }
})
export default class AudioBook extends Vue {
  @Prop({
    type: Number,
    required: false
  }) bookId!: number | null

  @Prop({
    type: Boolean,
    required: false,
    default: false
  }) editModeOn!: boolean

  switchEditModeOn: boolean = false
  activeTab: string = 'details'
  bookModule = bookAudioModule

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
    return this.bookModule.flagService.flags.isModified
  }

  get saveBookButtonDescriptor () {
    const buttonDescriptor = new ButtonDescriptor('save').setValue('Enregistrer')
    buttonDescriptor.type = ButtonDescriptor.typeSubmit
    return buttonDescriptor
  }

  save () {
    const isNew = typeof this.bookModule.book.id === 'undefined'
    this.bookModule.save()
      .then(() => {
        this.$toasted.show('Le livre a été sauvegardé', {
          ...this.$config.default.notification_settings,
          type: 'success',
          icon: 'fa-check'
        })
        this.$emit('book-saved')

        if (isNew) {
          this.$router.push({
            path: '/book/audio/' + this.bookModule.book.id
          })
        }

        this.toggleEditMode()
      })
      .catch((error) => {
        this.$toasted.error(
          'isDisplayable' in error && error.isDisplayable
            ? error.message
            : "Une erreur s'est produite et le livre n'a pas pu être sauvegardé",
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

  reloadBook () {
    this.bookModule.init()

    if (this.bookId !== null) {
      this.bookModule.get(this.bookId)
    }
  }

  created () {
    this.switchEditModeOn = this.editModeOn
    this.reloadBook()
  }
}
</script>

<style scoped>

</style>
