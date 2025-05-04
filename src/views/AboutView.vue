<script setup>
</script>

<template>
  <div class="about-page">
    <div class="logo-container">
      <img src="../../public/assets/logo.jpg" alt="RezeptApp Logo" class="logo" />
    </div>

    <div class="card">
      <h1>Über die RezeptApp 🍴</h1>
      <p>Willkommen bei der RezeptApp! Hier kannst du deine Lieblingsrezepte anlegen, durchsuchen, filtern und speichern.</p>

      <h2>Was du machen kannst:</h2>
      <ul>
        <li>🍽️ Eigene Rezepte erstellen</li>
        <li>✏️ Rezepte bearbeiten</li>
        <li>❌ Rezepte löschen</li>
        <li>🔍 Nach Titeln oder Zutaten suchen</li>
        <li>🏷️ Nach Kategorien filtern (z. B. Vegan, Frühstück)</li>
        <li>❤️ Rezepte als Favoriten speichern</li>
        <li>🖼️ Bilder zu Rezepten hochladen</li>
      </ul>

      <h2>Bonusfunktionen (geplant):</h2>
      <ul>
        <li>📦 Nährwertangaben automatisch einbinden</li>
        <li>🔐 Login/Registrierung für Benutzer</li>
        <li>📥 Rezepte als PDF exportieren</li>
        <li>📊 Koch-Statistiken erstellen</li>
      </ul>

      <p>Viel Spaß beim Kochen und Entdecken! 🎉</p>
    </div>
  </div>
</template>

<style scoped>
.about-page {
  padding: 30px 20px;
  background-color: #1c1c1c;
  min-height: 100vh;
}

.logo-container {
  text-align: center;
  margin-bottom: 20px;
}

.logo {
  width: 150px;
  height: auto;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(255, 255, 255, 0.2);
}

.card {
  background: #ffffff;
  padding: 30px;
  border-radius: 15px;
  max-width: 800px;
  margin: 0 auto;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  color: #333333;
  text-align: left;
}

.card h1, .card h2 {
  color: #ff8800;
}

.card ul {
  list-style: none;
  padding: 0;
}

.card ul li {
  margin-bottom: 12px;
  font-size: 1.1rem;
}
</style>
