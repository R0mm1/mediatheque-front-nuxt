<template>
  <ul id="mainMenu" ref="mainMenuRef">
    <li
      v-for="(menuItem, menuIndex) in menu"
      :id="'main_menu_'+menuIndex"
      :key="menuIndex"
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

<script setup lang="ts">
interface MenuItem {
  label: string
  opened: boolean
  children: Array<{
    label: string
    target: string
  }>
}

const mainMenuRef = ref<HTMLElement | null>(null)

const menu = ref<MenuItem[]>([
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
      },
      {
        label: 'Par groupes',
        target: '/groups'
      }
    ]
  }
])

const toggle = (index: number) => {
  menu.value[index].opened = !menu.value[index].opened
}

const close = (event: MouseEvent) => {
  let menuIndex: number | null = null
  const target = event.target as HTMLElement

  if (typeof target.id === 'string' && target.id.startsWith('main_menu_')) {
    menuIndex = parseInt(target.id.split('main_menu_')[1])
  }

  menu.value.forEach((menuItem, index) => {
    if (index === menuIndex) {
      return
    }
    menuItem.opened = false
  })
}

// Use click-outside composable to close menus when clicking outside
useClickOutside(mainMenuRef, close)
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
