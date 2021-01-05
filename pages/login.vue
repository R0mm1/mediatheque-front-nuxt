<template>
  <FormulateForm
    v-model="values"
    :schema="schema"
    @submit="login"
  />
</template>

<script lang="ts">
import Vue from 'vue'

import { container } from 'tsyringe'

import config from '../mediatheque.json'
import AuthenticationService from '~/assets/ts/service/AuthenticationService'

const authenticationService = container.resolve(AuthenticationService)

export default Vue.extend({
  layout: 'login',
  data () {
    return {
      values: {
        userLogin: '',
        userPassword: ''
      },
      schema: [
        {
          type: 'text',
          name: 'userLogin',
          label: 'Identifiant',
          validation: 'required'
        },
        {
          type: 'password',
          name: 'userPassword',
          label: 'Mot de passe',
          validation: 'required'
        },
        {
          type: 'submit',
          label: 'Se connecter'
        }
      ]
    }
  },
  methods: {
    login () {
      authenticationService.login(this.values.userLogin, this.values.userPassword)
        .then(() => {
          window.location.href = config.default.page
        })
        .catch((httpErrorCode) => {
          const message = (httpErrorCode === 401) ? 'Identifiant ou mot de passe invalide' : 'Une erreur est survenue'

          this.$toasted.show(message, {
            ...config.default.notification_settings,
            type: 'error',
            icon: 'fa-times'
          })
        })
    }
  }
})
</script>

<style lang="scss">
.formulate-form {
  width: 500px;
  margin: 100px auto;
  box-shadow: 1px 1px 5px #e4dccc;
  padding: 50px;

  .formulate-input[data-type="submit"]{
    margin-top: 15px;
  }
}
</style>
