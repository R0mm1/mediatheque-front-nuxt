<template>
  <Group custom-class="livres">
    <template #group_name>
      {{ $t('reference_groups.entity_layout.group_books') }}
    </template>
    <template #group_content>
      <SimpleList :elements="simpleListElements" :actions="simpleListRowAction" />
    </template>
  </Group>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { container } from 'tsyringe'
import Group from '~/components/page/Group.vue'
import groupModule from '~/assets/ts/store/GroupModule'
import SimpleList, { Action, Element } from '~/components/widgets/SimpleList.vue'
import ButtonDescriptor from '~/assets/ts/form/ButtonDescriptor'
import { ReferenceGroupBook } from '~/assets/ts/models/ReferenceGroup'
import BookService from '~/assets/ts/service/BookService'

const bookService = container.resolve(BookService)

@Component({
  components: {
    SimpleList,
    Group
  }
})
export default class GroupBooks extends Vue {
  get simpleListElements () {
    return groupModule.group.books.map((book) => {
      if (typeof book === 'string') {
        return new Element(Math.random().toString(), book, book)
      }
      return new Element(
        book.id?.toString() ?? '',
        book.title ?? this.$t('reference_groups.errors.undefined_book_title').toString(),
        book
      )
    })
  }

  get simpleListRowAction () {
    return [
      new Action(
        (new ButtonDescriptor('openBook')).setFaIcon('fas fa-arrow-right'),
        (rowElement: Element<ReferenceGroupBook>) => {
          try {
            this.$router.push({
              path: bookService.getBookUrl(rowElement.extra)
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
