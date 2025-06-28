<template>
  <section class="edit">
    <h2>Rezept bearbeiten</h2>

    <div v-if="ladeStatus === 'laden'">
      🧊 Rezept wird geladen...
    </div>

    <div v-else-if="ladeStatus === 'fehler'">
      ❌ Fehler beim Laden des Rezepts.
    </div>

    <RezeptFormular
      v-else
      :rezept="rezept"
      @gespeichert="nachSpeichern"
      @abbrechen="nachAbbrechen"
    />
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import RezeptFormular from '@/components/RezeptFormular.vue'

const route = useRoute()
const router = useRouter()

const rezept = ref(null)
const ladeStatus = ref('laden') // 'laden' | 'ok' | 'fehler'

onMounted(async () => {
  try {
    const id = route.params.id
    const res = await fetch(`${import.meta.env.VITE_API_URL}/rezepte/${id}`)
    if (!res.ok) throw new Error('Nicht gefunden')
    rezept.value = await res.json()
    ladeStatus.value = 'ok'
  } catch (err) {
    console.error('Fehler beim Laden:', err)
    ladeStatus.value = 'fehler'
  }
})

function nachSpeichern() {
  router.push('/home')
}

function nachAbbrechen() {
  router.push('/home')
}
</script>

<style scoped>
.edit {
  padding: 2rem;
}
</style>
