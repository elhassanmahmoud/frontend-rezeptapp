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
      label: 'Rezepte pro Tageszeit',
      data: Object.values(props.daten),
      backgroundColor: '#60a5fa'
    }
  ]
}

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      display: false
    },
    title: {
      display: true,
      text: 'Rezeptverteilung nach Tageszeit'
    }
  }
}
</script>

<style scoped>
.chart-wrapper {
  margin-top: 2rem;
}
</style>
