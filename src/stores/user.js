import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useUserStore = defineStore('user', () => {
  const user = ref(JSON.parse(localStorage.getItem('currentUser')) || null)
  const users = ref(JSON.parse(localStorage.getItem('users')) || [])

  function register(username, password) {
    if (users.value.find(u => u.username === username)) {
      throw new Error('Benutzer existiert bereits')
    }
    const newUser = { username, password }
    users.value.push(newUser)
    localStorage.setItem('users', JSON.stringify(users.value))
    user.value = newUser
  }

  function login(username, password) {
    const found = users.value.find(u => u.username === username && u.password === password)
    if (!found) {
      throw new Error('Benutzername oder Passwort falsch')
    }
    user.value = found
  }

  function logout() {
    user.value = null
  }

  // Speichere aktuellen Nutzer bei jeder Änderung
  watch(user, (newUser) => {
    localStorage.setItem('currentUser', JSON.stringify(newUser))
  }, { deep: true })

  return { user, register, login, logout }
})
