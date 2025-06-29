<template>
  <div v-if="hasData" class="chart-wrapper">
    <Doughnut :data="chartData" :options="chartOptions" />
  </div>
  <div v-else class="empty-info">Keine Nährwertdaten verfügbar.</div>
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
  daten: Object // { eiweiss, fett, kohlenhydrate }
})

const hasData =
  props.daten.eiweiss > 0 ||
  props.daten.fett > 0 ||
  props.daten.kohlenhydrate > 0

const chartData = {
  labels: ['Eiweiß', 'Fett', 'Kohlenhydrate'],
  datasets: [
    {
      label: 'Makronährstoff-Anteile',
      data: [
        props.daten.eiweiss,
        props.daten.fett,
        props.daten.kohlenhydrate
      ],
      backgroundColor: ['#60a5fa', '#f87171', '#fbbf24']
    }
  ]
}

const chartOptions = {
  responsive: true,
  plugins: {
    legend: { position: 'bottom' },
    title: {
      display: true,
      text: 'Ø Makronährstoffverteilung'
    }
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
