<template>
  <client-only>
    <Group custom-class="information">
      <template #group_name>
        Informations
      </template>
      <template #group_content>
        <MedInputText v-model="title" :text-descriptor="formInputTextDescriptors.title" />

        <MedChips :chips-descriptor="formChipsAuthorsDescriptor" @entity-removed="authorRemoved" @entity-added="authorAdded" />

        <MedInputText v-model="language" :text-descriptor="formInputTextDescriptors.language" />
        <MedInputText v-model="year" :text-descriptor="formInputTextDescriptors.year" />
        <MedInputText v-model="pageCount" :text-descriptor="formInputTextDescriptors.pageCount" />
        <MedInputText v-model="isbn" :text-descriptor="formInputTextDescriptors.isbn" />

        <slot name="specific-fields" />
      </template>
    </Group>
  </client-only>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import MedInputText from '~/components/form/elements/MedInputText.vue'
import TextDescriptor from '~/assets/ts/form/TextDescriptor'
import Group from '~/components/page/Group.vue'
import authorModule from '~/assets/ts/store/AuthorModule'
import { BookPaperModule } from '~/assets/ts/store/book/BookPaperModule'
import { AuthorEntity } from '~/assets/ts/entity/AuthorEntity'
import MedInputSelect from '~/components/form/elements/MedInputSelect.vue'
import MedChips from '~/components/form/elements/MedChips.vue'
import ChipsDescriptor from '~/assets/ts/form/ChipsDescriptor'
import { BookElectronicModule } from '~/assets/ts/store/book/BookElectronicModule'

@Component({
  components: { MedChips, MedInputSelect, MedInputText, Group }
})
export default class GroupInformation extends Vue {
  @Prop({ type: Object, required: true }) bookModule!: BookPaperModule | BookElectronicModule
  @Prop({ type: Boolean, required: true }) editModeOn!:boolean

  newAuthor = {
    firstname: undefined,
    lastname: undefined
  }

  formInputTextDescriptors = {
    title: new TextDescriptor('title').setLabel('Titre').setEditModeOn(this.editModeOn),
    language: new TextDescriptor('language').setLabel('Langue').setEditModeOn(this.editModeOn),
    year: new TextDescriptor('year').setLabel('Année').setEditModeOn(this.editModeOn),
    pageCount: new TextDescriptor('pageCount').setLabel('Nombre de pages').setEditModeOn(this.editModeOn),
    isbn: new TextDescriptor('isbn').setLabel('ISBN').setEditModeOn(this.editModeOn),
    newAuthor: {
      firstname: new TextDescriptor('firstname').setLabel('Prénom'),
      lastname: new TextDescriptor('lastname').setLabel('Nom')
    }
  }

  get title () {
    return this.bookModule.book.title
  };

  set title (title: string | undefined) {
    this.bookModule.setTitle(title ?? '')
  }

  get language () {
    return this.bookModule.book.language
  };

  set language (language: string | undefined) {
    this.bookModule.setLanguage(language ?? '')
  }

  get year () {
    return this.bookModule.book.year
  };

  set year (year: string | undefined) {
    this.bookModule.setYear(year ?? '')
  }

  get pageCount () {
    return this.bookModule.book.pageCount ? this.bookModule.book.pageCount.toString() : ''
  };

  set pageCount (pageCount: string | undefined) {
    this.bookModule.setPageCount(pageCount ?? '')
  }

  get isbn () {
    return this.bookModule.book.isbn
  };

  set isbn (isbn: string | undefined) {
    this.bookModule.setIsbn(isbn ?? '')
  }

  get authors () {
    return this.bookModule.book.authors
  }

  get formChipsAuthorsDescriptor () {
    const chipsDescriptor = new ChipsDescriptor()
    chipsDescriptor.name = 'authors'
    chipsDescriptor.label = 'Auteurs'
    chipsDescriptor.entities = this.authors
    chipsDescriptor.entityFields = ['firstname', 'lastname']
    chipsDescriptor.entityURI = '/authors'
    chipsDescriptor.searchParam = 'fullname'
    chipsDescriptor.searchFieldPlaceholder = 'Rechercher un auteur'
    chipsDescriptor.formCreationValidationAction = this.createAuthorFromForm
    chipsDescriptor.formCreationTitle = 'Nouvel auteur'
    chipsDescriptor.formCreationSchema = [
      {
        type: 'text',
        label: 'Prénom',
        name: 'firstname'
      },
      {
        type: 'text',
        label: 'Nom',
        name: 'lastname'
      }
    ]
    chipsDescriptor.editModeOn = this.editModeOn
    return chipsDescriptor
  }

  authorRemoved (author: AuthorEntity) {
    this.bookModule.removeAuthor(author)
  };

  authorAdded (author: AuthorEntity) {
    this.bookModule.addAuthor(author)
  };

  createAuthorFromForm (formCreationData: any) {
    authorModule.new()
    authorModule.setFirstname(formCreationData.firstname ?? '')
    authorModule.setLastname(formCreationData.lastname ?? '')
    return authorModule.save().then((author) => {
      if (typeof author !== 'boolean') {
        this.authorAdded(author)
      }
    })
  };

  @Watch('editModeOn') editModeOnChanged () {
    this.formInputTextDescriptors.title.setEditModeOn(this.editModeOn)
    this.formInputTextDescriptors.language.setEditModeOn(this.editModeOn)
    this.formInputTextDescriptors.year.setEditModeOn(this.editModeOn)
    this.formInputTextDescriptors.pageCount.setEditModeOn(this.editModeOn)
    this.formInputTextDescriptors.isbn.setEditModeOn(this.editModeOn)
  }
}
</script>

<style lang="scss">
</style>
