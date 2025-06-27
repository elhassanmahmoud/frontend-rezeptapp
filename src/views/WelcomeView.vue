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
/* 🌅 Hintergrund-Verlauf ohne weißen Rand */
.welcome-container {
  height: calc(100vh - 140px); /* statt min-height: 100vh */
  display: flex;
  align-items: flex-start; /* Nach oben rücken */
  justify-content: center;
  background: radial-gradient(circle at center, #fff2dc, #fcefd6);
  padding-top: 3rem;
  padding-inline: 2rem;
  overflow: hidden;
  position: relative;
}

/* ✨ Dekorative weiche Kreise */
.welcome-container::before,
.welcome-container::after {
  content: "";
  position: absolute;
  width: 400px;
  height: 400px;
  background: rgba(255, 200, 100, 0.15);
  border-radius: 50%;
  filter: blur(90px);
  z-index: 0;
}

.welcome-container::before {
  top: -120px;
  left: -100px;
}

.welcome-container::after {
  bottom: -100px;
  right: -80px;
}

/* 💳 Willkommen-Karte */
.welcome-card {
  background: #fff8ee;
  border-radius: 1.5rem;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.08);
  border: 1px solid #f7e6c1;
  padding: 3rem;
  text-align: center;
  max-width: 600px;
  width: 100%;
  z-index: 1;
}

/* ✍️ Text */
h1 {
  font-size: 2rem;
  margin-bottom: 1rem;
  font-weight: 700;
  color: #3a2f27;
}

.highlight {
  color: #f5a623;
}

p {
  color: #5a4c43;
  margin-bottom: 2rem;
}

/* 🧈 Buttons */
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
