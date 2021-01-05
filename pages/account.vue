<template>
  <Group custom-class="change_password">
    <template #group_name>
      Modifier le mot de passe
    </template>

    <template #group_content>
      <Loader v-if="isLoading" />

      <template v-if="!isLoading">
        <FormContainer validate-label="Modifier" :validate-action="save" :validation-method="isValid">
          <template v-if="!isLoading" #form_body>
            <MedInputText v-model="passwd" :text-descriptor="passwdPasswordDescriptor" />
            <MedInputText v-model="passwdRepeat" :text-descriptor="passwdRepeatPasswordDescriptor" />
          </template>

          <template #action_cancel>
            <span />
          </template>
        </FormContainer>
      </template>
    </template>
  </Group>
</template>

<script lang="ts">

import { Component, Vue, Watch } from 'vue-property-decorator'
import userModule from '~/assets/ts/store/user/UserModule'
import TextDescriptor from '~/assets/ts/form/TextDescriptor'
import Group from '~/components/page/Group.vue'
import Loader from '~/components/widgets/Loader.vue'
import FormContainer from '~/components/form/FormContainer.vue'
import MedInputText from '~/components/form/elements/MedInputText.vue'

@Component({
  components: { Group, Loader, FormContainer, MedInputText }
})
export default class AccountPage extends Vue {
  passwd: string|null=null
  passwdRepeat: string|null= null
  hasError: boolean = true

  checkPasswd () {
    this.hasError = this.passwdRepeat !== null && this.passwd !== this.passwdRepeat
  }

  isValid () {
    return this.passwdRepeat !== null && !this.hasError
  }

  save () {
    if (this.passwd !== null) {
      userModule.setPassword(this.passwd)
    }
  }

  get userId () {
    return userModule.user.id
  }

  get isLoading () {
    return typeof this.userId !== 'undefined' && this.userId.toString().length === 0
  }

  get passwdPasswordDescriptor () {
    return new TextDescriptor('passwd')
      .setLabel('Mot de passe')
      .setType(TextDescriptor.typePassword)
  }

  get passwdRepeatPasswordDescriptor () {
    return new TextDescriptor('passwdRepeat')
      .setLabel('Répéter')
      .setType(TextDescriptor.typePassword)
  }

  @Watch('passwd')
  passwdChanged () {
    this.checkPasswd()
  }

  @Watch('passwdRepeat')
  passwdRepeatChanged () {
    this.checkPasswd()
  }

  mounted () {
    userModule.getLoggedIn()
  }
}
</script>

<style lang="scss">
.group_change_password{
  max-width: 420px;
}
</style>
