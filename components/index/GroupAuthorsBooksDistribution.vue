<template>
  <Group>
    <template #group_name>
      Top 10 des auteurs dans la base
    </template>
    <template #group_content>
      <div class="group-abd-pie-container">
        <div class="group-abd-pie-title">
          Les auteurs les plus présents dans la base, par nombre de livres
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
          this.$toasted.error('La récupération de la répartition des livres par auteur a échoué')
          return Promise.reject(new Error('Stats service returned empty data'))
        }
        return Promise.resolve(stats.stats)
      })
      .then((data) => {
        let red = 4.1
        let green = 3.8
        let blue = 2.8

        data.authorsBooksDistribution
          .sort((first, second) => {
            return second.booksCount - first.booksCount
          })
          .slice(0, 10)
          .forEach((entry) => {
            this.chartData.datasets[0].data.push(entry.booksCount)
            this.chartData.datasets[0].backgroundColor.push('rgba(' + red + ',' + green + ',' + blue + ')')
            this.chartData.labels.push(entry.firstname + ' ' + entry.lastname)

            red = red * 1.50
            green = green * 1.50
            blue = blue * 1.50
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
