<template>
  <Group custom-class="user_info">
    <template #group_name> Informations </template>

    <template #group_content>
      <Loader v-if="isLoading" />

      <div v-if="!isLoading && error">
        Une erreur est survenue. Ouvrez la console pour obtenir plus
        d'informations.
      </div>

      <template v-if="!isLoading">
        <MedInputText
          v-model="firstname"
          :text-descriptor="firstnameTextDescriptor"
        />
        <MedInputText
          v-model="lastname"
          :text-descriptor="lastnameTextDescriptor"
        />
        <MedInputText v-model="email" :text-descriptor="emailTextDescriptor" />
      </template>
    </template>

    <template #group_footer>
      <MedInputButton
        :button-descriptor="logoutButtonDescriptor"
        @click="logout"
      />
      <MedInputButton :button-descriptor="manageAccountDescriptor" />
    </template>
  </Group>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { container } from "tsyringe";
import TextDescriptor from "~/assets/ts/form/TextDescriptor";
import ButtonDescriptor from "~/assets/ts/form/ButtonDescriptor";
import ButtonHrefDescriptor from "~/assets/ts/form/ButtonHrefDescriptor";
import Group from "~/components/page/Group.vue";
import Loader from "~/components/widgets/Loader.vue";
import FormContainer from "~/components/form/FormContainer.vue";
import MedInputText from "~/components/form/elements/MedInputText.vue";
import MedInputButton from "~/components/form/elements/MedInputButton.vue";
import LogoutService from "~/assets/ts/service/auth/LogoutService";
import UserinfoService from "~/assets/ts/service/auth/UserinfoService";
import { useRuntimeConfig } from "#app";

const config = useRuntimeConfig();

const isLoading = ref(true);
const error = ref(false);
const firstname = ref<string | null>(null);
const lastname = ref<string | null>(null);
const email = ref<string | null>(null);

const firstnameTextDescriptor = new TextDescriptor("firstname")
  .setEditModeOn(false)
  .setLabel("Prénom");
const lastnameTextDescriptor = new TextDescriptor("lastname")
  .setEditModeOn(false)
  .setLabel("Nom");
const emailTextDescriptor = new TextDescriptor("email")
  .setEditModeOn(false)
  .setLabel("Email");

const logoutButtonDescriptor = new ButtonDescriptor("logout", "Se déconnecter");
const manageAccountDescriptor = new ButtonDescriptor(
  "manageAccount",
  "Gérer mon compte"
).setHref(
  new ButtonHrefDescriptor(
    config.public.auth.account_management_web_ui
  ).setTarget("_blank")
);

const logout = () => {
  container.resolve(LogoutService).logout();
};

onMounted(() => {
  container
    .resolve(UserinfoService)
    .getUserInfos()
    .then((response) => {
      const data = response.data;

      firstname.value = data.given_name;
      lastname.value = data.family_name;
      email.value = data.email;
    })
    .catch((err) => {
      console.error(err);
      error.value = true;
    })
    .finally(() => {
      isLoading.value = false;
    });
});
</script>

<style lang="scss">
.group_user_info {
  max-height: 200px;

  .group_footer .formulate-input {
    margin-right: 3px;
  }
}
</style>
