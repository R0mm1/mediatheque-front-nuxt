<template>
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

<script lang="ts">

import { Component, Vue } from 'vue-property-decorator'
import authorModule from '~/assets/ts/store/AuthorModule'
import TextDescriptor from '~/assets/ts/form/TextDescriptor'

@Component({})
export default class GroupInformation extends Vue {
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
}
</script>

<style scoped>

</style>
