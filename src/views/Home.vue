<template>
  <section class="home">
    <h1>Willkommen in der Rezeptwelt </h1>

    <div class="filter-container">
      <input v-model="suche" placeholder="🔍 Suche nach Namen..." class="search" />
      <select v-model="kategorieFilter" class="filter-dropdown">
        <option value="">Alle Kategorien</option>
        <option v-for="k in kategorien" :key="k" :value="k">{{ k }}</option>
      </select>
    </div>

    <p>Anzahl gefilterter Rezepte: {{ gefilterteRezepte.length }}</p>

    <RezeptListe :rezepte="gefilterteRezepte" />
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import RezeptListe from '@/components/RezeptListe.vue'
import { useRezeptStore } from '@/stores/rezepte'

const rezeptStore = useRezeptStore()
const suche = ref('')
const kategorieFilter = ref('')

// ✅ Feste Liste von Kategorien statt dynamisch
const kategorien = [
  'Italienisch',
  'Asiatisch',
  'Orientalisch',
  'Vegetarisch'
]

// Gefilterte Rezepte
const gefilterteRezepte = computed(() => {
  return rezeptStore.rezepte.filter(r => {
    const passtSuche = r.name.toLowerCase().includes(suche.value.toLowerCase())
    const passtKategorie = !kategorieFilter.value || r.kategorie === kategorieFilter.value
    return passtSuche && passtKategorie
  })
})

// Rezepte laden beim Start
onMounted(() => {
  rezeptStore.ladeRezepteVomBackend()
})
</script>
