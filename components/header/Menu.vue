<template>
  <ul id="mainMenu">
    <li
      v-for="(menuItem, menuIndex) in menu"
      :id="'main_menu_'+menuIndex"
      :key="menuIndex"
      v-click-outside="close"
      :class="{opened: menuItem.opened}"
      @click="toggle(menuIndex)"
    >
      {{ menuItem.label }}
      <ul class="subMenu l1Menu">
        <li v-for="(subMenuItem, subMenuIndex) in menuItem.children" :key="subMenuIndex">
          <a :href="subMenuItem.target">{{ subMenuItem.label }}</a>
        </li>
      </ul>
    </li>
  </ul>
</template>

<script>
import ClickOutside from 'vue-click-outside'

export default {
  name: 'Menu',
  directives: {
    'click-outside': ClickOutside
  },
  data () {
    return {
      menu: [
        {
          label: 'Livres',
          opened: false,
          children: [
            {
              label: 'Par livre',
              target: '/book'
            },
            {
              label: 'Par auteur',
              target: '/authors'
            }
          ]
        }
      ]
    }
  },
  methods: {
    toggle (index) {
      this.menu[index].opened = !this.menu[index].opened
    },
    close (event) {
      let menuIndex = null
      if (typeof event.target.id === 'string' && event.target.id.startsWith('main_menu_')) {
        menuIndex = parseInt(event.target.id.split('main_menu_')[1])
      }
      this.menu.forEach((menu, index) => {
        if (index === menuIndex) {
          return
        }
        menu.opened = false
      })
    }
  }
}
</script>

<style scoped lang="scss">
ul#mainMenu {
  list-style-type: none;
  margin: auto 10px;
  padding: 0;
  overflow: hidden;
  color: #333333;
  z-index: 10;

  li {
    font-size: 1.1rem;
    float: left;
    display: inline-block;
    text-align: center;
    padding: 14px 16px;
  }

  > li {
    border-bottom: 2px solid transparent;
  }

  > li:hover {
    border-bottom: 2px solid #c7c0b3;
  }

  @include phone-portrait {
    li{
      padding: 0;
      border-bottom: none;

      &:not(:last-of-type){
        padding-right: 20px;
      }
    }
  }

  .subMenu {
    padding: 0;
    margin: 16px 0 0px -16px;
    list-style-type: none;
    display: none;
    position: absolute;
    background-color: #eae3d6;
    min-width: 160px;
    z-index: 1;

    @include phone-portrait {
      margin: 7px 0 0px -16px;
    }

    li {
      font-size: 1rem;
      padding: 6px 8px;
      display: block;
      text-align: left;
      float: none;
    }

    li a {
      text-decoration: none;
      color: black;
    }

    li:hover {
      background-color: #f1f1f1
    }
  }

  li:hover, li.opened{
    .subMenu {
      display: block;
    }
  }
}
</style>
