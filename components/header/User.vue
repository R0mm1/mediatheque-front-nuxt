<template>
  <div id="headerUserElement">
    <MedInputButton :button-descriptor="userAccountButtonDescriptor" @click.native="goToAccount" />
  </div>
</template>

<script>
import ButtonDescriptor from '~/assets/ts/form/ButtonDescriptor'
import MedInputButton from '~/components/form/elements/MedInputButton.vue'

export default {
  name: 'User',
  components: { MedInputButton },
  computed: {
    userAccountButtonDescriptor () {
      return new ButtonDescriptor('userAccount')
        .setFaIcon('fas fa-user-circle')
        .setNoDefaultStyle(true)
    }
  },
  methods: {
    goToAccount () {
      this.$router.push({
        path: '/account'
      })
    }
  }
}
</script>

<style lang="scss">

#headerUserElement {
  padding: 10px 40px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  @include phone-portrait {
    padding: 10px 5px;
  }

  .formulate-input-element--button button {
    $dimension: 50px;
    $dimension-phone-portrait: 44px;

    border-radius: 50%;
    height: 50px;
    width: 50px;
    color: #2b2b2b;
    position: relative;
    border: none;

    @include phone-portrait {
      height: $dimension-phone-portrait;
      width: $dimension-phone-portrait;
      border-radius: 5px;
    }

    i {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      margin: auto;
      display: block;
      height: calc(#{$dimension} - 20px);
      font-size: calc(#{$dimension} - 20px);
      bottom: 0;

      @include phone-portrait {
        height: calc(#{$dimension-phone-portrait} - 20px);
        font-size: calc(#{$dimension-phone-portrait} - 20px);
      }
    }
  }
}
</style>
