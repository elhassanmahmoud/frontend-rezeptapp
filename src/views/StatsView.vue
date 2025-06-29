<template>
  <section class="stats">
    <h1>Rezept-Statistiken</h1>

    <!-- Rezeptauswahl -->
    <div class="auswahl">
      <label for="rezeptSelect">Rezept auswählen:</label>
      <select id="rezeptSelect" v-model="ausgewaehltName">
        <option disabled value="">-- Bitte wählen --</option>
        <option v-for="r in alle" :key="r.id" :value="r.name">
          {{ r.name }}
        </option>
      </select>
    </div>

    <!-- Nährwerte (oben!) -->
    <div class="summary-box" v-if="naehrwerte">
      <h2>Nährwerte: {{ ausgewaehltName }}</h2>
      <ul>
        <li><strong>Kalorien:</strong> {{ naehrwerte.kcal }} kcal</li>
        <li><strong>Eiweiß:</strong> {{ naehrwerte.eiweiss }} g</li>
        <li><strong>Fett:</strong> {{ naehrwerte.fett }} g</li>
        <li><strong>Kohlenhydrate:</strong> {{ naehrwerte.kohlenhydrate }} g</li>
      </ul>
    </div>

    <!-- Makronährstoff-Verteilung -->
    <ChartMakronaehrstoffe v-if="naehrwerte" :daten="naehrwerte" />

    <!-- Allgemeine Charts -->
    <ChartKategorien :daten="kategorien" />
    <ChartFavoriten :daten="favoritenDaten" />
    <ChartKalorien :daten="kalorienMitNamen" />
  </section>
</template>

<script setup>
import { useRezeptStore } from '@/stores/rezepte'
import { computed, ref } from 'vue'

import ChartKategorien from '@/components/ChartKategorien.vue'
import ChartFavoriten from '@/components/ChartFavoriten.vue'
import ChartMakronaehrstoffe from '@/components/ChartMakronaehrstoffe.vue'
import ChartKalorien from '@/components/ChartKalorien.vue'

const rezeptStore = useRezeptStore()
const alle = computed(() => rezeptStore.rezepte)
const favoriten = computed(() => alle.value.filter(r => r.favorit))
const nichtFavoriten = computed(() => alle.value.filter(r => !r.favorit))
const ausgewaehltName = ref('')

const ausgewaehltesRezept = computed(() =>
  alle.value.find(r => r.name === ausgewaehltName.value)
)

const naehrwerte = computed(() => {
  const r = ausgewaehltesRezept.value
  if (!r || !r.naehrwerte) return null
  return {
    kcal: r.naehrwerte.kalorien || 0,
    eiweiss: r.naehrwerte.eiweiss || 0,
    fett: r.naehrwerte.fett || 0,
    kohlenhydrate: r.naehrwerte.kohlenhydrate || 0
  }
})

// Kategorieübersicht
const kategorien = computed(() => {
  const stats = {}
  for (const rezept of alle.value) {
    const kat = rezept.kategorie || 'Unbekannt'
    stats[kat] = (stats[kat] || 0) + 1
  }
  return stats
})

//  Favoriten mit Namen für Tooltip in ChartFavoriten.vue
const favoritenDaten = computed(() => ({
  favoriten: favoriten.value.map(r => ({ name: r.name })),
  andere: nichtFavoriten.value.map(r => ({ name: r.name }))
}))

// ⚠ Für ChartKalorien: Liste { kcal, name }
const kalorienMitNamen = computed(() =>
  alle.value
    .filter(r => r.naehrwerte && typeof r.naehrwerte.kalorien === 'number')
    .map(r => ({
      name: r.name,
      kcal: r.naehrwerte.kalorien
    }))
)
</script>

<style scoped>
.stats {
  max-width: 700px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fdfdfd;
  border-radius: 16px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
}

.auswahl {
  margin-bottom: 1.5rem;
}

.auswahl select {
  margin-top: 0.5rem;
  padding: 0.5rem;
  width: 100%;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 1rem;
}

.summary-box {
  margin: 1rem 0 2rem;
  padding: 1rem 1.5rem;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 12px;
}

.summary-box h2 {
  margin-bottom: 0.5rem;
  font-size: 1.2rem;
}

.summary-box ul {
  padding-left: 1rem;
}

.summary-box li {
  margin-bottom: 0.3rem;
}
</style>
