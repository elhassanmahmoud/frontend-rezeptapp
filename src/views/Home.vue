<!-- src/views/HomeView.vue -->
<template>
  <section class="home">
    <h1>Willkommen in der Rezeptwelt </h1>
    <input v-model="suche" placeholder="Suche nach Namen oder Kategorie..." class="search" />
    <RezeptListe :filter="suche" />
  </section>
</template>

<script setup>
import { ref } from 'vue'
import RezeptListe from '@/components/RezeptListe.vue'

const suche = ref('')
</script>

<style scoped>
.home {
  padding: 2rem;
  max-width: 960px;
  margin: auto;
}
.search {
  padding: 10px 15px;
  border-radius: 10px;
  border: 1px solid var(--color-border);
  width: 100%;
  margin: 1rem 0 2rem;
}
</style>
