<template>
  <div class="rezeptliste">
    <h1>Willkommen in der Rezeptwelt! 🍴</h1>
    <div class="rezepte-grid">
      <div v-for="rezept in rezepte" :key="rezept.id" class="rezept-card">
        <img :src="rezept.bild" :alt="rezept.name" class="rezept-bild" />
        <div class="rezept-info">
          <h2>{{ rezept.name }}</h2>
          <p class="kategorie">({{ rezept.kategorie }})</p>
          <p class="beschreibung">{{ rezept.beschreibung }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import pizzaBild from '../assets/pizza.jpg';
import spaghettiBild from '../assets/spaghetti.jpg';
import lasagneBild from '../assets/lasagne.jpg';

export default {
  name: 'RezeptListe',
  data() {
    return {
      rezepte: [
        { id: 1, name: 'Pizza Margherita', kategorie: 'Italienisch', bild: pizzaBild, beschreibung: 'Klassische Pizza mit Tomaten, Mozzarella und Basilikum.' },
        { id: 2, name: 'Spaghetti Bolognese', kategorie: 'Pasta', bild: spaghettiBild, beschreibung: 'Spaghetti mit herzhafter Fleischsauce.' },
        { id: 3, name: 'Vegane Lasagne', kategorie: 'Vegan', bild: lasagneBild, beschreibung: 'Leckere Lasagne ohne tierische Produkte.' }
      ]
    };
  }
};
</script>

<style scoped>
.rezeptliste {
  padding: 2rem;
  text-align: center;
  background-color: #f9f9f9;
  min-height: 100vh;
}

h1 {
  margin-bottom: 2rem;
  color: #333;
}

.rezepte-grid {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
}

.rezept-card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  width: 250px;
  overflow: hidden;
  transition: transform 0.3s, box-shadow 0.3s;
}

.rezept-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
}

.rezept-bild {
  width: 100%;
  height: 160px;
  object-fit: cover;
}

.rezept-info {
  padding: 1rem;
}

.kategorie {
  font-size: 0.9rem;
  color: #777;
  margin-bottom: 0.5rem;
}

.beschreibung {
  font-size: 0.95rem;
  color: #555;
}
</style>
