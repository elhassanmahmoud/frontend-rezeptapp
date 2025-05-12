<template>
  <form @submit.prevent="absenden" class="formular">
    <input v-model="name" placeholder="Name" required />
    <input v-model="kategorie" placeholder="Kategorie" required />
    <input v-model="bild" placeholder="Bilddateiname (z. B. pizza.jpg)" />
    <textarea v-model="beschreibung" placeholder="Beschreibung" required></textarea>

    <h4>Zutaten:</h4>
    <div v-for="(z, index) in zutaten" :key="index" class="zutat-row">
      <input v-model="z.menge" placeholder="Menge" />
      <input v-model="z.name" placeholder="Zutat" />
      <button type="button" @click="zutaten.splice(index, 1)">❌</button>
    </div>
    <button type="button" @click="zutaten.push({ name: '', menge: '' })">➕ Zutat</button>

    <h4>Nährwerte:</h4>
    <input type="number" v-model.number="naehrwerte.kalorien" placeholder="Kalorien (kcal)" />
    <input type="number" v-model.number="naehrwerte.eiweiss" placeholder="Eiweiß (g)" />
    <input type="number" v-model.number="naehrwerte.fett" placeholder="Fett (g)" />
    <input type="number" v-model.number="naehrwerte.kohlenhydrate" placeholder="Kohlenhydrate (g)" />

    <button>✅ Speichern</button>
  </form>
</template>

<script setup>
import { ref } from 'vue'
const emit = defineEmits(['neues-rezept'])

const name = ref('')
const kategorie = ref('')
const bild = ref('')
const beschreibung = ref('')

const zutaten = ref([{ name: '', menge: '' }])
const naehrwerte = ref({
  kalorien: null,
  eiweiss: null,
  fett: null,
  kohlenhydrate: null
})

function absenden() {
  emit('neues-rezept', {
    name: name.value,
    kategorie: kategorie.value,
    bild: bild.value || 'standard.jpg',
    beschreibung: beschreibung.value,
    zutaten: zutaten.value.filter(z => z.name && z.menge),
    naehrwerte: naehrwerte.value
  })

  // Felder zurücksetzen
  name.value = ''
  kategorie.value = ''
  bild.value = ''
  beschreibung.value = ''
  zutaten.value = [{ name: '', menge: '' }]
  naehrwerte.value = { kalorien: null, eiweiss: null, fett: null, kohlenhydrate: null }
}
</script>

<style scoped>
.formular {
  background: var(--color-soft);
  padding: 1.5rem;
  border-radius: var(--card-radius);
}

input, textarea {
  width: 100%;
  margin: 0.5rem 0;
  padding: 10px;
  border: 1px solid var(--color-border);
  border-radius: 8px;
}

.zutat-row {
  display: flex;
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
</style>
