<template>
  <Group>
    <template #group_name>
      J'ai lu ce livre
    </template>
    <template #group_content>
      <div id="loader-container">
        <Loader v-if="isNotationLoading" type="s"/>
      </div>
      <client-only>
        <StarsRatings
          v-if="!isNotationLoading"
          :rating="cNote"
          :star-size="20"
          :max-rating="10"
          @rating-selected="value => note = value"
        />
      </client-only>
    </template>
  </Group>
</template>

<script>
import Group from '@/components/page/Group'
import Loader from '@/components/widgets/Loader'

export default {
  name: 'GroupBookRead',
  components: {
    Loader,
    Group
  },
  props: {
    bookModule: {
      type: Object,
      required: true
    }
  },
  data () {
    return {
      isNotationLoading: true,
      note: null // Value can be null if not loaded yet, -1 if it doesn't exist, the note value otherwise
    }
  },
  computed: {
    cNote () {
      return Math.max(this.note, 0)
    }
  },
  watch: {
    note (newValue, oldValue) {
      if (oldValue === null) {
        return
      }

      this.isNotationLoading = true
      this.bookModule.updateNote(newValue)
        .then((bookNotation) => {
          this.note = bookNotation.note
          this.isNotationLoading = false
        })
        .catch((error) => {
          this.$toasted.show('Une erreur est survenue lors de l\'enregistrement de la note', {
            ...this.$config.default.notification_settings,
            type: 'error',
            icon: 'fa-times'
          })
          console.error(error)
          this.isNotationLoading = false
        })
    }
  },
  created () {
    this.bookModule.getNotation()
      .then((notation) => {
        this.note = notation ? notation.note : -1 // If the notation doesn't exist we initialize it to -1 to indicate it's loaded
        this.isNotationLoading = false
      })
      .catch((error) => {
        this.$toasted.show('Une erreur est survenue lors du chargement de la note', {
          ...this.$config.default.notification_settings,
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
#loader-container {
  width: 100%;
  text-align: center;

  img {
    width: 50px;
  }
}
</style>
