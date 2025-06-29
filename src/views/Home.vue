<template>
  <section class="home">
    <h1>Willkommen in der Rezeptwelt</h1>

    <!-- Filterbereich -->
    <div class="filter-container">
      <input
        v-model="suche"
        placeholder="Suche nach Rezeptname..."
        class="search"
      />
      <select v-model="kategorieFilter" class="filter-dropdown">
        <option value="">Alle Kategorien</option>
        <option v-for="k in kategorien" :key="k" :value="k">{{ k }}</option>
      </select>
    </div>

    <p>Anzahl gefilterter Rezepte: {{ gefilterteRezepte.length }}</p>

    <!-- Rezeptliste -->
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

const kategorien = [
  'Italienisch',
  'Asiatisch',
  'Orientalisch',
  'Vegetarisch',
  'Mexikanisch',
  'Indisch',
  'Französisch',
  'Vegan',
  'Glutenfrei',
  'Suppe',
  'Dessert'
]

const gefilterteRezepte = computed(() => {
  return rezeptStore.rezepte.filter(r => {
    const passtSuche = r.name?.toLowerCase().includes(suche.value.toLowerCase()) || false
    const passtKategorie = !kategorieFilter.value || r.kategorie === kategorieFilter.value
    return passtSuche && passtKategorie
  })
})

onMounted(() => {
  rezeptStore.ladeRezepteVomBackend()
})
</script>

<style scoped>
.filter-container {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}
.search {
  flex: 1;
}
.filter-dropdown {
  width: 200px;
}
</style>
