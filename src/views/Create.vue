<!-- src/views/Create.vue -->
<template>
  <section class="create-recipe">
    <h1>📥 Neues Rezept erstellen</h1>
    <RezeptFormular @neues-rezept="rezeptSpeichern" />
  </section>
</template>

<script setup>
import RezeptFormular from '@/components/RezeptFormular.vue'
import { useRezeptStore } from '@/stores/rezepte'

const rezeptStore = useRezeptStore()

function rezeptSpeichern(rezept) {
  rezeptStore.rezeptHinzufuegen(rezept)
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
</style>
