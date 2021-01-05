<template>
  <Group>
    <template v-slot:group_name>
      J'ai lu ce livre
    </template>
    <template v-slot:group_content>
      <div id="loader-container">
        <Loader v-if="isNotationLoading" type="s" />
      </div>
      <client-only>
        <vue-stars v-if="!isNotationLoading" v-model="cNote" :max="10">
          <template v-slot:activeLabel>
            <i class="fas fa-star" />
          </template>
          <template v-slot:inactiveLabel>
            <i class="far fa-star" />
          </template>
        </vue-stars>
      </client-only>
    </template>
  </Group>
</template>

<script>
import Group from '@/components/page/Group'
import Loader from '@/components/widgets/Loader'

const config = require('@/mediatheque')

export default {
  name: 'GroupBookRead',
  components: { Loader, Group },
  props: { bookModule: { type: Object, required: true } },
  data () {
    return {
      isNotationLoading: true,
      note: 0
    }
  },
  computed: {
    cNote: {
      get () {
        return this.note
      },
      set (value) {
        this.isNotationLoading = true
        this.bookModule.updateNote(value)
          .then((bookNotation) => {
            this.note = bookNotation.note
            this.isNotationLoading = false
          })
          .catch((error) => {
            this.$toasted.show("Une erreur est survenue lors de l'enregistrement de la note", {
              ...config.default.notification_settings,
              type: 'error',
              icon: 'fa-times'
            })
            console.error(error)
            this.isNotationLoading = false
          })
      }
    }
  },
  created () {
    this.bookModule.getNotation()
      .then((notation) => {
        if (notation !== null) {
          this.note = notation.note
        }
        this.isNotationLoading = false
      })
      .catch((error) => {
        this.$toasted.show('Une erreur est survenue lors du chargement de la note', {
          ...config.default.notification_settings,
          type: 'error',
          icon: 'fa-times'
        })
        console.error(error)
        this.isNotationLoading = false
      })
  }
}
</script>

<style scoped lang="scss">
  #loader-container{
    width: 100%;
    text-align: center;

    img{
      width: 50px;
    }
  }
</style>
