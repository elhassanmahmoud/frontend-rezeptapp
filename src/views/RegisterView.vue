<template>
  <div class="auth">
    <h1>📝 Registrieren</h1>
    <form @submit.prevent="registrieren">
      <input v-model="username" placeholder="Benutzername" required />
      <input v-model="password" type="password" placeholder="Passwort" required />
      <button>Konto erstellen</button>
    </form>
    <p class="error" v-if="fehlermeldung">{{ fehlermeldung }}</p>
    <RouterLink to="/login">Schon registriert? Login</RouterLink>
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

function registrieren() {
  try {
    userStore.register(username.value, password.value)
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
