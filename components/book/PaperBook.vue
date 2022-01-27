<template>
  <EntityLayout v-model="activeTab" :tabs="tabs" @edit-button-pressed="toggleEditMode">
    <template v-slot:entity-layout-title>
      {{ title }}
    </template>
    <template v-slot:entity-layout-title-note>
      <HeaderAuthorsList :authors="authors" />
    </template>
    <template v-slot:entity-layout-content>
      <MainTab v-if="activeTab === 'details'" :book-module="bookModule" :edit-mode-on="switchEditModeOn" />
      <div v-if="activeTab === 'social'">
        <SocialTab :book-module="bookModule" />
      </div>
    </template>
    <template v-slot:entity-layout-footer>
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
import config from '@/mediatheque.json'
import { TabData } from '~/components/widgets/Tabs.vue'

import bookPaperModule from '~/assets/ts/store/book/BookPaperModule'
import GroupInformation from '~/components/book/groups/mainTab/GroupInformation.vue'
import MainTab from '~/components/book/paperBook/MainTab.vue'
import ButtonDescriptor from '~/assets/ts/form/ButtonDescriptor'
import MedInputButton from '~/components/form/elements/MedInputButton.vue'
import EntityLayout from '~/components/page/EntityLayout.vue'
import HeaderAuthorsList from '~/components/book/elements/HeaderAuthorsList.vue'
import SocialTab from '~/components/book/paperBook/SocialTab.vue'

@Component({
  components: { MedInputButton, MainTab, GroupInformation, EntityLayout, HeaderAuthorsList, SocialTab }
})
export default class PaperBook extends Vue {
  @Prop({ type: Number, required: false }) bookId!: number|null;
  @Prop({ type: Boolean, required: false, default: false }) editModeOn!:boolean;

  switchEditModeOn: boolean = false;
  loaded: boolean = false;
  activeTab: string = 'details';
  bookModule = bookPaperModule;

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
  ];

  get title () {
    return bookPaperModule.book?.title
  }

  get authors () {
    const authors = bookPaperModule.book.authors

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
    bookPaperModule.init()

    if (this.bookId !== null) {
      bookPaperModule.get(this.bookId).then(() => {
        this.loaded = true
      })
    }
  }

  save () {
    const isNew = typeof bookPaperModule.book.id === 'undefined'
    bookPaperModule.save(false)
      .then(() => {
        this.$toasted.show('Le livre a été sauvegardé', {
          ...config.default.notification_settings,
          type: 'success',
          icon: 'fa-check'
        })
        this.$emit('book-saved')

        if (isNew) {
          this.$router.push({
            path: '/book/paper/' + bookPaperModule.book.id
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
</style>
