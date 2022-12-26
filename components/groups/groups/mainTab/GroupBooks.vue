<template>
  <Group custom-class="livres">
    <template #group_name>
      {{ $t('reference_groups.entity_layout.group_books') }}
    </template>
    <template #group_content>
      <SimpleList :value="simpleListElements" :actions="simpleListRowAction" />
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
import { ReferenceGroupBook } from '~/assets/ts/models/book/referenceGroup/Book'

const bookService = container.resolve(BookService)

@Component({
  components: {
    SimpleList,
    Group
  }
})
export default class GroupBooks extends Vue {
  get simpleListElements () {
    return referenceGroupModule.referenceGroup?.elements?.map((referenceGroupBook) => {
      if (typeof referenceGroupBook.book === 'string') {
        throw new TypeError('The book must be an object')
      }
      return new Element(
        referenceGroupBook.id?.toString() ?? '',
        referenceGroupBook.book.title ?? this.$t('reference_groups.errors.undefined_book_title').toString(),
        referenceGroupBook
      )
    }) ?? []
  }

  get simpleListRowAction () {
    return [
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
      )
    ]
  }
}
</script>

<style scoped>

</style>
