<!-- src/views/HomeView.vue -->
<template>
  <section class="home">
    <h1>Willkommen in der Rezeptwelt</h1>

    <!-- 1. Button zum Ein-/Ausblenden des Formulars -->
    <div class="create-toggle">
      <button @click="zeigeFormular = !zeigeFormular">
        {{ zeigeFormular ? '✖️ Formular verbergen' : '➕ Neues Rezept erstellen' }}
      </button>
    </div>

    <!-- 2. Formular einbinden -->
    <RezeptFormular
      v-if="zeigeFormular"
      @neues-rezept="onRezeptErstellen"
    />

    <!-- 3. Filter-Bereich bleibt unverändert -->
    <div class="filter-container" v-if="!zeigeFormular">
      <input
        v-model="suche"
        placeholder="🔍 Suche nach Namen..."
        class="search"
      />
      <select v-model="kategorieFilter" class="filter-dropdown">
        <option value="">Alle Kategorien</option>
        <option v-for="k in kategorien" :key="k" :value="k">{{ k }}</option>
      </select>
    </div>

    <!-- 4. Ergebnis-Liste -->
    <p v-if="!zeigeFormular">
      Anzahl gefilterter Rezepte: {{ gefilterteRezepte.length }}
    </p>
    <RezeptListe
      v-if="!zeigeFormular"
      :rezepte="gefilterteRezepte"
    />
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRezeptStore } from '@/stores/rezepte'
import RezeptListe from '@/components/RezeptListe.vue'
import RezeptFormular from '@/components/RezeptFormular.vue'

const rezeptStore     = useRezeptStore()
const zeigeFormular  = ref(false)
const suche          = ref('')
const kategorieFilter= ref('')

// Feste Kategorien-Liste
const kategorien = [
  'Italienisch',
  'Asiatisch',
  'Orientalisch',
  'Vegetarisch'
]

// beim Mount Rezepte vom Backend laden
onMounted(() => {
  rezeptStore.ladeRezepteVomBackend()
})

const gefilterteRezepte = computed(() =>
  rezeptStore.rezepte.filter(r => {
    const passtSuche      = r.name.toLowerCase().includes(suche.value.toLowerCase())
    const passtKategorie  = !kategorieFilter.value || r.kategorie === kategorieFilter.value
    return passtSuche && passtKategorie
  })
)

// Handler, wenn Formular ein neues Rezept liefert
async function onRezeptErstellen(neuesRezept) {
  // Rezept in Backend speichern
  await rezeptStore.rezeptSpeichernBeimBackend(neuesRezept)

  // ✅ Danach komplette Liste neu laden, um Datenkonsistenz sicherzustellen
  await rezeptStore.ladeRezepteVomBackend()

  // Formular schließen
  zeigeFormular.value = false

  // Filter zurücksetzen
  suche.value = ''
  kategorieFilter.value = ''
}
</script>

<style scoped>
.create-toggle {
  margin: 1rem 0;
}
.create-toggle button {
  background: var(--color-accent);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
}
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
