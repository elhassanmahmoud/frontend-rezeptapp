import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import CreateView from '../views/Create.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import StatsView from '../views/StatsView.vue' // ✅ NEU

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    { path: '/about', name: 'about', component: AboutView },
    { path: '/create', name: 'create', component: CreateView },
    { path: '/login', name: 'login', component: LoginView },
    { path: '/register', name: 'register', component: RegisterView },
    { path: '/stats', name: 'stats', component: StatsView } // ✅ NEU
  ]
})

// ✅ Auth-Guard (nur eingeloggte Nutzer dürfen auf geschützte Seiten)
router.beforeEach(async (to, from, next) => {
  const { useUserStore } = await import('@/stores/user')
  const userStore = useUserStore()

  const geschuetzteSeiten = ['/create']
  const loginErforderlich = geschuetzteSeiten.includes(to.path)

  if (loginErforderlich && !userStore.user) {
    next('/login')
  } else {
    next()
  }
})

export default router
