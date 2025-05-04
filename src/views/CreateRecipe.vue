<template>
  <section class="create-recipe">
    <h1>📥 Neues Rezept erstellen</h1>
    <form @submit.prevent="rezeptSpeichern">
      <input v-model="name" type="text" placeholder="Name" required />
      <input v-model="kategorie" type="text" placeholder="Kategorie" required />
      <input v-model="bild" type="text" placeholder="Bilddateiname (z. B. pizza.jpg)" />
      <textarea v-model="beschreibung" placeholder="Beschreibung" required></textarea>
      <button type="submit">Speichern</button>
    </form>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRezeptStore } from '@/stores/rezepte'

const rezeptStore = useRezeptStore()

const name = ref('')
const kategorie = ref('')
const bild = ref('')
const beschreibung = ref('')

function rezeptSpeichern() {
  rezeptStore.rezeptHinzufuegen({
    name: name.value,
    kategorie: kategorie.value,
    bild: bild.value || 'standard.jpg',
    beschreibung: beschreibung.value
  })

  name.value = ''
  kategorie.value = ''
  bild.value = ''
  beschreibung.value = ''
}
</script>

<style scoped>
.create-recipe {
  max-width: 600px;
  margin: 2rem auto;
  padding: 2rem;
  background: #fdfdfd;
  border-radius: 16px;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.05);
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

input, textarea {
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
}

button {
  background-color: #4ade80;
  color: white;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  padding: 0.75rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #38c172;
}
</style>
