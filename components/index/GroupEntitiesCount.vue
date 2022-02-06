<template>
  <Group>
    <template #group_name>
      Entités dans la base
    </template>
    <template #group_content>
      <div class="group-ec-books">
        <div class="book-total">
          {{ bookTotal }}
        </div>
        <div class="book-detail">
          <div class="electronic">
            {{ bookElectronic }}
          </div>
          <div class="paper">
            {{ bookPaper }}
          </div>
        </div>
        <div class="authors">
          {{ author }}
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
          author: data.authorsCount
        })
      })
  },
  methods: {
    formatNumber (value) {
      return value.toFixed(0)
    }
  }
}
</script>

<style scoped lang="scss">
@import 'assets/scss/colors';

.group-ec-books {
  font-size: 2rem;
  text-align: center;

  @mixin afterContent {
    display: block;
    font-size: .9rem;
    margin-top: -5px;
    color: $textDisabled;

    @content;
  }

  .book-total {
    border-bottom: 1px solid $shade2;

    &::after {
      @include afterContent {
        content: 'Livres';
      }
    }
  }

  .book-detail {
    display: flex;
    width: 100%;

    > div {
      flex-grow: 1;
    }

    .electronic::after {
      @include afterContent {
        content: 'Epub'
      }
    }

    .paper::after {
      @include afterContent {
        content: 'Papier'
      }
    }
  }

  .authors {
    margin-top: 1rem;

    &::after {
      @include afterContent {
        content: 'Auteurs';
      }
    }
  }
}
</style>
