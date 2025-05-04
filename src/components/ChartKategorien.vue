<template>
  <div class="chart-wrapper">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
</template>

<script setup>
import { Bar } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale
} from 'chart.js'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const props = defineProps({
  daten: Object
})

const chartData = {
  labels: Object.keys(props.daten),
  datasets: [
    {
      label: 'Rezepte pro Kategorie',
      data: Object.values(props.daten),
      backgroundColor: '#4ade80'
    }
  ]
}

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top'
    },
    title: {
      display: true,
      text: 'Kategorienübersicht'
    }
  }
}
</script>

<style scoped>
.chart-wrapper {
  margin-top: 2rem;
}
</style>
