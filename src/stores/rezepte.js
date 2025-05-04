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

  function rezeptHinzufuegen(rezept) {
    rezepte.value.push({
      ...rezept,
      id: Date.now(),
      favorit: false // Standardwert
    })
  }

  function favoritToggle(id) {
    const rezept = rezepte.value.find(r => r.id === id)
    if (rezept) {
      rezept.favorit = !rezept.favorit
    }
  }

  return {
    rezepte,
    rezeptHinzufuegen,
    favoritToggle
  }
})
