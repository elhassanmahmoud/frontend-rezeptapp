<template>
  <div class="rezeptliste">
    <div class="favoriten-toggle" v-if="userStore.user">
      <button @click="zeigeNurFavoriten = !zeigeNurFavoriten">
        {{ zeigeNurFavoriten ? 'Alle anzeigen' : 'Nur Favoriten' }}
      </button>
    </div>

    <div class="export-button" v-if="userStore.user">
      <button @click="exportiereAlsPDF"> Als PDF exportieren</button>
    </div>

    <p>Anzahl gefilterter Rezepte: {{ angezeigteRezepte.length }}</p>
    <p v-if="angezeigteRezepte.length === 0">Keine passenden Rezepte gefunden.</p>

    <div v-for="r in angezeigteRezepte" :key="r.id" class="card">
      <img :src="r.bild ? `/assets/${r.bild}` : '/assets/keinbild.jpg'" :alt="r.name" />
      <h3>{{ r.name }} <small>({{ r.kategorie }})</small></h3>

      <!-- Beschreibung mit Zeilenumbrüchen -->
      <p v-html="formatText(r.beschreibung)"></p>

      <ul class="zutaten" v-if="Array.isArray(r.zutaten)">
        <li v-for="zutat in r.zutaten" :key="zutat.name">
           {{ zutat.menge }} {{ zutat.name }}
        </li>
      </ul>

      <div class="naehrwerte" v-if="r.naehrwerte && typeof r.naehrwerte === 'object'">
        Kalorien: {{ r.naehrwerte.kalorien || '?' }} kcal |
        Eiweiß: {{ r.naehrwerte.eiweiss || '?' }} g |
        Fett: {{ r.naehrwerte.fett || '?' }} g |
        Kohlenhydrate: {{ r.naehrwerte.kohlenhydrate || '?' }} g
      </div>

      <div class="button-row" v-if="userStore.user">
        <button @click="favoritWechseln(r.id)" :class="{ aktiv: r.favorit }">
          {{ r.favorit ? 'Favorit' : 'Merken' }}
        </button>
        <button @click="bearbeiten(r)">️ Bearbeiten</button>
        <button @click="loeschen(r.id)"> Löschen</button>
      </div>
    </div>

    <RezeptFormular
      v-if="formularOffen"
      :rezept="aktuellesRezept"
      @abbrechen="formularGeschlossen"
      @gespeichert="formularGeschlossen"
    />
  </div>
</template>

<script setup>
import { ref, computed, defineProps } from 'vue'
import { useRouter } from 'vue-router'
import { useRezeptStore } from '@/stores/rezepte'
import { useUserStore } from '@/stores/user'
import jsPDF from 'jspdf'
import QRCode from 'qrcode'

const props = defineProps({
  rezepte: {
    type: Array,
    required: true
  }
})

const rezeptStore = useRezeptStore()
const userStore = useUserStore()
const router = useRouter()
const zeigeNurFavoriten = ref(false)
const formularOffen = ref(false)
const aktuellesRezept = ref(null)

const angezeigteRezepte = computed(() => {
  return zeigeNurFavoriten.value
    ? props.rezepte.filter(r => r.favorit)
    : props.rezepte
})

function bearbeiten(rezept) {
  router.push(`/bearbeiten/${rezept.id}`)
}

function favoritWechseln(id) {
  rezeptStore.favoritToggle(id)
}

