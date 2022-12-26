<template>
  <Group custom-class="references">
    <template #group_name>
      Groupes
    </template>

    <template v-if="editModeOn" #group_customActions>
      <MedInputButton :button-descriptor="displayFormDataButtonDescriptor" @click.native="toggleDisplayFormData" />
    </template>

    <template #group_content>
      <Accordion :blocs="blocs" @bloc-opened="loadReferenceGroupBooks">
        <template v-for="bloc in blocs" :slot="bloc.slotId">
          <Loader v-if="!blocsRows[bloc.slotId]" :key="bloc.slotId" type="s" />
          <SimpleList
            v-else
            :key="bloc.slotId"
            v-model="blocsRows[bloc.slotId]"
            :edit-mode-on="editModeOn"
            :sortable="true"
            :actions="rowActions"
          />
        </template>
      </Accordion>

      <div v-if="groupFormDisplayed" class="group_manage">
        <FormContainer :validate-action="validateGroupLinking">
          <template #form_title>
            Ajouter à un groupe existant
          </template>
          <template #form_body>
            <MedSelect
              v-model="addToExistingGroup"
              :med-select-descriptor="existingGroupsSelectDescriptor"
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
import { Vue } from 'vue-property-decorator'
import Group from '@/components/page/Group'
import Accordion, { AccordionBloc } from '@/components/widgets/Accordion'
import SimpleList, { Element, Action } from '@/components/widgets/SimpleList'
import FormContainer from '@/components/form/FormContainer'
import EventService from '@/assets/ts/service/EventService'
import { BookModule } from '@/assets/ts/store/book/BookModule'
import ButtonDescriptor from '@/assets/ts/form/ButtonDescriptor'
import MedInputButton from '@/components/form/elements/MedInputButton'
import TextDescriptor from 'assets/ts/form/TextDescriptor'
import MedInputText from '@/components/form/elements/MedInputText'
import BookService from '~/assets/ts/service/BookService'
import ReferenceGroupService from '~/assets/ts/service/book/ReferenceGroupService'
import ReferenceGroupBookService from '~/assets/ts/service/book/referenceGroup/ReferenceGroupBookService'
import Loader from '~/components/widgets/Loader'
import MedSelect from '~/components/form/elements/MedSelect'
import MedSelectDescriptor from '~/assets/ts/form/MedSelectDescriptor'
import DisplayableError from '~/assets/ts/objects/error/DisplayableError'
import bookGroupMembershipModule from '~/assets/ts/store/book/BookGroupMembershipModule'

const eventService = EventService.getService()
const bookService = container.resolve(BookService)
const referenceGroupService = container.resolve(ReferenceGroupService)
const referenceGroupBookService = container.resolve(ReferenceGroupBookService)

