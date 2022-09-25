<template>
  <EntityLayout v-model="activeTab" :tabs="tabs" :footer-opened="switchEditModeOn && isModified" @edit-button-pressed="toggleEditMode">
    <template #entity-layout-title>
      {{ firstname }} {{ lastname }}
    </template>
    <template #entity-layout-content>
      <MainTab :edit-mode-on="switchEditModeOn" />
    </template>
    <template #entity-layout-footer>
      <MedInputButton v-if="isModified" :button-descriptor="saveButtonDescriptor" @click.native="save" />
    </template>
  </EntityLayout>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import EntityLayout from '~/components/page/EntityLayout.vue'
import { TabData } from '~/components/widgets/Tabs.vue'
import authorModule from '~/assets/ts/store/AuthorModule'
import ButtonDescriptor from '~/assets/ts/form/ButtonDescriptor'
import MainTab from '~/components/author/groups/MainTab.vue'
import MedInputButton from '~/components/form/elements/MedInputButton.vue'

@Component({
  components: {
    EntityLayout,
    MainTab,
    MedInputButton
  }
})
export default class Author extends Vue {
  @Prop() authorId!: number | null

  switchEditModeOn: boolean = false

  activeTab: string = 'author'
  readonly tabs: TabData[] = [
    {
      id: 'author',
      label: 'L\'auteur'
    }
  ]

  get lastname () {
    return authorModule.author.person.lastname
  }

  get firstname () {
    return authorModule.author.person.firstname
  }

  get saveButtonDescriptor () {
    return new ButtonDescriptor('save', ButtonDescriptor.typeSubmit)
      .setValue('Enregistrer')
  }

  get isModified () {
    return authorModule.flagService.flags.isModified
  }

  toggleEditMode () {
    this.switchEditModeOn = !this.switchEditModeOn
  }

  save () {
    authorModule.save()
      .then(() => {
        this.$toasted.show('L\'auteur a été sauvegardé', {
          ...this.$config.default.notification_settings,
          type: 'success',
          icon: 'fa-check'
        })
        this.$emit('author-saved')

        this.toggleEditMode()
      })
      .catch((error) => {
        console.error(error)
        this.$toasted.show('Une erreur s\'est produite et l\'auteur n\'a pas pu être sauvegardé', {
          ...this.$config.default.notification_settings,
          type: 'error',
          icon: 'fa-times'
        })
      })
  }

  created () {
    if (this.authorId === null) {
      this.switchEditModeOn = true
      authorModule.new()
    } else {
      authorModule.get(this.authorId)
    }
  }
}
</script>

<style scoped>
</style>
