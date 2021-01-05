<template>
  <EntityLayout v-model="activeTab" :tabs="tabs">
    <template #entity-layout-title>
      {{ firstname }} {{ lastname }}
    </template>
    <template #entity-layout-content>
      <Group custom-class="information">
        <template #group_name>
          Informations
        </template>

        <template #group_content>
          <MedInputText v-model="firstname" :text-descriptor="firstnameTextDescriptor" />
          <MedInputText v-model="lastname" :text-descriptor="lastnameTextDescriptor" />
        </template>
      </Group>
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
import TextDescriptor from '~/assets/ts/form/TextDescriptor'

import config from '~/mediatheque.json'
import ButtonDescriptor from '~/assets/ts/form/ButtonDescriptor'

@Component({
  components: { EntityLayout }
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

  get firstname () {
    return authorModule.author.firstname
  }

  set firstname (firstname:string|undefined) {
    authorModule.setFirstname(firstname ?? '')
  }

  get lastname () {
    return authorModule.author.lastname
  }

  set lastname (lastname: string |undefined) {
    authorModule.setLastname(lastname ?? '')
  }

  get firstnameTextDescriptor () {
    return new TextDescriptor('firstname').setLabel('Prénom')
  }

  get lastnameTextDescriptor () {
    return new TextDescriptor('lastname').setLabel('Nom')
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
.group_information{
  max-width: 350px;
}
</style>
