<template>
  <Group>
    <template #group_name>
      {{ $t('home.group_entities_count.group_name') }}
    </template>
    <template #group_content>
      <div id="group-entities-count">
        <div id="books-count" class="count-block">
          <div id="count-total" class="count-number">
            {{ bookTotal }}
            <span>{{ $t('home.group_entities_count.books') }}</span>
          </div>
          <div id="count-detail">
            <div class="count-number">
              {{ bookElectronic }}
              <span>{{ $t('home.group_entities_count.book_electronics') }}</span>
            </div>
            <div class="count-number">
              {{ bookPaper }}
              <span>{{ $t('home.group_entities_count.book_papers') }}</span>
            </div>
            <div class="count-number">
              {{ bookAudio }}
              <span>{{ $t('home.group_entities_count.book_audios') }}</span>
            </div>
          </div>
        </div>
        <div id="authors-count" class="count-block">
          <div class="count-number">
            {{ author }}
            <span>{{ $t('home.group_entities_count.authors') }}</span>
          </div>
        </div>
      </div>
    </template>
  </Group>
</template>

<script>
import { container } from 'tsyringe'
import anime from 'animejs'
import Group from '~/components/page/Group.vue'
import RequestService from '~/assets/ts/service/RequestService'

export default {
  name: 'GroupEntitiesCount',
  components: { Group },
  data () {
    return {
      bookTotal: 0,
      bookElectronic: 0,
      bookPaper: 0,
      bookAudio: 0,
      author: 0
    }
  },
  mounted () {
    const requestService = container.resolve(RequestService)
    const request = requestService.createRequest('/stats')
    request.setQueryParams({
      authorsCount: '',
      booksCount: ''
    })
    requestService.execute(request)
      .then((data) => {
        const stats = data['hydra:member'][0]
        if (typeof stats === 'undefined') {
          this.$toasted.error(this.$t('home.group_entities_count.api_error').toString())
          return Promise.reject(new Error('Stats service returned empty data'))
        }
        return Promise.resolve(stats.stats)
      })
      .then((data) => {
        const animParams = {
          targets: this,
          round: 1,
          easing: 'cubicBezier(0.095, 0.855, 0.000, 0.990)',
          duration: 1500
        }

        anime({
          ...animParams,
          bookTotal: data.booksCount.total
        })

        anime({
          ...animParams,
          bookPaper: data.booksCount.paper
        })

        anime({
          ...animParams,
          bookElectronic: data.booksCount.electronic
        })

        anime({
          ...animParams,
          bookAudio: data.booksCount.audio
        })

        anime({
          ...animParams,
          author: data.authorsCount
        })
      })
      .catch(error => console.error(error))
  }
}
</script>

<style scoped lang="scss">
@import 'assets/scss/colors';

#group-entities-count {
  display: flex;
  justify-content: space-around;
}

.count-block {
  font-size: 2rem;
  width: 175px;
  height: 175px;
  text-align: center;
  border: 1px solid $shade0;
  border-radius: 5px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  justify-content: center;

  .count-number {
    display: flex;
    flex-direction: column;

    span {
      font-size: .9rem;
      color: $textDisabled;
    }
  }

  #count-detail{
    display: flex;
    justify-content: space-around;
    border-top: 1px solid $shade0;
    margin-top: 7px;
    padding-top: 7px;

    .count-number:not(:first-of-type){
      margin-left: 15px;
    }
   }
}
</style>
