<template>
  <div v-if="hasData" class="chart-wrapper">
    <Bar :data="chartData" :options="chartOptions" />
  </div>
  <div v-else class="empty-info">Keine Kaloriendaten verfügbar.</div>
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
  daten: {
    type: Array,
    default: () => [] // erwartet: [{ name: 'Rezeptname', kcal: 320 }, ...]
  }
})

// Buckets mit Rezepten
const bucketLabels = ['0–199 kcal', '200–399 kcal', '400–599 kcal', '600+ kcal']
const buckets = {
  '0–199 kcal': [],
  '200–399 kcal': [],
  '400–599 kcal': [],
  '600+ kcal': []
}

for (const eintrag of props.daten) {
  const kcal = eintrag.kcal || 0
  const name = eintrag.name || 'Unbekannt'

  if (kcal < 200) buckets['0–199 kcal'].push(name)
  else if (kcal < 400) buckets['200–399 kcal'].push(name)
  else if (kcal < 600) buckets['400–599 kcal'].push(name)
  else buckets['600+ kcal'].push(name)
}

const hasData = props.daten.length > 0

const chartData = {
  labels: bucketLabels,
  datasets: [
    {
      label: 'Rezepte nach Kalorien',
      data: bucketLabels.map(label => buckets[label].length),
      backgroundColor: '#34d399'
    }
  ]
}

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { display: false },
    title: {
      display: true,
      text: 'Kalorienverteilung'
    },
    tooltip: {
      callbacks: {
        label: function (ctx) {
          const label = ctx.dataset.label || ''
          const bucket = ctx.label
          const namen = buckets[bucket]
          return [`${label}: ${namen.length}`, ...namen.map(n => `• ${n}`)]
        }
      }
    }
  },
  scales: {
    y: { beginAtZero: true }
  }
}
</script>

<style scoped>
.chart-wrapper {
  margin-top: 2rem;
}
.empty-info {
  text-align: center;
  font-style: italic;
  color: #888;
  margin-top: 2rem;
}
</style>
