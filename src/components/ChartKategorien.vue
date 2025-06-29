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

const sortedData = Object.entries(props.daten).sort((a, b) => b[1] - a[1])
const chartData = {
  labels: sortedData.map(entry => entry[0]),
  datasets: [
    {
      label: 'Rezepte pro Kategorie',
      data: sortedData.map(entry => entry[1]),
      backgroundColor: '#34d399' // Satteres Grün
    }
  ]
}

const chartOptions = {
  responsive: true,
  indexAxis: 'y', // horizontale Balken für bessere Lesbarkeit
  plugins: {
    legend: {
      position: 'top'
    },
    title: {
      display: true,
      text: 'Kategorienübersicht'
    },
    tooltip: {
      callbacks: {
        label: context => `${context.parsed.x} Rezepte`
      }
    }
  },
  scales: {
    x: {
      beginAtZero: true,
      ticks: {
        stepSize: 1
      }
    }
  }
}
</script>

<style scoped>
.chart-wrapper {
  margin-top: 2rem;
}
</style>
