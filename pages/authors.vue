<template>
  <div>
    <List
      ref="list"
      api-endpoint="/authors"
      :cols="cols"
      :callback="setAuthor"
      name="author"
      @list-action-add="newAuthor"
    />
  </div>
</template>

<script>
import Column from 'assets/ts/list/Column'
import List from '@/components/list/List'
import DataSubProperty from 'assets/ts/list/DataSubProperty'

export default {
  name: 'Authors',
  components: {
    List
  },
  layout (context) {
    return context.$device.isMobile ? 'mobile-layout-with-menu' : 'default'
  },
  data () {
    return {
      cols: [
        new Column('person', 'Nom')
          .setSearchParameterName('person.lastname')
          .setOrderParameterName('person.lastname')
          .setSubProperties([new DataSubProperty('lastname')])
          .setUid('lastname'),
        new Column('person', 'Prénom')
          .setSearchParameterName('person.firstname')
          .setOrderParameterName('person.firstname')
          .setSubProperties([new DataSubProperty('firstname')])
          .setUid('firstname')
      ]
    }
  },
  methods: {
    setAuthor (author) {
      window.location.href = '/author/' + author.id
    },
    newAuthor () {
      window.location.href = '/author/'
    }
  }
}
</script>

<style scoped>

</style>