export default {
  name: 'GroupReferences',
  components: {
    MedSelect,
    Loader,
    MedInputText,
    MedInputButton,
    FormContainer,
    SimpleList,
    Accordion,
    Group
  },
  props: {
    bookModule: {
      type: Object,
      required: true
    },
    editModeOn: {
      type: Boolean,
      required: true
    }
  },
  data () {
    return {
      isNewBook: true,
      blocs: [],
      blocsRows: new Proxy({}, {
        vue: this,
        set (target, p, value) {
          let isFirstLoading = true
          // This proxy allow the position to be kept up-to-date both when the referenceGroupBooks are first loaded,
          // and when they are sorted by the user
          const referenceGroupBookIds = []
          value.forEach((element, index) => {
            if (isFirstLoading && element.content.length > 0) {
              // When the referenceGroupBooks are loaded we don't bother to set the content as it's done here, so we
              // know if they are loaded for the first time, or updated
              isFirstLoading = false
            }
            element.extra.position = index
            this.vue.updateBookRowContent(element, element.extra.book)
            referenceGroupBookIds.push([element.extra.id, element.extra.position])

            if (element.extra.book.id === this.vue.bookId) {
              this.vue.blocsRowsForCurrentBook.push(element)
            }
          })

          if (!isFirstLoading) {
            // If the bloc already has rows loaded, it means it's an update of those rows, like a sort by the user. We
            // remember it has been changed for further save operation when the user click the save button
            bookGroupMembershipModule.addResortedGroup({
              referenceGroupId: p,
              referenceGroupBookIds
            })
          }

          target[p] = value

          return true
        }
      }),
      blocsRowsForCurrentBook: [],
      groupFormDisplayed: false,
      addToExistingGroup: null,
      existingGroupsSelectData: null,
      newGroupComment: ''
    }
  },
  computed: {
    bookId () {
      return this.bookModule.book.id
    },
    bookTitle () {
      return this.bookModule.book.title
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
    },
    existingGroupsSelectDescriptor () {
      const existingGroupsSelectDescriptor = new MedSelectDescriptor('groups')
      existingGroupsSelectDescriptor.label = 'Groupes'
      existingGroupsSelectDescriptor.options = this.existingGroupsSelectFormatedData
      return existingGroupsSelectDescriptor
    },
    existingGroupsSelectFormatedData () {
      return this.existingGroupsSelectData === null ? [] : this.existingGroupsSelectData
    }
  },
  watch: {
    bookId () {
      this.loadGroups()
    },
    bookTitle () {
      this.blocsRowsForCurrentBook.forEach(blocRow => this.updateBookRowContent(blocRow))
    }
  },
  created () {
    this.isNewBook = !this.bookId
    eventService.on(BookModule.EVENT_BOOK_SAVED, () => {
      if (this.isNewBook) {
        // If it's a new book, the current bookGroupMemberships have no reference to the new book id, so we need to
        // update them before saving
        bookGroupMembershipModule.updateBook(this.bookModule.book)
      }
      return bookGroupMembershipModule.save()
        .then(() => {
          bookGroupMembershipModule.reset()
          return Promise.resolve()
        })
    })
  },
  methods: {
    updateBookRowContent (element, book) {
      if (!book) {
        book = this.bookModule.book
      }
      element.content = (element.extra.position + 1) + ' ' + book.title
    },
    toggleDisplayFormData () {
      this.groupFormDisplayed = !this.groupFormDisplayed
      if (this.existingGroupsSelectData === null) {
        this.loadExistingGroupsSelectData()
      }
    },
    loadReferenceGroupBooks (block) {
      if ((typeof block.slotId === 'string' && block.slotId.startsWith('new_')) || this.blocsRows[block.slotId]) {
        return
      }

      referenceGroupBookService
        .list({ referenceGroup: block.slotId })
        .then((referenceGroupBooks) => {
          Vue.set(this.blocsRows, block.slotId, referenceGroupBooks['hydra:member']
            .sort((first, second) => first.position - second.position)
            .map(referenceGroupBook => new Element(referenceGroupBook.book.id, '', referenceGroupBook))
          )
        })
    },
    // Load existing groups as an array of SelectValue objects to use within the form
    loadExistingGroupsSelectData () {
      referenceGroupService.list({ order: { comment: 'DESC' } })
        .then((data) => {
          if (!data['hydra:member']) {
            return Promise.reject(new Error('La requête a retourné une réponse invalide'))
          }

          const groups = []
          data['hydra:member'].forEach((group) => {
            groups.push({
              label: group.comment,
              key: 'group_' + group.id,
              value: group
            })
          })
          this.existingGroupsSelectData = groups
        })
    },
    // Action when the user validate the group creation form
    validateGroupCreation () {
      const referenceGroup = {
        comment: this.newGroupComment
      }
      const referenceGroupBook = {
        position: 0,
        book: this.bookModule.book,
        referenceGroup
      }
      const groupTemporaryId = 'new_' + Math.random().toString()

      // Add the group on the list widget
      this.blocs.push(new AccordionBloc(referenceGroup.comment, groupTemporaryId))
      this.$set(this.blocsRows, groupTemporaryId, [
        new Element(
          'new_' + Math.random(),
          '',
          referenceGroupBook
        )
      ])
      // Add the group on the list of groups to be linked to the book on saving
      bookGroupMembershipModule.addNewGroupMembership(referenceGroupBook)

      // Reset the form field
      this.newGroupComment = null

      // Hide the popup
      this.groupFormDisplayed = false
    },
    // Action when the user add the book to an existing group
    validateGroupLinking () {
      const group = this.addToExistingGroup.value

      // Start by loading the group's books to display them in the widget
      referenceGroupBookService.list({ referenceGroup: group.id })
        .then((data) => {
          if (!data['hydra:member']) {
            console.error('Could not load reference group\'s books')
            return Promise.reject(new DisplayableError(this.$t('errors.generic_console').toString()))
          }
          return Promise.resolve(data['hydra:member'])
        })
        .then((referenceGroupBooks) => {
          const referenceGroupBook = {
            position: referenceGroupBooks.length,
            book: this.bookModule.book,
            referenceGroup: group
          }

          // Add the group on the list widget
          this.blocs.push(new AccordionBloc(group.comment, group.id))
          const rows = referenceGroupBooks.map((referenceGroupBook) => {
            return new Element(referenceGroupBook.id, '', referenceGroupBook)
          })
          rows.push(new Element(
            'new_' + Math.random(),
            '',
            referenceGroupBook
          ))
          this.$set(this.blocsRows, group.id, rows)

          // Add the group on the list of groups to be linked to the book on saving
          bookGroupMembershipModule.addNewGroupMembership(referenceGroupBook)

          // Reset form field
          this.addToExistingGroup = null

          // Hide the popup
          this.groupFormDisplayed = false
        })
    },
    // Load the groups the book belongs to
    loadGroups () {
      if (typeof this.bookId === 'undefined') {
        return
      }

      const blocs = {}
      this.bookModule.book.groupMemberships.forEach((groupMembership) => {
        const referenceGroup = groupMembership.referenceGroup
        blocs[referenceGroup.id] = new AccordionBloc(referenceGroup.comment, referenceGroup.id, false)
      })

      this.blocs = Object.values(blocs)
    },
    openBook (rowElement) {
      this.$router.push({
        path: bookService.getBookUrl(rowElement.extra.book)
      })
    }
  }
}
</script>

<style lang="scss">
@import "../../../../assets/scss/popup";

.group_manage {
  @include popup;
  position: absolute;
  width: 100%;
  top: 0;
}
</style>
