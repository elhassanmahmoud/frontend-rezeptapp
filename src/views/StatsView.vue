<template>
  <section class="stats">
    <h1> Koch-Statistiken</h1>

    <ul class="stat-list">
      <li> Anzahl aller Rezepte: {{ alle.length }}</li>
      <li> Favoriten: {{ favoriten.length }}</li>
      <li> Kategorien:
        <ul>
          <li v-for="(anzahl, kat) in kategorien" :key="kat">
            {{ kat }}: {{ anzahl }}
          </li>
        </ul>
      </li>
    </ul>

    <!-- Diagramme -->
    <ChartKategorien :daten="kategorien" />
    <ChartFavoriten :daten="favoritenDaten" />
    <ChartTageszeit :daten="tageszeitDaten" />
  </section>
</template>

<script setup>
import { useRezeptStore } from '@/stores/rezepte'
import { computed } from 'vue'
import ChartKategorien from '@/components/ChartKategorien.vue'
import ChartFavoriten from '@/components/ChartFavoriten.vue'
import ChartTageszeit from '@/components/ChartTageszeit.vue' // ✅ NEU

const rezeptStore = useRezeptStore()
const alle = computed(() => rezeptStore.rezepte)
const favoriten = computed(() => alle.value.filter(r => r.favorit))

const kategorien = computed(() => {
  const stats = {}
  for (const rezept of alle.value) {
    const kat = rezept.kategorie || 'Unbekannt'
    stats[kat] = (stats[kat] || 0) + 1
  }
  return stats
})

const favoritenDaten = computed(() => {
  return {
    favoriten: favoriten.value.length,
    andere: alle.value.length - favoriten.value.length
  }
})

// ✅ Tageszeit-Daten aus Kategorie ableiten
const tageszeitDaten = computed(() => {
  const stats = {
    Frühstück: 0,
    Mittagessen: 0,
    Abendessen: 0,
    Dessert: 0,
    Unbekannt: 0
  }

  for (const rezept of alle.value) {
    const k = rezept.kategorie?.toLowerCase() || ''
    if (k.includes('frühstück')) stats.Frühstück++
    else if (k.includes('mittag')) stats.Mittagessen++
    else if (k.includes('abend')) stats.Abendessen++
    else if (k.includes('dessert')) stats.Dessert++
    else stats.Unbekannt++
  }

  return stats
})
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

.stat-list {
  list-style: none;
  padding-left: 0;
}

.stat-list li {
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.stat-list ul {
  margin-top: 0.5rem;
  padding-left: 1.5rem;
}
</style>
