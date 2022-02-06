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
        <VerticalBar v-if="!isLoading" :chartdata="chartData" :options="chartOptions" />
      </div>
    </template>
  </Group>
</template>

<script>
import { container } from 'tsyringe'
import Group from '~/components/page/Group.vue'
import VerticalBar from '~/components/widgets/charts/VerticalBar.vue'
import RequestService from '~/assets/ts/service/RequestService'

export default {
  name: 'GroupAuthorsBooksDistribution',
  components: { VerticalBar, Group },
  data () {
    return {
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
        let colorAlpha = 1
        data.authorsBooksDistribution
          .sort((first, second) => {
            return second.booksCount - first.booksCount
          })
          .slice(0, 10)
          .forEach((entry) => {
            this.chartData.datasets[0].data.push(entry.booksCount)
            this.chartData.datasets[0].backgroundColor.push('rgba(73,68,60,' + colorAlpha + ')')
            this.chartData.labels.push(entry.firstname + ' ' + entry.lastname)

            colorAlpha -= 0.1
          })
        this.isLoading = false
      })
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
