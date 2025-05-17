import { defineStore } from 'pinia'
import { ref } from 'vue'

// 🧠 Zugriff auf API-URL aus .env
const API_URL = import.meta.env.VITE_API_URL

export const useRezeptStore = defineStore('rezepte', () => {
  const rezepte = ref([])

  // 🔄 Rezepte vom Backend laden
  async function ladeRezepteVomBackend() {
    try {
      const res = await fetch(`${API_URL}/rezepte`)
      if (!res.ok) throw new Error('Fehler beim Laden vom Backend')
      const daten = await res.json()
      rezepte.value = daten.map(r => ({
        ...r,
        favorit: r.favorit ?? false
      }))
    } catch (err) {
      console.error('❌ Fehler beim Laden der Rezepte vom Backend:', err)
    }
  }

  // 💾 Neues Rezept speichern
  async function rezeptSpeichernBeimBackend(rezept) {
    try {
      const res = await fetch(`${API_URL}/rezepte`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rezept)
      })

      if (!res.ok) throw new Error('Speichern fehlgeschlagen')
      const result = await res.json()
      console.log('✅ Rezept erfolgreich gespeichert:', result)

      // Direkt lokal anhängen
      rezepte.value.push({
        ...rezept,
        favorit: false
      })
    } catch (err) {
      console.error('❌ Fehler beim Speichern des Rezepts:', err)
    }
  }

  // ⭐ Favoritenstatus umschalten
  function favoritToggle(id) {
    const rezept = rezepte.value.find(r => r.id === id)
    if (rezept) rezept.favorit = !rezept.favorit
  }

  return {
    rezepte,
    ladeRezepteVomBackend,
    rezeptSpeichernBeimBackend,
    favoritToggle
  }
})
