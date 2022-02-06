<template>
  <EntityLayout v-model="activeTab" :tabs="tabs" @edit-button-pressed="toggleEditMode">
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
import { TabData } from '~/components/widgets/Tabs.vue'

import bookElectronicModule from '~/assets/ts/store/book/BookElectronicModule'
import GroupInformation from '~/components/book/groups/mainTab/GroupInformation.vue'
import MainTab from '~/components/book/electronicBook/MainTab.vue'
import ButtonDescriptor from '~/assets/ts/form/ButtonDescriptor'
import MedInputButton from '~/components/form/elements/MedInputButton.vue'
import HeaderAuthorsList from '~/components/book/elements/HeaderAuthorsList.vue'
import SocialTab from '~/components/book/electronicBook/SocialTab.vue'

@Component({
  components: { MedInputButton, MainTab, GroupInformation, EntityLayout, HeaderAuthorsList, SocialTab }
})
export default class ElectronicBook extends Vue {
  @Prop({ type: Number, required: false }) bookId!: number | null
  @Prop({ type: Boolean, required: false, default: false }) editModeOn!:boolean

  switchEditModeOn: boolean = false
  loaded: boolean = false
  activeTab: string = 'details'
  bookModule = bookElectronicModule

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
    return bookElectronicModule.book?.title
  }

  get authors () {
    const authors = bookElectronicModule.book.authors

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

  reloadBook () {
    this.loaded = false
    bookElectronicModule.init()

    if (this.bookId !== null) {
      bookElectronicModule.get(this.bookId).then(() => {
        this.loaded = true
      })
    }
  }

  save () {
    const isNew = typeof bookElectronicModule.book.id === 'undefined'
    bookElectronicModule.save(false)
      .then(() => {
        this.$toasted.show('Le livre a été sauvegardé', {
          ...this.$config.default.notification_settings,
          type: 'success',
          icon: 'fa-check'
        })
        this.$emit('book-saved')

        if (isNew) {
          this.$router.push({
            path: '/book/electronic/' + bookElectronicModule.book.id
          })
        }
      })
      .catch((error) => {
        console.error(error)
        this.$toasted.error("Une erreur s'est produite et le livre n'a pas pu être sauvegardé")
      })
  }

  toggleEditMode () {
    this.switchEditModeOn = !this.switchEditModeOn
  }

  created () {
    this.switchEditModeOn = this.editModeOn
    this.reloadBook()
  }
}
</script>

<style scoped>
.book-author{

}
</style>
