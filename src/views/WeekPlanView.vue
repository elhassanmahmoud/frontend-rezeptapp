<template>
  <div class="week-plan">
    <h2>Wochenplan</h2>

    <!-- Neu: PDF-Button rechtsbündig & modern -->
    <div class="pdf-button-container">
      <button @click="exportiereWochenplanAlsPDF" class="pdf-btn">
        Als PDF exportieren
      </button>
    </div>

    <div v-for="tag in tage" :key="tag" class="tag-box">
      <h3>{{ tag }}</h3>

      <!-- Rezeptauswahl -->
      <select @change="onAuswahl(tag, $event.target.value)" :value="plan[tag]">
        <option disabled value="">-- Rezept auswählen --</option>
        <option v-for="r in rezepte" :key="r.id" :value="r.id">
          {{ r.name }}
        </option>
      </select>

      <!-- Rezeptanzeige -->
      <div v-if="ausgewaehltesRezept(tag)" class="rezept-details">
        <h4>{{ ausgewaehltesRezept(tag).name }} ({{ ausgewaehltesRezept(tag).kategorie }})</h4>
        <img :src="bildURL(ausgewaehltesRezept(tag))" />
        <p v-html="formatText(ausgewaehltesRezept(tag).beschreibung)"></p>
        <ul>
          <li v-for="z in ausgewaehltesRezept(tag).zutaten" :key="z.name">
            {{ z.menge }} {{ z.name }}
          </li>
        </ul>
        <p>
          Kalorien: {{ ausgewaehltesRezept(tag).naehrwerte?.kalorien || '?' }} kcal |
          Eiweiß: {{ ausgewaehltesRezept(tag).naehrwerte?.eiweiss || '?' }} g |
          Fett: {{ ausgewaehltesRezept(tag).naehrwerte?.fett || '?' }} g |
          KH: {{ ausgewaehltesRezept(tag).naehrwerte?.kohlenhydrate || '?' }} g
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRezeptStore } from '@/stores/rezepte'
import jsPDF from 'jspdf'
import QRCode from 'qrcode'

const rezeptStore = useRezeptStore()
const rezepte = computed(() => rezeptStore.rezepte)

const tage = ['Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag', 'Sonntag']
const plan = ref({})
tage.forEach(tag => plan.value[tag] = '')

// Lokalen Plan laden (aus localStorage)
function ladeLocalWeekplan() {
  try {
    const data = JSON.parse(localStorage.getItem('wochenplan'))
    if (data && typeof data === 'object') {
      tage.forEach(tag => {
        plan.value[tag] = data[tag] ?? ''
      })
    }
  } catch (err) {
    console.warn('⚠️ LocalStorage leer oder ungültig')
  }
}

// Lokal speichern
function speichereLocalWeekplan() {
  localStorage.setItem('wochenplan', JSON.stringify(plan.value))
}

// Reaktiv auf Änderungen reagieren
watch(plan, speichereLocalWeekplan, { deep: true })

function onAuswahl(tag, rezeptId) {
  plan.value[tag] = rezeptId
}

function ausgewaehltesRezept(tag) {
  return rezepte.value.find(r => r.id === Number(plan.value[tag]))
}

function bildURL(rezept) {
  return rezept?.bild ? `/assets/${rezept.bild}` : '/assets/keinbild.jpg'
}

function formatText(text) {
  return text?.replace(/\n/g, '<br>') || ''
}

function normalizeText(text) {
  return text
    .replace(/\u00A0/g, ' ')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/\u200B/g, '')
    .replace(/\r/g, '')
    .replace(/\s{2,}/g, ' ')
    .trim()
}

