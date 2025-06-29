<template>
  <div class="auth">
    <h1>Registrieren</h1>
    <form @submit.prevent="registrieren">
      <input v-model="username" placeholder="Benutzername" required />
      <input v-model="password" type="password" placeholder="Passwort" required />
      <button type="submit">Konto erstellen</button>
    </form>
    <p class="error" v-if="fehlermeldung">{{ fehlermeldung }}</p>
    <RouterLink to="/login" class="login-link">Schon registriert? Login</RouterLink>
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
  fehlermeldung.value = ''
  try {
    userStore.register(username.value, password.value)
    router.push('/')
  } catch (err) {
    fehlermeldung.value = err.message || 'Registrierung fehlgeschlagen'
  }
}
</script>

<style scoped>
.auth {
  max-width: 400px;
  margin: 3rem auto;
  padding: 2rem;
  background: #fff8ee; /* Beige Hintergrund */
  border-radius: 1rem;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.05);
  border: 1px solid #f7e6c1;
}

input {
  width: 100%;
  padding: 10px;
  margin-bottom: 1rem;
  border: 1px solid #e0d8c3;
  border-radius: 8px;
}

button {
  width: 100%;
  padding: 10px;
  background-color: #f5a623; /* Orange */
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #e09b1a;
}

.error {
  color: red;
  margin: 1rem 0;
  text-align: center;
}

.login-link {
  display: block;
  margin-top: 1rem;
  text-align: center;
  color: #3a2f27;
  font-weight: 500;
  text-decoration: underline;
}
</style>
