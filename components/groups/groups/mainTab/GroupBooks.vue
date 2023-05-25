<template>
  <Group custom-class="livres">
    <template #group_name>
      {{ $t('reference_groups.entity_layout.group_books') }}
    </template>
    <template #group_content>
      <Loader v-if="displayLoader" class="loader" type="s" />
      <SimpleList v-if="!displayLoader" id="list-books" data-cy="listBooks" :value="simpleListElements" :actions="simpleListRowAction" />
    </template>
  </Group>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { container } from 'tsyringe'
import Group from '~/components/page/Group.vue'
import referenceGroupModule from '~/assets/ts/store/book/ReferenceGroupModule'
import SimpleList, { Action, Element } from '~/components/widgets/SimpleList.vue'
import ButtonDescriptor from '~/assets/ts/form/ButtonDescriptor'
import BookService from '~/assets/ts/service/BookService'
import { ReferenceGroupBook, ReferenceGroupBookItem } from '~/assets/ts/models/book/referenceGroup/Book'
import ReferenceGroupService from '~/assets/ts/service/book/ReferenceGroupService'
import ReferenceGroupBookService from '~/assets/ts/service/book/referenceGroup/ReferenceGroupBookService'
import GroupBookDeletePopup from '~/components/groups/groups/mainTab/GroupBookDeletePopup.vue'
import Loader from '~/components/widgets/Loader.vue'

const bookService = container.resolve(BookService)
const referenceGroupService = container.resolve(ReferenceGroupService)
const referenceGroupBookService = container.resolve(ReferenceGroupBookService)

@Component({
  components: {
    Loader,
    GroupBookDeletePopup,
    SimpleList,
    Group
  }
})
export default class GroupBooks extends Vue {
  displayLoader: boolean = false

  get simpleListElements () {
    return referenceGroupModule.referenceGroup?.elements?.map((referenceGroupBook) => {
      return new Element(
        referenceGroupBook.id?.toString() ?? '',
        (referenceGroupBook.position + 1) + ' ' + this.getBookTitle(referenceGroupBook),
        referenceGroupBook
      )
    }) ?? []
  }

  get simpleListRowAction () {
    return [
      new Action(
        (new ButtonDescriptor('removeBook')).setFaIcon('fas fa-minus'),
        (rowElement: Element<ReferenceGroupBook>) => {
          this.$emit(
            'display-popup',
            GroupBookDeletePopup,
            {
              'group-comment': referenceGroupModule.referenceGroup.comment,
              'book-title': this.getBookTitle(rowElement.extra)
            },
            {
              'group-book-delete-trigger': () => {
                this.removeBookFromGroup(rowElement)
                this.$emit('hide-popup')
              },
              'group-book-delete-cancel': () => {
                this.$emit('hide-popup')
              }
            }
          )
        }
      ),
      new Action(
        (new ButtonDescriptor('openBook')).setFaIcon('fas fa-arrow-right'),
        (rowElement: Element<ReferenceGroupBook>) => {
          try {
            if (typeof rowElement.extra.book === 'string') {
              throw new TypeError('The book must be an object')
            }
            this.$router.push({
              path: bookService.getBookUrl(rowElement.extra.book)
            })
          } catch (error) {
            this.handleErrorInConsole(error)
          }
        }
      )
    ]
  }

  getBookTitle (referenceGroupBook: ReferenceGroupBookItem) {
    if (typeof referenceGroupBook.book === 'string') {
      throw new TypeError('The book must be an object')
    }

    return referenceGroupBook.book.title ?? this.$t('reference_groups.errors.undefined_book_title').toString()
  }

  removeBookFromGroup (rowElement: Element<ReferenceGroupBook>) {
    this.displayLoader = true

    const referenceGroupId = referenceGroupModule.referenceGroup.id

    if (!referenceGroupId) {
      this.handleErrorInConsole(TypeError('The reference group id is undefined'))
      this.displayLoader = false
      return
    }

    referenceGroupBookService.delete(rowElement.id)
      .then(() => {
        const referenceGroupBookIds = (
          referenceGroupModule.referenceGroup.elements
            ?.map(referenceGroupBook => referenceGroupBook.id) ?? []
        )
          .filter(referenceGroupBookId => referenceGroupBookId !== rowElement.id)
        return referenceGroupService.sort(referenceGroupId, referenceGroupBookIds)
      })
      .then(() => referenceGroupModule.get(referenceGroupId))
      .then(() =>
        this.$toasted.show(
          this.$t('reference_groups.remove_element.success').toString(),
          {
            ...this.$config.default.notification_settings,
            type: 'success',
            icon: 'fa-check'
          }))
      .catch((error) => {
        this.handleErrorInConsole(error)
      })
      .finally(() => {
        this.displayLoader = false
      })
  }

  handleErrorInConsole (error: unknown) {
    console.error(error)
    this.$toasted.show(
      this.$t('errors.generic_console').toString(),
      {
        ...this.$config.default.notification_settings,
        type: 'error',
        icon: 'fa-times'
      })
  }
}
</script>

<style scoped>
.loader{
  height: 50px;
}

#list-books::v-deep .row_content{
  min-width: 200px;
}
</style>
