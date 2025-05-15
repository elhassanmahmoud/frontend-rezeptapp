import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useRezeptStore = defineStore('rezepte', () => {
  const rezepte = ref([]) //  Nur Backend-Daten, keine Dummy-Rezepte

  //  Lade alle Rezepte vom Backend (ersetzt Liste vollständig)
  async function ladeRezepteVomBackend() {
    try {
      const res = await fetch('https://backend-rezeptapp.onrender.com/rezepte')
      if (!res.ok) throw new Error('Fehler beim Laden vom Backend')
      const daten = await res.json()

      // Ersetze lokale Liste vollständig
      rezepte.value = daten.map(r => ({
        ...r,
        favorit: r.favorit ?? false
      }))
    } catch (err) {
      console.error('❌ Fehler beim Laden der Rezepte vom Backend:', err)
    }
  }

  //  Speichert Rezept dauerhaft in der Datenbank
  async function rezeptSpeichernBeimBackend(rezept) {
    try {
      const res = await fetch('https://backend-rezeptapp.onrender.com/rezepte', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rezept)
      })

      if (!res.ok) throw new Error('Speichern fehlgeschlagen')

      const result = await res.json()
      console.log('✅ Rezept erfolgreich gespeichert:', result)

      // Neues Rezept nach erfolgreicher Speicherung anhängen
      rezepte.value.push({
        ...rezept,
        favorit: false
      })
    } catch (err) {
      console.error('❌ Fehler beim Speichern des Rezepts:', err)
    }
  }

  //  Favoritenstatus umschalten
  function favoritToggle(id) {
    const rezept = rezepte.value.find(r => r.id === id)
    if (rezept) {
      rezept.favorit = !rezept.favorit
    }
  }

  return {
    rezepte,
    ladeRezepteVomBackend,
    rezeptSpeichernBeimBackend,
    favoritToggle
  }
})
