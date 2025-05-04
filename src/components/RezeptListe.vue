<template>
  <div class="rezeptliste">
    <div class="favoriten-toggle" v-if="userStore.user">
      <button @click="zeigeNurFavoriten = !zeigeNurFavoriten">
        {{ zeigeNurFavoriten ? '🔄 Alle anzeigen' : '❤️ Nur Favoriten' }}
      </button>
    </div>

    <div class="export-button" v-if="userStore.user">
      <button @click="exportiereAlsPDF">📄 Als PDF exportieren</button>
    </div>

    <div v-for="r in gefiltert" :key="r.id" class="card">
      <img :src="`/assets/${r.bild}`" :alt="r.name" />
      <h3>{{ r.name }} <small>({{ r.kategorie }})</small></h3>
      <p>{{ r.beschreibung }}</p>

      <!-- Zutatenliste -->
      <ul class="zutaten" v-if="r.zutaten">
        <li v-for="zutat in r.zutaten" :key="zutat.name">
          🧂 {{ zutat.menge }} {{ zutat.name }}
        </li>
      </ul>

      <!-- Nährwerte -->
      <div class="naehrwerte" v-if="r.naehrwerte">
        📦 Kalorien: {{ r.naehrwerte.kalorien }} kcal |
        Eiweiß: {{ r.naehrwerte.eiweiss }} g |
        Fett: {{ r.naehrwerte.fett }} g |
        Kohlenhydrate: {{ r.naehrwerte.kohlenhydrate }} g
      </div>

      <button
        v-if="userStore.user"
        @click="favoritWechseln(r.id)"
        :class="{ aktiv: r.favorit }"
      >
        {{ r.favorit ? '💖 Favorit' : '🤍 Merken' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, defineProps } from 'vue'
import { useRezeptStore } from '@/stores/rezepte'
import { useUserStore } from '@/stores/user'
import jsPDF from 'jspdf'

const props = defineProps({
  filter: String,
  kategorie: String
})

const rezeptStore = useRezeptStore()
const userStore = useUserStore()
const zeigeNurFavoriten = ref(false)

const gefiltert = computed(() => {
  const suchbegriff = props.filter?.toLowerCase() || ''
  const kategorie = props.kategorie || ''

  return rezeptStore.rezepte.filter(r => {
    const passtZurSuche =
      r.name.toLowerCase().includes(suchbegriff) ||
      r.kategorie.toLowerCase().includes(suchbegriff)

    const passtZurKategorie = !kategorie || r.kategorie === kategorie
    const istFavorit = !zeigeNurFavoriten.value || r.favorit

    return passtZurSuche && passtZurKategorie && istFavorit
  })
})

function favoritWechseln(id) {
  rezeptStore.favoritToggle(id)
}

async function exportiereAlsPDF() {
  const doc = new jsPDF()
  const benutzer = userStore.user?.username || 'Unbekannt'
  const datum = new Date().toLocaleDateString()

  // Logo
  const logoUrl = '/assets/logo.jpg'
  try {
    const logo = await toBase64(logoUrl)
    doc.addImage(logo, 'JPEG', 15, 10, 25, 25)
  } catch (err) {
    console.warn('Logo konnte nicht geladen werden:', logoUrl)
  }

  // Titel
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(20)
  doc.text('Meine Rezepte', 45, 22)

  // Benutzername & Datum oben rechts
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`Benutzer: ${benutzer}`, 150, 15)
  doc.text(`Datum: ${datum}`, 150, 20)

  doc.setLineWidth(0.5)
  doc.line(10, 35, 200, 35)

  let y = 45
  for (let i = 0; i < gefiltert.value.length; i++) {
    const r = gefiltert.value[i]

    doc.setDrawColor(230)
    doc.setFillColor(250, 250, 250)
    doc.roundedRect(10, y, 190, 80, 5, 5, 'F')

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(13)
    doc.setTextColor(33, 37, 41)
    doc.text(`${i + 1}. ${r.name} (${r.kategorie})`, 15, y + 10)

    doc.setFont('helvetica', 'normal')
    doc.setFontSize(11)
    doc.setTextColor(55, 55, 55)
    doc.text(doc.splitTextToSize(r.beschreibung, 120), 15, y + 20)

    // Zutaten
    if (r.zutaten?.length) {
      let zutatenText = r.zutaten.map(z => `- ${z.menge} ${z.name}`).join('\n')
      doc.text(doc.splitTextToSize(`Zutaten:\n${zutatenText}`, 120), 15, y + 32)
    }

    // Nährwerte
    if (r.naehrwerte) {
      const n = r.naehrwerte
      const naehrwertText = `Kalorien: ${n.kalorien} kcal | Eiweiß: ${n.eiweiss} g | Fett: ${n.fett} g | Kohlenhydrate: ${n.kohlenhydrate} g`
      doc.setFontSize(10)
      doc.setTextColor(80, 80, 80)
      doc.text(naehrwertText, 15, y + 60)
    }

    // Bild
    try {
      const imgData = await toBase64(`/assets/${r.bild}`)
      doc.addImage(imgData, 'JPEG', 150, y + 8, 45, 30)
    } catch (err) {
      console.warn('Bild konnte nicht geladen werden:', `/assets/${r.bild}`)
    }

    y += 90
    if (y > 250) {
      doc.addPage()
      y = 20
    }
  }

  doc.save('rezepte-modern.pdf')
}

function toBase64(url) {
  return fetch(url)
    .then(res => res.blob())
    .then(blob => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve(reader.result)
        reader.onerror = reject
        reader.readAsDataURL(blob)
      })
    })
}
</script>

<style scoped>
.favoriten-toggle,
.export-button {
  text-align: right;
  margin-bottom: 1rem;
}

.favoriten-toggle button,
.export-button button {
  padding: 8px 16px;
  background-color: #f9fafb;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
}

.card {
  background: var(--color-soft);
  padding: 1rem;
  border-radius: var(--card-radius);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 1.5rem;
}

.card img {
  width: 100%;
  height: 180px;
  object-fit: cover;
  border-radius: 12px;
}

.card button {
  margin-top: 1rem;
  padding: 6px 12px;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  background-color: #ccc;
  color: #333;
  transition: all 0.2s ease;
}

.card button.aktiv {
  background-color: var(--color-accent);
  color: white;
}

.zutaten {
  margin-top: 0.5rem;
  padding-left: 1rem;
  font-size: 0.95rem;
  color: #555;
}

.naehrwerte {
  margin-top: 0.5rem;
  font-size: 0.9rem;
  font-style: italic;
  color: #333;
}
</style>
