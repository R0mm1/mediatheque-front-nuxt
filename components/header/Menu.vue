<template>
  <ul id="mainMenu">
    <li v-for="(menuItem, menuIndex) in menu" :key="menuIndex">
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
export default {
  name: 'Menu',
  data () {
    return {
      menu: [
        {
          label: 'Livres',
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

  .subMenu {
    padding: 0;
    margin: 16px 0 0px -16px;
    list-style-type: none;
    display: none;
    position: absolute;
    background-color: #eae3d6;
    min-width: 160px;
    z-index: 1;

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

  li:hover .subMenu {
    display: block;
  }
}
</style>
