<template>
  <EntityLayout v-model="activeTab" :tabs="tabs">
    <template #entity-layout-title>
      {{ firstname }} {{ lastname }}
    </template>
    <template #entity-layout-content>
      <MainTab />
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
import config from '~/mediatheque.json'
import ButtonDescriptor from '~/assets/ts/form/ButtonDescriptor'
import MainTab from '~/components/author/groups/MainTab.vue'

@Component({
  components: { EntityLayout, MainTab }
})
export default class Author extends Vue {
  @Prop({ type: Number, required: true }) authorId!:number|null;

  activeTab: string = 'author';
  readonly tabs: TabData[] = [
    {
      id: 'author',
      label: "L'auteur"
    }
  ];

  get lastname () {
    return authorModule.author.lastname
  }

  get firstname () {
    return authorModule.author.firstname
  }

  get saveButtonDescriptor () {
    return new ButtonDescriptor('save', ButtonDescriptor.typeSubmit)
      .setValue('Enregistrer')
  }

  get isModified () {
    return authorModule.flagService.flags.isModified
  }

  save () {
    authorModule.save()
      .then(() => {
        this.$toasted.show("L'auteur a été sauvegardé", {
          ...config.default.notification_settings,
          type: 'success',
          icon: 'fa-check'
        })
        this.$emit('author-saved')
      })
      .catch((error) => {
        console.error(error)
        alert("Une erreur s'est produite et l'auteur n'a pas pu être sauvegardé")
      })
  }

  created () {
    if (this.authorId === null) {
      authorModule.new()
    } else {
      authorModule.get(this.authorId)
    }
  }
}
</script>

<style scoped>
</style>