async function loeschen(id) {
  if (confirm('Möchtest du dieses Rezept wirklich löschen?')) {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/rezepte/${id}`, {
        method: 'DELETE'
      })
      if (!res.ok) throw new Error('Fehler beim Löschen')
      rezeptStore.rezepte = rezeptStore.rezepte.filter(r => r.id !== id)
      alert('Rezept gelöscht')
    } catch (err) {
      console.error('Fehler beim Löschen:', err)
      alert('Fehler beim Löschen')
    }
  }
}

async function exportiereAlsPDF() {
  const doc = new jsPDF()
  const img = new Image()
  img.src = '/assets/logo.jpg'

  if (img.complete) {
    await handlePDFExport(doc, img)
  } else {
    img.onload = async () => await handlePDFExport(doc, img)
  }
}

// Verbesserte Normalisierung – keine Wörter mehr zusammengedrückt!
function normalizeText(text) {
  return text
    .replace(/\u00A0/g, ' ')         // geschütztes Leerzeichen
    .replace(/[“”]/g, '"')           // typografische Anführungszeichen
    .replace(/[‘’]/g, "'")           // typografische Apostrophe
    .replace(/\u200B/g, '')          // zero-width space
    .replace(/\r/g, '')              // Carriage Return
    .replace(/\s{2,}/g, ' ')         // mehrfache Leerzeichen reduzieren
    .trim()
}

async function handlePDFExport(doc, img) {
  const marginLeft = 15
  let y = 20
  const padding = 6
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const textWidth = pageWidth - 2 * marginLeft - 2 * padding

  // Kopfzeile
  doc.setDrawColor(230)
  doc.setLineWidth(0.5)
  doc.line(marginLeft, y - 10, pageWidth - marginLeft, y - 10)

  doc.addImage(img, 'JPEG', marginLeft, y, 25, 25)
  doc.setFont('Helvetica', 'bold').setFontSize(16)
  doc.text('Rezeptübersicht', marginLeft + 32, y + 8)
  doc.setFontSize(10).setFont('Helvetica', 'normal')
  doc.text(`Erstellt am: ${new Date().toLocaleDateString()}`, marginLeft + 32, y + 16)

  const qrAppURL = await QRCode.toDataURL('https://frontend-rezeptapp.onrender.com/')
  doc.addImage(qrAppURL, 'PNG', pageWidth - marginLeft - 20, y, 20, 20)

  y += 35
  doc.line(marginLeft, y, pageWidth - marginLeft, y)
  y += 10

  const rezepte = angezeigteRezepte.value

  for (let i = 0; i < rezepte.length; i++) {
    const r = rezepte[i]

    const beschreibungText = normalizeText(r.beschreibung || '')
    const beschreibungZeilen = doc.splitTextToSize(beschreibungText, textWidth)
    const zutatenZeilen = (r.zutaten?.length || 0)
    const boxHeight = 40 + beschreibungZeilen.length * 4 + zutatenZeilen * 5 + 15

    if (y + boxHeight > pageHeight - 30) {
      doc.addPage()
      y = 20
    }

    doc.setFillColor(255, 251, 240)
    doc.setDrawColor(220)
    doc.roundedRect(marginLeft, y, pageWidth - 2 * marginLeft, boxHeight, 4, 4, 'FD')

    // Titel
    y += padding + 4
    doc.setFont('Helvetica', 'bold').setFontSize(12).setTextColor(60, 40, 30)
    doc.text(`${i + 1}. ${r.name} (${r.kategorie})`, marginLeft + padding, y)

    // Beschreibung
    y += 7
    doc.setFont('Helvetica', 'normal').setFontSize(10).setTextColor(50, 50, 50)
    beschreibungZeilen.forEach(zeile => {
      doc.text(zeile, marginLeft + padding, y)
      y += 4
    })

    // Zutaten
    y += 4
    doc.setFont('Helvetica', 'bold')
    doc.text('Zutaten:', marginLeft + padding, y)
    y += 5

    doc.setFont('Helvetica', 'normal')
    if (Array.isArray(r.zutaten)) {
      r.zutaten.forEach(z => {
        doc.text(`• ${z.menge} ${z.name}`, marginLeft + padding + 3, y)
        y += 5
      })
    }

    // Nährwerte
    y += 2
    doc.setFont('Helvetica', 'bold')
    doc.text('Nährwerte:', marginLeft + padding, y)
    y += 5

    const n = r.naehrwerte || {}
    doc.setFont('Helvetica', 'normal').setFontSize(10).setTextColor(70, 70, 70)
    const naehrwerteText =
      `Kalorien: ${n.kalorien || '?'} kcal | ` +
      `Eiweiß: ${n.eiweiss || '?'} g | ` +
      `Fett: ${n.fett || '?'} g | ` +
      `KH: ${n.kohlenhydrate || '?'} g`
    doc.text(naehrwerteText, marginLeft + padding, y)

    y += 10
    doc.setDrawColor(230)
    doc.line(marginLeft, y - 5, pageWidth - marginLeft, y - 5)
  }

  // Seitenzahlen
  const totalPages = doc.internal.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setFontSize(9)
    doc.text(`Seite ${i} von ${totalPages}`, pageWidth - marginLeft - 20, pageHeight - 10)
  }

  doc.save('rezepte.pdf')
}
// 🔁 Umwandeln von \n in <br> für HTML-Anzeige
function formatText(text) {
  return text?.replace(/\n/g, '<br>') || ''
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

.button-row {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  flex-wrap: wrap;
}

.button-row button {
  padding: 6px 12px;
  font-size: 0.9rem;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background-color: #f9f9f9;
  cursor: pointer;
  transition: all 0.2s ease;
}

.button-row button:hover {
  background-color: #eaeaea;
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
