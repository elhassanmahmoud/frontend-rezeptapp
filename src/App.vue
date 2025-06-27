<template>
  <div id="app">
    <header class="navbar">
      <img src="/assets/logo.jpg" alt="Logo" class="logo-bounce" />

      <nav class="main-nav">
        <div class="nav-links">
          <RouterLink to="/" v-if="!userStore.user">Start</RouterLink>
          <template v-else>
            <RouterLink to="/home">Home</RouterLink>
            <RouterLink to="/create">Rezept erstellen</RouterLink>
            <RouterLink to="/stats">Statistiken</RouterLink>
          </template>
        </div>

        <div class="auth-links">
          <template v-if="userStore.user">
            Hallo, {{ userStore.user.username }}
            <button @click="logout" class="logout-btn">Logout</button>
          </template>
          <template v-else>
            <RouterLink to="/login">Login</RouterLink>
            <RouterLink to="/register">Registrieren</RouterLink>
          </template>
        </div>
      </nav>
    </header>

    <main>
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const router = useRouter()

function logout() {
  userStore.logout()
  router.push('/') // Zur öffentlichen Startseite
}
</script>

<style>
@import 'assets/base.css';

#app {
  font-family: 'Helvetica Neue', sans-serif;
}

/* Navbar Layout */
.navbar {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: var(--color-soft);
  padding: 1.5rem;
  border-bottom: 1px solid var(--color-border);
  gap: 1rem;
}

/* Navigation Area */
.main-nav {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
  width: 100%;
  max-width: 960px;
}

/* Logo Animation (Bounce) */
.logo-bounce {
  width: 80px;
  height: 80px;
  animation: bounce 3s infinite ease-in-out;
  border-radius: 50%;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Navigation Links */
.nav-links,
.auth-links {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

nav a {
  text-decoration: none;
  font-weight: 600;
  color: var(--color-text);
  transition: color 0.3s ease;
}

nav a.router-link-exact-active {
  color: var(--color-accent);
}

/* Logout Button */
.logout-btn {
  background: transparent;
  border: none;
  color: var(--color-accent);
  font-weight: bold;
  cursor: pointer;
}
.logout-btn:hover {
  text-decoration: underline;
}

/* Animation */
@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

/* Main Area */
main {
  padding: 2rem;
  max-width: 960px;
  margin: auto;
}
</style>
