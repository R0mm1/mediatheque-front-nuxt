import Vue from 'vue'
import { Bar } from 'vue-chartjs/legacy'
import { Chart, CategoryScale, LinearScale, BarElement } from 'chart.js'

Chart.register(CategoryScale, LinearScale, BarElement)

Vue.component(
  'VerticalBarChart',
  {
    extends: Bar,
    props: {
      chartData: {
        type: Object,
        default: () => {}
      },
      chartOptions: {
        type: Object,
        default: () => {}
      }
    },
    mounted () {
      this.renderChart(this.chartData, this.chartOptions)
    }
  }
)
