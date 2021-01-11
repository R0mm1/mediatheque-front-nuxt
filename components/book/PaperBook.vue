<template>
  <EntityLayout v-model="activeTab" :tabs="tabs">
    <template v-slot:entity-layout-title>
      {{ title }}
    </template>
    <template v-slot:entity-layout-title-note>
      <HeaderAuthorsList :authors="authors" />
    </template>
    <template v-slot:entity-layout-content>
      <MainTab v-if="activeTab === 'details'" :book-module="bookModule" />
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
import bookElectronicModule from '~/assets/ts/store/book/BookElectronicModule'

@Component({
  components: { MedInputButton, MainTab, GroupInformation, EntityLayout }
})
export default class PaperBook extends Vue {
  @Prop({ type: Number, required: false }) bookId!: number|null;
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
    bookPaperModule.init()

    if (this.bookId !== null) {
      bookPaperModule.get(this.bookId).then(() => {
        this.loaded = true
      })
    }
  }

  save () {
    bookPaperModule.save(false)
      .then(() => {
        this.$toasted.show('Le livre a été sauvegardé', {
          ...config.default.notification_settings,
          type: 'success',
          icon: 'fa-check'
        })
        this.$emit('book-saved')
      })
      .catch((error) => {
        console.error(error)
        this.$toasted.error("Une erreur s'est produite et le livre n'a pas pu être sauvegardé")
      })
  }

  created () {
    this.reloadBook()
  }
}
</script>

<style scoped>
</style>
