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
  console.log('📦 Rezept empfangen vom Formular:', rezept)

  // Standardwerte absichern
  const rezeptMitFallbacks = {
    ...rezept,
    zutaten: rezept.zutaten || [],
    naehrwerte: rezept.naehrwerte || {}
  }

  rezeptStore.rezeptSpeichernBeimBackend(rezeptMitFallbacks)
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
