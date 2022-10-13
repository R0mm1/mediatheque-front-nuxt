<template>
  <Group custom-class="references">
    <template #group_name>
      Groupes
    </template>

    <template v-if="editModeOn" #group_customActions>
      <MedInputButton :button-descriptor="displayFormDataButtonDescriptor" @click.native="toggleDisplayFormData" />
    </template>

    <template #group_content>
      <Accordion :blocs="blocs">
        <SimpleList
          v-for="bloc in blocs"
          :slot="bloc.slotId"
          :key="bloc.slotId"
          :elements="blocsRows[bloc.slotId]"
          :actions="rowActions"
        />
      </Accordion>

      <div v-if="groupFormDisplayed" class="group_manage">
        <FormContainer :validate-action="validateGroupLinking">
          <template #form_title>
            Ajouter à un groupe existant
          </template>
          <template #form_body>
            <MedInputSelect
              v-model="addToExistingGroup"
              :select-descriptor="existingGroupsSelectDescriptor"
            />
          </template>
          <template #action_cancel>
            <span />
          </template>
        </FormContainer>

        <FormContainer
          validate-label="Enregistrer"
          :validate-action="validateGroupCreation"
          :cancel-action="toggleDisplayFormData"
        >
          <template #form_title>
            Créer un nouveau groupe
          </template>
          <template #form_body>
            <MedInputText v-model="newGroupComment" :text-descriptor="commentInputTextDescriptor" />
          </template>
        </FormContainer>
      </div>
    </template>
  </Group>
</template>

<script>
import { container } from 'tsyringe'
import Group from '@/components/page/Group'
import Accordion, { AccordionBloc } from '@/components/widgets/Accordion'
import SimpleList, { Element, Action } from '@/components/widgets/SimpleList'

import FormContainer from '@/components/form/FormContainer'

import groupModule from '@/assets/ts/store/GroupModule'

import EventService from '@/assets/ts/service/EventService'
import { BookModule } from '@/assets/ts/store/book/BookModule'
import ButtonDescriptor from '@/assets/ts/form/ButtonDescriptor'
import MedInputButton from '@/components/form/elements/MedInputButton'
import TextDescriptor from 'assets/ts/form/TextDescriptor'
import MedInputText from '@/components/form/elements/MedInputText'
import SelectDescriptor from 'assets/ts/form/SelectDescriptor'
import MedInputSelect from '@/components/form/elements/MedInputSelect'
import BookService from '~/assets/ts/service/BookService'

const eventService = EventService.getService()
const bookService = container.resolve(BookService)

