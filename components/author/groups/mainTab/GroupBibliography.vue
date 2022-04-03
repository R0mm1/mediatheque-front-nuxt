<template>
  <Group custom-class="bibliography">
    <template #group_name>
      Bibliographie
    </template>

    <template #group_content>
      <div>
        Tout les livres de {{ authorFullName }} présents dans la médiathèque:
      </div>

      <SimpleList :elements="simpleListElements" :actions="simpleListRowAction"/>
    </template>
  </Group>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator'

import SimpleList, { Element, Action } from '@/components/widgets/SimpleList.vue'
import authorModule from '~/assets/ts/store/AuthorModule'
import ButtonDescriptor from '~/assets/ts/form/ButtonDescriptor'
import { AuthorBook } from '~/assets/ts/entity/AuthorEntity'
import Group from '~/components/page/Group.vue'

@Component({
  components: {
    SimpleList,
    Group
  }
})
export default class GroupBibliography extends Vue {
  get authorFullName () {
    return authorModule.author.firstname + ' ' + authorModule.author.lastname
  }

  get simpleListElements () {
    return authorModule.author.books.map((authorBook) => {
      return new Element(authorBook.id.toString(), authorBook.title, authorBook)
    })
  }

  get simpleListRowAction () {
    return [
      new Action(
        (new ButtonDescriptor('openBook')).setFaIcon('fas fa-arrow-right'),
        (rowElement: Element<AuthorBook>) => {
          if (typeof rowElement.extra === 'undefined' || typeof rowElement.extra['@type'] === 'undefined') {
            throw new TypeError('Invalid extra data in payload')
          }

          if (rowElement.extra['@type'] !== 'ElectronicBook' && rowElement.extra['@type'] !== 'PaperBook') {
            throw new Error('Invalid book type')
          }

          this.$router.push({
            path: '/book/' + (rowElement.extra['@type'] === 'ElectronicBook' ? 'electronic' : 'paper') + '/' + rowElement.id
          })
        }
      )
    ]
  }
}
</script>

<style scoped>

</style>
