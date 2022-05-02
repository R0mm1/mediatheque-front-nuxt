<template>
  <client-only>
    <div>
      <List
        ref="list"
        api-endpoint="/authors"
        :cols="cols"
        :callback="setAuthor"
        @list-action-add="newAuthor"
      />
    </div>
  </client-only>
</template>

<script>
import Column from 'assets/ts/list/Column'
import List from '@/components/list/List'
export default {
  name: 'Authors',
  components: {
    List
  },
  data () {
    return {
      cols: [
        new Column('lastname', 'Nom'),
        new Column('firstname', 'Prénom')
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