export default {
  name: 'GroupReferences',
  components: { MedInputSelect, MedInputText, MedInputButton, FormContainer, SimpleList, Accordion, Group },
  props: {
    bookModule: { type: Object, required: true },
    editModeOn: { type: Boolean, required: true }
  },
  data () {
    return {
      blocs: [],
      blocsRows: {},
      groupFormDisplayed: false,
      cacheGroupList: {},
      relatedGroups: [],
      existingGroupsSelectDescriptor: null,
      addToExistingGroup: null
    }
  },
  computed: {
    bookId () {
      return this.bookModule.book.id
    },
    newGroupComment: {
      get () {
        return groupModule.group.comment
      },
      set (comment) {
        return groupModule.setComment(comment)
      }
    },
    rowActions () {
      return [
        new Action(
          (new ButtonDescriptor('openBook')).setFaIcon('fas fa-arrow-right'),
          this.openBook
        )
      ]
    },
    displayFormDataButtonDescriptor () {
      return new ButtonDescriptor('displayFormData').setFaIcon('fas fa-plus-circle')
    },
    commentInputTextDescriptor () {
      return new TextDescriptor('comment').setLabel('Commentaire')
    }
  },
  watch: {
    bookId () {
      this.relatedGroups = []
      this.loadGroups()
    }
  },
  beforeMount () {
    this.existingGroupsSelectDescriptor = new SelectDescriptor('groups')
    this.existingGroupsSelectDescriptor.optionsSource = groupModule.list({ order: { comment: 'DESC' } })
      .then((data) => {
        const groups = {}
        if (data['hydra:member']) {
          data['hydra:member'].forEach((group) => {
            this.cacheGroupList[group.id] = group
            groups[group.id] = group.comment
          })
          return Promise.resolve(groups)
        } else {
          return Promise.reject(new Error('La requête a retourné une réponse invalide'))
        }
      })
      .catch((error) => {
        console.error(error)
        alert(error)
      })
    this.existingGroupsSelectDescriptor.label = 'Groupes'
  },
  created () {
    eventService.on(BookModule.EVENT_BOOK_SAVED, () => {
      const referenceGroupSaving = []

      this.relatedGroups.forEach((group) => {
        const bookLinked = group.books.reduce((accu, book) => {
          return accu || book['@id'] === this.bookModule.book['@id']
        }, false)

        if (!bookLinked) {
          groupModule.set(group)
          groupModule.addBook(this.bookModule.book['@id'])
          referenceGroupSaving.push(groupModule.save())
        }
      })

      Promise.all(referenceGroupSaving).then(() => {
        this.loadGroups()
      })
    })
  },
  methods: {
    toggleDisplayFormData () {
      this.groupFormDisplayed = !this.groupFormDisplayed
    },
    validateGroupCreation () {
      groupModule.save()
        .then((group) => {
          // Add the group on the list widget
          this.blocs.push(new AccordionBloc(group.comment, group.id))
          this.$set(this.blocsRows, group.id, [
            new Element(this.bookModule.book.id, this.bookModule.book.title, this.bookModule.book)
          ])

          // Add the group on the list of groups to be linked to the book on saving
          this.relatedGroups.push(group)

          // Re-init the groupModule to clear the form
          groupModule.init()

          // Display save button
          // eslint-disable-next-line vue/no-mutating-props
          this.bookModule.flagService.flags.isModified = true

          // Hide the popup
          this.groupFormDisplayed = false
        })
        .catch((error) => {
          console.error(error)
          alert("Une erreur c'est produite et le groupe n'a pas été créé")
        })
    },
    validateGroupLinking () {
      const group = this.cacheGroupList[this.addToExistingGroup]

      // Add the group on the list widget
      this.blocs.push(new AccordionBloc(group.comment, group.id))
      const rows = group.books.map((book) => {
        return new Element(book.id, book.title, book)
      })
      rows.push(new Element(this.bookModule.book.id.toString(), this.bookModule.book.title, this.bookModule.book))
      this.$set(this.blocsRows, group.id, rows)

      // Add the group on the list of groups to be linked to the book on saving
      this.relatedGroups.push(group)

      // Display save button
      // eslint-disable-next-line vue/no-mutating-props
      this.bookModule.flagService.flags.isModified = true

      // Hide the popup
      this.groupFormDisplayed = false
    },
    loadGroups () {
      if (typeof this.bookId === 'undefined') { return }

      groupModule.list({ 'books.id': this.bookId })
        .then((data) => {
          const blocs = []
          data['hydra:member'].forEach((referenceGroup) => {
            // Creating the bloc for the accordion
            blocs.push(new AccordionBloc(referenceGroup.comment, referenceGroup.id))

            // Get the list of the books title's to display for this reference group
            const blocRows = referenceGroup.books.map((book) => {
              return new Element(book.id, book.title, book)
            })
            this.$set(this.blocsRows, referenceGroup.id, blocRows)
          })

          this.blocs = blocs
        })
        .catch((error) => {
          console.error(error)
          alert('Une erreur est survenue pendant la récupération des groupes de références')
        })
    },
    openBook (rowElement) {
      this.$router.push({
        path: bookService.getBookUrl(rowElement.extra)
      })
    }
  }
}
</script>

<style lang="scss">
@import "../../../../assets/scss/popup";
.group_manage{
  @include popup;
  position: absolute;
  width: 100%;
  top:0;
}
</style>
