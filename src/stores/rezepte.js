import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useRezeptStore = defineStore('rezepte', () => {
  const rezepte = ref([
    {
      id: 1,
      name: 'Pizza',
      kategorie: 'Italienisch',
      bild: 'pizza.jpg',
      beschreibung: 'Klassisch italienisch.',
      favorit: false,
      zutaten: [
        { name: 'Pizzateig', menge: '1 Stück' },
        { name: 'Tomatensauce', menge: '100ml' },
        { name: 'Mozzarella', menge: '100g' },
        { name: 'Basilikum', menge: 'ein paar Blätter' }
      ],
      naehrwerte: {
        kalorien: 720,
        eiweiss: 30,
        fett: 28,
        kohlenhydrate: 80
      }
    },
    {
      id: 2,
      name: 'Spaghetti',
      kategorie: 'Pasta',
      bild: 'spaghetti.jpg',
      beschreibung: 'Mit Fleischsauce.',
      favorit: false,
      zutaten: [
        { name: 'Spaghetti', menge: '200g' },
        { name: 'Hackfleisch', menge: '150g' },
        { name: 'Tomatensauce', menge: '100ml' },
        { name: 'Zwiebel', menge: '1 Stück' },
        { name: 'Olivenöl', menge: '1 EL' }
      ],
      naehrwerte: {
        kalorien: 540,
        eiweiss: 25,
        fett: 20,
        kohlenhydrate: 60
      }
    },
    {
      id: 3,
      name: 'Lasagne',
      kategorie: 'Auflauf',
      bild: 'lasagne.jpg',
      beschreibung: 'Schichtweise mit Béchamel- und Fleischsoße.',
      favorit: false,
      zutaten: [
        { name: 'Lasagneplatten', menge: '6 Stück' },
        { name: 'Hackfleisch', menge: '200g' },
        { name: 'Tomatensauce', menge: '150ml' },
        { name: 'Béchamelsauce', menge: '100ml' },
        { name: 'Käse', menge: '80g' }
      ],
      naehrwerte: {
        kalorien: 680,
        eiweiss: 35,
        fett: 32,
        kohlenhydrate: 55
      }
    }
  ])

  // 🔁 Backend: Rezepte laden und ergänzen (ohne doppelte Namen)
  async function ladeRezepteVomBackend() {
    try {
      const res = await fetch('http://localhost:3000/rezepte')
      if (!res.ok) throw new Error('Fehler beim Laden vom Backend')
      const daten = await res.json()

      daten.forEach(r => {
        const existiert = rezepte.value.some(local => local.name === r.name)
        if (!existiert) {
          rezepte.value.push({
            ...r,
            favorit: r.favorit ?? false
          })
        }
      })
    } catch (err) {
      console.error('❌ Fehler beim Laden der Rezepte vom Backend:', err)
    }
  }

  // 📤 Rezept ins Backend speichern (POST)
  async function rezeptSpeichernBeimBackend(rezept) {
    try {
      const res = await fetch('http://localhost:3000/rezepte', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rezept)
      })

      if (!res.ok) throw new Error('Speichern fehlgeschlagen')

      // Optional direkt anzeigen:
      rezepte.value.push({
        ...rezept,
        favorit: false
      })
    } catch (err) {
      console.error('❌ Fehler beim Speichern des Rezepts:', err)
    }
  }

  // 📝 Lokales Hinzufügen (nur in der App, ohne DB)
  function rezeptHinzufuegen(rezept) {
    rezepte.value.push({
      ...rezept,
      id: Date.now(),
      favorit: false
    })
  }

  // 💖 Favorit umschalten
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
    rezeptHinzufuegen,
    favoritToggle
  }
})
