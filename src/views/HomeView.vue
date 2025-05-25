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

    <RezeptListe :filter="suche" :kategorie="kategorieFilter" />
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import RezeptListe from '@/components/RezeptListe.vue'
import { useRezeptStore } from '@/stores/rezepte'

const suche = ref('')
const kategorieFilter = ref('')
const rezeptStore = useRezeptStore()

const kategorien = computed(() => {
  const alle = rezeptStore.rezepte.map(r => r.kategorie)
  return [...new Set(alle)]
})

// 🔄 Rezepte vom Backend laden beim Öffnen der Seite - backend m3
onMounted(() => {
  rezeptStore.ladeRezepteVomBackend()
})
</script>

<style scoped>
.home {
  padding: 2rem;
  max-width: 960px;
  margin: auto;
}

.filter-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 2rem;
}

.search {
  padding: 10px 15px;
  border-radius: 10px;
  border: 1px solid var(--color-border);
  width: 100%;
}

.filter-dropdown {
  padding: 10px;
  border-radius: 10px;
  border: 1px solid var(--color-border);
  font-size: 1rem;
}
</style>
