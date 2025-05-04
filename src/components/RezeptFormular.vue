<!-- src/components/RezeptFormular.vue -->
<template>
  <form @submit.prevent="absenden" class="formular">
    <input v-model="name" placeholder="Name" required />
    <input v-model="kategorie" placeholder="Kategorie" required />
    <input v-model="bild" placeholder="Bilddateiname (z. B. pizza.jpg)" />
    <textarea v-model="beschreibung" placeholder="Beschreibung" required></textarea>
    <button>Speichern</button>
  </form>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['neues-rezept'])

const name = ref('')
const kategorie = ref('')
const bild = ref('')
const beschreibung = ref('')

function absenden() {
  emit('neues-rezept', {
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
button {
  padding: 10px 20px;
  background: var(--color-accent);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  margin-top: 1rem;
}
</style>
