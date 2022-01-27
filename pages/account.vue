<template>
  <Group custom-class="user_info">
    <template #group_name>
      Informations
    </template>

    <template #group_content>
      <Loader v-if="isLoading" />

      <div v-if="!isLoading && error">
        Une erreur est survenue. Ouvrez la console pour obtenir plus d'informations.
      </div>

      <template v-if="!isLoading">
        <MedInputText v-model="firstname" :text-descriptor="firstnameTextDescriptor" />
        <MedInputText v-model="lastname" :text-descriptor="lastnameTextDescriptor" />
        <MedInputText v-model="email" :text-descriptor="emailTextDescriptor" />
      </template>
    </template>

    <template #group_footer>
      <MedInputButton :button-descriptor="logoutButtonDescriptor" @click.native="logout" />
      <MedInputButton :button-descriptor="manageAccountDescriptor" />
    </template>
  </Group>
</template>

<script lang="ts">

import { container } from 'tsyringe'
import { Component, Vue } from 'vue-property-decorator'
import UserinfoService from '~/assets/ts/service/auth/UserinfoService'
// import userModule from '~/assets/ts/store/user/UserModule'
import TextDescriptor from '~/assets/ts/form/TextDescriptor'
import ButtonDescriptor from '~/assets/ts/form/ButtonDescriptor'
import ButtonHrefDescriptor from '~/assets/ts/form/ButtonHrefDescriptor'
import Group from '~/components/page/Group.vue'
import Loader from '~/components/widgets/Loader.vue'
import FormContainer from '~/components/form/FormContainer.vue'
import MedInputText from '~/components/form/elements/MedInputText.vue'
import MedInputButton from '~/components/form/elements/MedInputButton.vue'
import LogoutService from '~/assets/ts/service/auth/LogoutService'

import config from '~/mediatheque.json'

const userinfoService = container.resolve(UserinfoService)
const logoutService = container.resolve(LogoutService)

@Component({
  components: { Group, Loader, FormContainer, MedInputText, MedInputButton }
})
export default class AccountPage extends Vue {
  isLoading: boolean = true;
  error: boolean = false;
  firstname: string | null = null;
  lastname: string | null = null;
  email: string | null = null;

  firstnameTextDescriptor = (new TextDescriptor('firstname')).setEditModeOn(false).setLabel('Prénom')
  lastnameTextDescriptor = (new TextDescriptor('lastname').setEditModeOn(false).setLabel('Nom'));
  emailTextDescriptor = (new TextDescriptor('email').setEditModeOn(false).setLabel('Email'));

  logoutButtonDescriptor = (new ButtonDescriptor('logout', 'Se déconnecter'));
  manageAccountDescriptor = (new ButtonDescriptor('manageAccount', 'Gérer mon compte'))
    .setHref(
      (new ButtonHrefDescriptor(config.auth.account_management_web_ui))
        .setTarget('_blank')
    );

  logout () {
    logoutService.logout()
  }

  mounted () {
    userinfoService.getUserInfos()
      .then((response) => {
        const data = response.data

        this.firstname = data.given_name
        this.lastname = data.family_name
        this.email = data.email
      })
      .catch((error) => {
        console.error(error)
        this.error = true
      })
      .finally(() => {
        this.isLoading = false
      })
  }
}
</script>

<style lang="scss">
.group_user_info {
  max-height: 200px;

  .group_footer .formulate-input {
    margin-right: 3px;
  }
}
</style>
