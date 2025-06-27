import { createRouter, createWebHistory } from 'vue-router'

import WelcomeView from '../views/WelcomeView.vue'
import HomeView from '../views/HomeView.vue'
import CreateView from '../views/Create.vue'
import LoginView from '../views/LoginView.vue'
import RegisterView from '../views/RegisterView.vue'
import StatsView from '../views/StatsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'welcome', component: WelcomeView }, // öffentliche Startseite
    { path: '/login', name: 'login', component: LoginView },
    { path: '/register', name: 'register', component: RegisterView },
    {
      path: '/home',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true }
    },
    {
      path: '/create',
      name: 'create',
      component: CreateView,
      meta: { requiresAuth: true }
    },
    {
      path: '/stats',
      name: 'stats',
      component: StatsView,
      meta: { requiresAuth: true }
    }
  ]
})

// ✅ Auth-Guard
router.beforeEach(async (to, from, next) => {
  const { useUserStore } = await import('@/stores/user')
  const userStore = useUserStore()

  const loginErforderlich = to.meta.requiresAuth

  if (loginErforderlich && !userStore.user) {
    next('/login')
  } else {
    next()
  }
})

export default router
