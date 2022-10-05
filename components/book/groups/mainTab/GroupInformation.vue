<template>
  <client-only>
    <Group custom-class="information">
      <template #group_name>
        Informations
      </template>
      <template #group_content>
        <MedInputText v-model="title" :text-descriptor="titleTextDescriptor"/>

        <MedChips
          :chips-descriptor="formChipsAuthorsDescriptor"
          @entity-removed="authorRemoved"
          @entity-added="authorAdded"
        />

        <MedInputText v-model="language" :text-descriptor="formInputTextDescriptors.language"/>
        <MedInputText v-model="year" :text-descriptor="formInputTextDescriptors.year"/>
        <MedInputText v-model="pageCount" :text-descriptor="formInputTextDescriptors.pageCount"/>
        <MedInputText v-model="isbn" :text-descriptor="formInputTextDescriptors.isbn"/>
        <MedSelect v-model="editor" :med-select-descriptor="medSelectEditorDescriptor"/>

        <slot name="specific-fields"/>
      </template>
    </Group>
  </client-only>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator'
import { container } from 'tsyringe'
import MedInputText from '~/components/form/elements/MedInputText.vue'
import TextDescriptor from '~/assets/ts/form/TextDescriptor'
import Group from '~/components/page/Group.vue'
import authorModule from '~/assets/ts/store/AuthorModule'
import editorModule from '~/assets/ts/store/EditorModule'
import { BookPaperModule } from '~/assets/ts/store/book/BookPaperModule'
import MedInputSelect from '~/components/form/elements/MedInputSelect.vue'
import MedChips from '~/components/form/elements/MedChips.vue'
import ChipsDescriptor from '~/assets/ts/form/ChipsDescriptor'
import { BookElectronicModule } from '~/assets/ts/store/book/BookElectronicModule'
import MedSelectDescriptor, { SelectValue } from '~/assets/ts/form/MedSelectDescriptor'
import MedSelect from '~/components/form/elements/MedSelect.vue'
import EditorService from '~/assets/ts/service/EditorService'
import { Editor, EditorItem } from '~/assets/ts/models/Editor'
import Person from '~/assets/ts/models/Person'
import AuthorService from '~/assets/ts/service/AuthorService'
import { Author } from '~/assets/ts/models/Author'

const editorService = container.resolve(EditorService)
const authorService = container.resolve(AuthorService)

@Component({
  components: {
    MedChips,
    MedInputSelect,
    MedSelect,
    MedInputText,
    Group
  }
})
export default class GroupInformation extends Vue {
  @Prop({
    type: Object,
    required: true
  }) bookModule!: BookPaperModule | BookElectronicModule

  @Prop({
    type: Boolean,
    required: true
  }) editModeOn!: boolean

  formInputTextDescriptors = {
    language: new TextDescriptor('language').setLabel('Langue').setEditModeOn(this.editModeOn),
    year: new TextDescriptor('year').setLabel('Année').setEditModeOn(this.editModeOn),
    pageCount: new TextDescriptor('pageCount').setLabel('Nombre de pages').setEditModeOn(this.editModeOn),
    isbn: new TextDescriptor('isbn').setLabel('ISBN').setEditModeOn(this.editModeOn),
    newAuthor: {
      firstname: new TextDescriptor('firstname').setLabel('Prénom'),
      lastname: new TextDescriptor('lastname').setLabel('Nom')
    }
  }

  private editors?: SelectValue[]

  get titleTextDescriptor () {
    return new TextDescriptor('title')
      .setLabel('Titre')
      .setEditModeOn(this.editModeOn)
      .setError(this.bookModule.violations.title?.message ?? null)
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

  get editor () {
    const editor = this.bookModule.book?.editor
    if (typeof editor !== 'undefined' && editor !== null) {
      return {
        key: editor['@id'] ?? 'nonexisting-editor',
        label: editor.name ?? 'Editeur sans nom',
        value: editor
      }
    }
    return null
  }

  set editor (selectValue: SelectValue | null) {
    this.bookModule.setEditor(selectValue?.value ?? undefined)
  }

  get formChipsAuthorsDescriptor () {
    const chipsDescriptor = new ChipsDescriptor()
    chipsDescriptor.name = 'authors'
    chipsDescriptor.label = 'Auteurs'
    chipsDescriptor.entities = this.authors.map(author => author.person)
    chipsDescriptor.entityFields = ['firstname', 'lastname']
    chipsDescriptor.entityURI = '/people'
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

  get medSelectEditorDescriptor () {
    const medSelectEditorDescriptor = new MedSelectDescriptor('editor')
    medSelectEditorDescriptor.label = 'Editeur'

    if (this.editModeOn && typeof this.editors === 'undefined') {
      medSelectEditorDescriptor.options = editorService.getEditors()
        .then((editors) => {
          this.editors = editors['hydra:member']
            .map((editor) => {
              return {
                key: editor['@id'],
                label: editor.name as string,
                value: editor
              }
            })
            .sort((editor1, editor2) => {
              const label1 = editor1.label.toLowerCase()
              const label2 = editor2.label.toLowerCase()
              if (label1 < label2) {
                return -1
              }
              if (label1 > label2) {
                return 1
              }
              return 0
            })

          return Promise.resolve(this.editors)
        })
    } else {
      medSelectEditorDescriptor.options = typeof this.editors === 'undefined' ? [] : this.editors
    }

    medSelectEditorDescriptor.editModeOn = this.editModeOn
    medSelectEditorDescriptor.formCreationValidationAction = this.createEditorFromForm
    medSelectEditorDescriptor.formCreationTitle = 'Nouvel éditeur'
    medSelectEditorDescriptor.formCreationSchema = [
      {
        type: 'text',
        label: 'Nom',
        name: 'name'
      }
    ]

    return medSelectEditorDescriptor
  }

  authorRemoved (author: Author | Person) {
    if (authorService.isAuthor(author)) {
      this.bookModule.removeAuthor(author)
    } else {
      authorService.getAuthorFromPerson(author).then(author => this.bookModule.removeAuthor(author))
    }
  };

  authorAdded (author: Author | Person) {
    if (authorService.isAuthor(author)) {
      this.bookModule.addAuthor(author)
    } else {
      authorService.getAuthorFromPerson(author).then(author => this.bookModule.addAuthor(author))
    }
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

  createEditorFromForm (formCreationData: Editor): Promise<SelectValue> {
    editorModule.set(formCreationData)
    return editorModule.save()
      .then((editor: EditorItem | boolean) => {
        if (typeof editor !== 'boolean') {
          return Promise.resolve({
            key: editor['@id'] as string,
            label: editor.name as string,
            value: editor
          })
        }
        return Promise.reject(new Error('Expected new editor, false returned'))
      })
  }

  @Watch('editModeOn') editModeOnChanged () {
    this.formInputTextDescriptors.language.setEditModeOn(this.editModeOn)
    this.formInputTextDescriptors.year.setEditModeOn(this.editModeOn)
    this.formInputTextDescriptors.pageCount.setEditModeOn(this.editModeOn)
    this.formInputTextDescriptors.isbn.setEditModeOn(this.editModeOn)
  }
}
</script>

<style lang="scss">
</style>
