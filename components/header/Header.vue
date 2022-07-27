<template>
  <header id="vueHeader" :class="{withMobileMenu: withMobileMenu}">
    <div id="mainLogo">
      <img src="/logo.png" alt="Médiathèque" @click="goToHome">
    </div>

    <Menu v-if="!noUser" />

    <div id="customHeaderMessage">
      {{ customHeaderMessage }}
    </div>

    <User v-if="!noUser" />
  </header>
</template>

<script>
export default {
  name: 'Header',
  components: {
    Menu: () => import('./Menu'),
    User: () => import('./User')
  },
  props: {
    noUser: {
      default: false,
      type: Boolean
    },
    withMobileMenu: {
      default: false,
      type: Boolean
    },
    customHeaderMessage: {
      default: '',
      type: String
    }
  },
  methods: {
    goToHome () {
      this.$router.push({
        path: '/'
      })
    }
  }
}
</script>

<style scoped lang="scss">

$default-height: 100px;
$phone-portrait-height: 35px;

#vueHeader {
  position: relative;
  display: flex;
  background-color: $shade2;
  height: $default-height;
  z-index: 10;

  @include phone-portrait {
    height: $phone-portrait-height;

    &.withMobileMenu{
      padding-left: 35px;
    }
  }

  #mainLogo {
    display: inline-block;
    background-color: $shade3;

    img {
      height: 80px;
      margin: 10px;
      cursor: pointer;
      position: relative;
      z-index: 10;

      @include phone-portrait {
        margin: 5px;
        height: 25px;
      }
    }
  }

  #customHeaderMessage {
    position: absolute;
    text-align: center;
    right: 0;
    left: 0;
    top: 0;
    bottom: 0;
    line-height: $default-height;
    color: #fff;
    font-size: 3rem;

    @include phone-portrait {
      font-size: 2rem;
      line-height: $phone-portrait-height;
    }
  }

  #mainMenu {
    flex: 1;
  }
}
</style>
