<template>
  <form @submit.prevent="absenden" class="formular">
    <h2>{{ istBearbeiten ? 'Rezept bearbeiten' : 'Neues Rezept erstellen' }}</h2>

    <input v-model="form.name" placeholder="Name" required />
    <select v-model="form.kategorie" required>
      <option disabled value="">Kategorie wählen</option>
      <option>Italienisch</option>
      <option>Asiatisch</option>
      <option>Orientalisch</option>
      <option>Vegetarisch</option>
      <option>Mexikanisch</option>
      <option>Indisch</option>
      <option>Französisch</option>
      <option>Vegan</option>
      <option>Glutenfrei</option>
      <option>Suppe</option>
      <option>Dessert</option>
    </select>
    <input v-model="form.bild" placeholder="Bilddateiname (z. B. pizza.jpg)" />
    <textarea v-model="form.beschreibung" placeholder="Beschreibung + Kochanleitung" required></textarea>

    <h4>Zutaten:</h4>
    <div v-for="(z, index) in form.zutaten" :key="index" class="zutat-row">
      <input v-model="z.menge" placeholder="Menge (g/ml)" />
      <input v-model="z.name" placeholder="Zutat" />
      <button type="button" @click="form.zutaten.splice(index, 1)">❌</button>
    </div>
    <button type="button" @click="neueZutat()">➕ Zutat</button>

    <h4>Nährwerte:</h4>
    <input type="number" v-model.number="form.naehrwerte.kalorien" placeholder="Kalorien (kcal)" />
    <input type="number" v-model.number="form.naehrwerte.eiweiss" placeholder="Eiweiß (g)" />
    <input type="number" v-model.number="form.naehrwerte.fett" placeholder="Fett (g)" />
    <input type="number" v-model.number="form.naehrwerte.kohlenhydrate" placeholder="Kohlenhydrate (g)" />

    <div class="form-buttons">
      <button type="submit">Speichern</button>
      <button type="button" @click="$emit('abbrechen')">❌ Abbrechen</button>
    </div>
  </form>
</template>

<script setup>
import { ref, watch } from 'vue'
import axios from 'axios'
import { useRezeptStore } from '@/stores/rezepte'

const rezeptStore = useRezeptStore()

const props = defineProps({
  rezept: Object // optional
})

const emit = defineEmits(['abbrechen', 'gespeichert'])

const form = ref({
  name: '',
  kategorie: '',
  bild: '',
  beschreibung: '',
  favorit: false,
  zutaten: [
    { name: '', menge: '', kategorie: '', symbol: '', kochanleitung: '' }
  ],
  naehrwerte: {
    kalorien: null,
    eiweiss: null,
    fett: null,
    kohlenhydrate: null
  }
})

// Bearbeitungsmodus erkennen
const istBearbeiten = ref(false)

watch(
  () => props.rezept,
  (neues) => {
    if (neues) {
      form.value = JSON.parse(JSON.stringify(neues))
      istBearbeiten.value = true
    }
  },
  { immediate: true }
)

function neueZutat() {
  form.value.zutaten.push({
    name: '',
    menge: '',
    kategorie: '',
    symbol: '',
    kochanleitung: ''
  })
}

async function absenden() {
  const rezept = {
    ...form.value,
    bild: form.value.bild || 'standard.jpg',
    zutaten: form.value.zutaten.filter(z => z.name && z.menge)
  }

  try {
    if (istBearbeiten.value) {
      await axios.put(`http://localhost:8080/rezepte/${rezept.id}`, rezept)
      rezeptStore.rezepte = rezeptStore.rezepte.map(r => r.id === rezept.id ? rezept : r)
      alert('Rezept aktualisiert!')
    } else {
      const res = await axios.post('http://localhost:8080/rezepte', rezept)
      rezeptStore.rezepte.push(res.data)
      alert('Rezept erstellt!')
    }
    emit('gespeichert')
  } catch (error) {
    console.error('❌ Fehler:', error.response?.data || error.message)
    alert('❌ Fehler beim Speichern')
  }
}
</script>

<style scoped>
.formular {
  background: var(--color-soft);
  padding: 1.5rem;
  border-radius: var(--card-radius);
  margin-top: 2rem;
}
input, textarea, select {
  width: 100%;
  margin: 0.5rem 0;
  padding: 10px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
}
.zutat-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
  margin-bottom: 0.5rem;
}
button {
  padding: 10px 20px;
  background: var(--color-accent);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  margin-top: 1rem;
  cursor: pointer;
}
.form-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}
</style>
