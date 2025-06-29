<template>
  <div class="welcome-container">
    <div class="welcome-card">
      <h1>
        Willkommen bei der <span class="highlight">Rezept App</span>
      </h1>
      <p>Dein digitales Kochbuch mit Lieblingsrezepten, Statistiken und mehr.</p>
      <div class="buttons">
        <RouterLink class="btn filled" to="/register">Registrieren</RouterLink>
        <RouterLink class="btn outline" to="/login">Einloggen</RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

<style scoped>
/* VOLLE HÖHE & perfekte Zentrierung */
.welcome-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 140px); /* Platz für Header */
  width: 100%;
  background-color: transparent; /* Beige entfernt */
  padding: 2rem;
  box-sizing: border-box;
}

/* Die Karte in der Mitte */
.welcome-card {
  background: #fff8ee;
  border-radius: 1.5rem;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.08);
  border: 1px solid #f7e6c1;
  padding: 4rem 3rem;
  text-align: center;
  max-width: 700px;
  width: 100%;
  min-height: 400px; /* Höher gesetzt */
  z-index: 1;
}

/* Überschrift */
h1 {
  font-size: 2.4rem;
  margin-bottom: 1.2rem;
  font-weight: 700;
  color: #3a2f27;
}

.highlight {
  color: #f5a623;
}

p {
  color: #5a4c43;
  margin-bottom: 2.5rem;
  font-size: 1.1rem;
}

/* Buttons */
.buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn {
  font-weight: bold;
  padding: 0.75rem 1.5rem;
  border-radius: 0.75rem;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;
}

.filled {
  background-color: #f5a623;
  color: white;
  border: none;
}

.filled:hover {
  background-color: #e09b1a;
}

.outline {
  background: transparent;
  border: 2px solid #f5a623;
  color: #3a2f27;
}

.outline:hover {
  background-color: #fff2dc;
}
</style>
