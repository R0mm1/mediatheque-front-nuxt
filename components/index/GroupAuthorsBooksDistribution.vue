<template>
  <Group>
    <template #group_name>
      {{ $t('home.group_authors_books_distribution.group_name') }}
    </template>
    <template #group_content>
      <div class="group-abd-pie-container">
        <div class="group-abd-pie-title">
          {{ $t('home.group_authors_books_distribution.chart_title') }}
        </div>
        <VerticalBarChart v-if="!isLoading" :key="chartKey" :chart-data="chartData" :chart-options="chartOptions" />
      </div>
    </template>
  </Group>
</template>

<script>
import { container } from 'tsyringe'
import Group from '~/components/page/Group.vue'
import RequestService from '~/assets/ts/service/RequestService'

export default {
  name: 'GroupAuthorsBooksDistribution',
  components: { Group },
  data () {
    return {
      chartKey: 0,
      isLoading: true,
      chartData: {
        datasets: [{
          data: [],
          backgroundColor: []
        }],
        labels: []
      },
      chartOptions: {
        maintainAspectRatio: false,
        legend: { display: false }
      }
    }
  },
  mounted () {
    const requestService = container.resolve(RequestService)
    const request = requestService.createRequest('/stats')
    request.setQueryParams({
      authorsBooksDistribution: ''
    })
    requestService.execute(request)
      .then((data) => {
        const stats = data['hydra:member'][0]
        if (typeof stats === 'undefined') {
          this.$toasted.error(this.$t('home.group_authors_books_distribution.api_error').toString())
          return Promise.reject(new Error('Stats service returned empty data'))
        }
        return Promise.resolve(stats.stats)
      })
      .then((data) => {
        const tintFactor = 0.1
        let red = 52
        let green = 39
        let blue = 25
        let iteration = 1

        data.authorsBooksDistribution
          .sort((first, second) => {
            return second.booksCount - first.booksCount
          })
          .slice(0, 10)
          .forEach((entry) => {
            this.chartData.datasets[0].data.push(entry.booksCount)
            this.chartData.datasets[0].backgroundColor.push('rgba(' + red + ',' + green + ',' + blue + ')')
            this.chartData.labels.push(entry.firstname + ' ' + entry.lastname)

            const weight = (tintFactor * (iteration / 5))
            red = red + (255 - red) * weight
            green = green + (255 - green) * weight
            blue = blue + (255 - blue) * weight
            iteration++
          })
        this.chartKey++
        this.isLoading = false
      })
      .catch(error => console.error(error))
  }
}
</script>

<style scoped lang="scss">
    .group-abd-pie-container {
        position: relative;
        width: 400px;
        height: 300px;
    }

    .group-abd-pie-title {
        font-size: .8rem;
        text-align: center;
        width: 100%;
    }
</style>
