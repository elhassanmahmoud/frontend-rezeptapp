<template>
  <div class="auth">
    <h1>🔐 Login</h1>
    <form @submit.prevent="einloggen">
      <input v-model="username" placeholder="Benutzername" required />
      <input v-model="password" type="password" placeholder="Passwort" required />
      <button>Einloggen</button>
    </form>
    <p class="error" v-if="fehlermeldung">{{ fehlermeldung }}</p>
    <RouterLink to="/register">Noch kein Konto? Registrieren</RouterLink>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { useRouter } from 'vue-router'

const username = ref('')
const password = ref('')
const fehlermeldung = ref('')
const userStore = useUserStore()
const router = useRouter()

function einloggen() {
  try {
    userStore.login(username.value, password.value)
    router.push('/')
  } catch (err) {
    fehlermeldung.value = err.message
  }
}
</script>

<style scoped>
.auth {
  max-width: 400px;
  margin: 3rem auto;
  padding: 2rem;
  background: var(--color-soft);
  border-radius: 12px;
}
input {
  width: 100%;
  padding: 10px;
  margin-bottom: 1rem;
}
button {
  width: 100%;
  padding: 10px;
  background-color: var(--color-accent);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
}
.error {
  color: red;
  margin: 1rem 0;
}
</style>
