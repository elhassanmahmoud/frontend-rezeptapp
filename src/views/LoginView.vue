<template>
  <div class="auth">
    <h1>Login</h1>
    <form @submit.prevent="einloggen">
      <input v-model="username" placeholder="Benutzername" required />
      <input v-model="password" type="password" placeholder="Passwort" required />
      <button type="submit">Einloggen</button>
    </form>
    <p class="error" v-if="fehlermeldung">{{ fehlermeldung }}</p>
    <RouterLink to="/register" class="register-link">Noch kein Konto? Registrieren</RouterLink>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'

const username = ref('')
const password = ref('')
const fehlermeldung = ref('')
const userStore = useUserStore()
const router = useRouter()

function einloggen() {
  fehlermeldung.value = ''
  try {
    userStore.login(username.value, password.value)
    router.push('/home')
  } catch (err) {
    fehlermeldung.value = err.message || 'Login fehlgeschlagen'
  }
}
</script>

<style scoped>
.auth {
  max-width: 400px;
  margin: 3rem auto;
  padding: 2rem;
  background: #fff8ee; /* gleiche Farbe wie Karten oder Navbar */
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
  background-color: #f5a623; /* Orange Ton */
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

.register-link {
  display: block;
  margin-top: 1rem;
  text-align: center;
  color: #3a2f27;
  font-weight: 500;
  text-decoration: underline;
}
</style>
