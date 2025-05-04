<template>
  <div class="chart-wrapper">
    <Doughnut :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Tooltip,
  Legend,
  ArcElement
} from 'chart.js'

ChartJS.register(Tooltip, Legend, ArcElement)

const props = defineProps({
  daten: Object
})

const chartData = {
  labels: ['Favoriten', 'Andere'],
  datasets: [
    {
      label: 'Favoritenverteilung',
      data: [props.daten.favoriten, props.daten.andere],
      backgroundColor: ['#4ade80', '#ddd']
    }
  ]
}

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom'
    },
    title: {
      display: true,
      text: 'Favoriten vs. Nicht-Favoriten'
    }
  }
}
</script>

<style scoped>
.chart-wrapper {
  margin-top: 2rem;
}
</style>
