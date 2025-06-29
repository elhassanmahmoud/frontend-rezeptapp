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
  daten: Object // Erwartet { favoriten: [...], andere: [...] }
})

const chartData = {
  labels: ['Favoriten', 'Andere'],
  datasets: [
    {
      label: 'Favoritenverteilung',
      data: [props.daten.favoriten.length, props.daten.andere.length],
      backgroundColor: ['#10b981', '#e5e7eb'], // grün + grau
      borderWidth: 1
    }
  ]
}

const chartOptions = {
  responsive: true,
  cutout: '60%',
  plugins: {
    legend: {
      position: 'bottom'
    },
    title: {
      display: true,
      text: 'Favoriten vs. Nicht-Favoriten'
    },
    tooltip: {
      callbacks: {
        label: function (tooltipItem) {
          const index = tooltipItem.dataIndex
          const liste = index === 0 ? props.daten.favoriten : props.daten.andere
          const namen = liste.map(r => `• ${r.name}`)
          return [`Rezepte: ${liste.length}`, ...namen]
        }
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
