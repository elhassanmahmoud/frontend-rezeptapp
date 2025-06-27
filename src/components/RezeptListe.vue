<template>
  <div class="rezeptliste">
    <div class="favoriten-toggle" v-if="userStore.user">
      <button @click="zeigeNurFavoriten = !zeigeNurFavoriten">
        {{ zeigeNurFavoriten ? '🔄 Alle anzeigen' : '❤️ Nur Favoriten' }}
      </button>
    </div>

    <div class="export-button" v-if="userStore.user">
      <button @click="exportiereAlsPDF">📄 Als PDF exportieren</button>
    </div>

    <p>Anzahl gefilterter Rezepte: {{ gefiltert.length }}</p>
    <p v-if="gefiltert.length === 0">🚫 Keine passenden Rezepte gefunden.</p>

    <div v-for="r in gefiltert" :key="r.id" class="card">
      <img :src="`/assets/${r.bild}`" :alt="r.name" />
      <h3>{{ r.name }} <small>({{ r.kategorie }})</small></h3>
      <p>{{ r.beschreibung }}</p>

      <!-- Zutatenliste -->
      <ul class="zutaten" v-if="Array.isArray(r.zutaten)">
        <li v-for="zutat in r.zutaten" :key="zutat.name">
          🧂 {{ zutat.menge }} {{ zutat.name }}
        </li>
      </ul>

      <!-- Nährwerte -->
      <div class="naehrwerte" v-if="r.naehrwerte && typeof r.naehrwerte === 'object'">
        📦 Kalorien: {{ r.naehrwerte.kalorien || '?' }} kcal |
        Eiweiß: {{ r.naehrwerte.eiweiss || '?' }} g |
        Fett: {{ r.naehrwerte.fett || '?' }} g |
        Kohlenhydrate: {{ r.naehrwerte.kohlenhydrate || '?' }} g
      </div>

      <!-- ✅ Buttons: Favorit, Bearbeiten, Löschen -->
      <div class="button-row" v-if="userStore.user">
        <button @click="favoritWechseln(r.id)" :class="{ aktiv: r.favorit }">
          {{ r.favorit ? '💖 Favorit' : '🤍 Merken' }}
        </button>
        <button @click="bearbeiten(r)">✏️ Bearbeiten</button>
        <button @click="loeschen(r.id)">🗑️ Löschen</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps } from 'vue'
import { useRezeptStore } from '@/stores/rezepte'
import { useUserStore } from '@/stores/user'
import jsPDF from 'jspdf'

const props = defineProps({
  filter: String,
  kategorie: String
})

const rezeptStore = useRezeptStore()
const userStore = useUserStore()
const zeigeNurFavoriten = ref(false)

const gefiltert = computed(() => {
  const suchbegriff = props.filter?.toLowerCase() || ''
  const kategorie = props.kategorie || ''

  return rezeptStore.rezepte.filter(r => {
    const passtZurSuche =
      (r.name?.toLowerCase().includes(suchbegriff) || false) ||
      (r.kategorie?.toLowerCase().includes(suchbegriff) || false)

    const passtZurKategorie = !kategorie || r.kategorie === kategorie
    const istFavorit = !zeigeNurFavoriten.value || r.favorit

    return passtZurSuche && passtZurKategorie && istFavorit
  })
})

function favoritWechseln(id) {
  rezeptStore.favoritToggle(id)
}

function bearbeiten(rezept) {
  alert(`✏️ Bearbeiten: ${rezept.name}\n\n➡️ Hier kannst du später ein Bearbeitungsformular öffnen.`)
}

async function loeschen(id) {
  if (confirm('Möchtest du dieses Rezept wirklich löschen?')) {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/rezepte/${id}`, {
        method: 'DELETE'
      })
      if (!res.ok) throw new Error('Fehler beim Löschen')
      rezeptStore.rezepte = rezeptStore.rezepte.filter(r => r.id !== id)
      alert('✅ Rezept gelöscht')
    } catch (err) {
      console.error('Fehler beim Löschen:', err)
      alert('❌ Fehler beim Löschen')
    }
  }
}

async function exportiereAlsPDF() {
  // Optional: dein alter exportiereAlsPDF-Code bleibt wie er ist
}
</script>

<style scoped>
.favoriten-toggle,
.export-button {
  text-align: right;
  margin-bottom: 1rem;
}

.favoriten-toggle button,
.export-button button {
  padding: 8px 16px;
  background-color: #f9fafb;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
}

.card {
  background: var(--color-soft);
  padding: 1rem;
  border-radius: var(--card-radius);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 1.5rem;
}

.card img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 12px;
}

.button-row {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  flex-wrap: wrap;
}

.button-row button {
  padding: 6px 12px;
  font-size: 0.9rem;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background-color: #f9f9f9;
  cursor: pointer;
  transition: all 0.2s ease;
}

.button-row button:hover {
  background-color: #eaeaea;
}

.card button.aktiv {
  background-color: var(--color-accent);
  color: white;
}

.zutaten {
  margin-top: 0.5rem;
  padding-left: 1rem;
  font-size: 0.95rem;
  color: #555;
}

.naehrwerte {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  font-style: italic;
  color: #333;
}
</style>
