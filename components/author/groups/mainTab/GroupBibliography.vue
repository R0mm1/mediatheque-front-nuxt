<template>
  <Group custom-class="bibliography">
    <template #group_name>
      Bibliographie
    </template>

    <template #group_content>
      <div v-if="fetching" id="loader-container">
        <Loader type="s"/>
      </div>
      <template v-else>
        <div>
          Tout les livres de {{ authorFullName }} présents dans la médiathèque:
        </div>
        <div id="extra-info">
          <MedInputSelect v-model="activeFilter" :select-descriptor="selectBookTypeDescriptor"/>
          <div>{{ countSimpleListElements }} livre(s)</div>
        </div>

        <SimpleList :elements="simpleListElements" :actions="simpleListRowAction"/>
      </template>
    </template>
  </Group>
</template>

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator'
import { container } from 'tsyringe'
import SimpleList, { Element, Action } from '@/components/widgets/SimpleList.vue'
import authorModule from '~/assets/ts/store/AuthorModule'
import ButtonDescriptor from '~/assets/ts/form/ButtonDescriptor'
import { AuthorBook } from '~/assets/ts/models/Author'
import Group from '~/components/page/Group.vue'
import BookService, { BookTypes } from '~/assets/ts/service/BookService'
import MedInputSelect from '~/components/form/elements/MedInputSelect.vue'
import SelectDescriptor from '~/assets/ts/form/SelectDescriptor'
import Loader from '@/components/widgets/Loader.vue'

export type Filter = 'none' | BookTypes

const bookService = container.resolve(BookService)

@Component({
  components: {
    MedInputSelect,
    SimpleList,
    Group,
    Loader
  }
})
export default class GroupBibliography extends Vue {
  activeFilter: Filter = 'none'
  selectBookTypeOptions: { [key in Filter]: string } = {
    none: 'Tous',
    PaperBook: 'Papier',
    ElectronicBook: 'Epub',
    AudioBook: 'Audio'
  }

  get fetching () {
    return authorModule.flagService.flags.fetching
  }

  get authorFullName () {
    return authorModule.author.person.firstname + ' ' + authorModule.author.person.lastname
  }

  get simpleListElements () {
    return authorModule?.author?.books
      ?.filter((authorBook) => {
        if (this.activeFilter === 'none') {
          return true
        }

        return authorBook['@type'] === this.activeFilter
      })
      .map((authorBook) => {
        return new Element(authorBook.id?.toString() ?? '', authorBook.title ?? 'Erreur: titre non définit', authorBook)
      }) ?? []
  }

  get countSimpleListElements () {
    return this.simpleListElements.length
  }

  get selectBookTypeDescriptor () {
    const descriptor = new SelectDescriptor('bookType', '').setFaIcon('fas fa-book')
    descriptor.options = this.selectBookTypeOptions
    descriptor.defaultValue = 'none'
    return descriptor
  }

  get simpleListRowAction () {
    return [
      new Action(
        (new ButtonDescriptor('openBook')).setFaIcon('fas fa-arrow-right'),
        (rowElement: Element<AuthorBook>) => {
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

<style scoped lang="scss">
#loader-container {
  width: 100%;
  text-align: center;

  img {
    width: 50px;
  }
}

#extra-info {
  display: flex;
  font-size: .9rem;

  > div {
    display: flex;
    justify-content: center;
    flex-direction: column;
    margin: 5px 0 5px 0;

    &:not(:first-of-type) {
      margin-left: 5px;
    }
  }
}
</style>