async function exportiereWochenplanAlsPDF() {
  const doc = new jsPDF()
  const marginLeft = 15
  let y = 20
  const padding = 6
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  const textWidth = pageWidth - 2 * marginLeft - 2 * padding

  const img = new Image()
  img.src = '/assets/logo.jpg'
  if (!img.complete) await new Promise(resolve => img.onload = resolve)
  doc.addImage(img, 'JPEG', marginLeft, y, 25, 25)

  doc.setFont('Helvetica', 'bold').setFontSize(16).setTextColor(30, 30, 30)
  doc.text('Wochenplan', marginLeft + 32, y + 8)
  doc.setFontSize(10).setFont('Helvetica', 'normal')
  doc.text(`Erstellt am: ${new Date().toLocaleDateString()}`, marginLeft + 32, y + 16)

  const qrURL = await QRCode.toDataURL('https://frontend-rezeptapp.onrender.com')
  doc.addImage(qrURL, 'PNG', pageWidth - marginLeft - 20, y, 20, 20)

  y += 35
  doc.setDrawColor(230)
  doc.line(marginLeft, y, pageWidth - marginLeft, y)
  y += 10

  for (const tag of tage) {
    const rezept = ausgewaehltesRezept(tag)
    if (!rezept) continue

    const beschreibungText = normalizeText(rezept.beschreibung || '')
    const beschreibungZeilen = doc.splitTextToSize(beschreibungText, textWidth)
    const zutatenZeilen = rezept.zutaten?.length || 0
    const blockHeight = 40 + beschreibungZeilen.length * 4 + zutatenZeilen * 5 + 15

    if (y + blockHeight > pageHeight - 30) {
      doc.addPage()
      y = 20
    }

    doc.setFillColor(255, 251, 240)
    doc.setDrawColor(220)
    doc.roundedRect(marginLeft, y, pageWidth - 2 * marginLeft, blockHeight, 4, 4, 'FD')

    y += padding + 4
    doc.setFont('Helvetica', 'bold').setFontSize(12).setTextColor(60, 40, 30)
    doc.text(`${tag}: ${rezept.name} (${rezept.kategorie})`, marginLeft + padding, y)

    y += 7
    doc.setFont('Helvetica', 'normal').setFontSize(10).setTextColor(50, 50, 50)
    beschreibungZeilen.forEach(zeile => {
      doc.text(zeile, marginLeft + padding, y)
      y += 4
    })

    y += 4
    doc.setFont('Helvetica', 'bold')
    doc.text('Zutaten:', marginLeft + padding, y)
    y += 5
    doc.setFont('Helvetica', 'normal')
    rezept.zutaten?.forEach(z => {
      doc.text(`• ${z.menge} ${z.name}`, marginLeft + padding + 3, y)
      y += 5
    })

    y += 2
    doc.setFont('Helvetica', 'bold')
    doc.text('Nährwerte:', marginLeft + padding, y)
    y += 5
    const n = rezept.naehrwerte || {}
    doc.setFont('Helvetica', 'normal').setFontSize(10).setTextColor(70, 70, 70)
    doc.text(
      `Kalorien: ${n.kalorien || '?'} kcal | Eiweiß: ${n.eiweiss || '?'} g | Fett: ${n.fett || '?'} g | KH: ${n.kohlenhydrate || '?'} g`,
      marginLeft + padding,
      y
    )

    y += 10
    doc.setDrawColor(230)
    doc.line(marginLeft, y - 5, pageWidth - marginLeft, y - 5)
  }

  const totalPages = doc.internal.getNumberOfPages()
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i)
    doc.setFontSize(9)
    doc.text(`Seite ${i} von ${totalPages}`, pageWidth - marginLeft - 20, pageHeight - 10)
  }

  doc.save('wochenplan.pdf')
}

onMounted(async () => {
  await rezeptStore.ladeRezepteVomBackend()
  ladeLocalWeekplan()
})
</script>

<style scoped>
.week-plan {
  max-width: 900px;
  margin: 2rem auto;
  padding: 1rem;
}
.pdf-button-container {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 1.5rem;
}
.pdf-btn {
  background-color: #f9fafb;
  color: #111827;
  font-weight: bold;
  padding: 0.6rem 1.2rem;
  font-size: 1rem;
  border: 1px solid #d6d3d1;
  border-radius: 10px;
  cursor: pointer;
  transition: background 0.2s ease;
}
.pdf-btn:hover {
  background-color: #f3f4f6;
}
.tag-box {
  margin-bottom: 2rem;
  padding: 1rem;
  border: 1px solid #ddd;
  border-radius: 8px;
}
.rezept-details {
  margin-top: 1rem;
  background: #fff6f0;
  padding: 1rem;
  border-radius: 8px;
}
.rezept-details img {
  width: 100%;
  max-height: 200px;
  object-fit: cover;
  border-radius: 8px;
}
</style>
