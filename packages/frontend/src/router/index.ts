import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AuthView from '../views/AuthView.vue'
import WindowsExplorerView from '@/views/WindowsExplorerView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/explorer',
    },
    {
      path: '/auth',
      name: 'auth',
      component: AuthView,
      meta: { requiresGuest: true },
    },
    {
      path: '/explorer',
      name: 'explorer',
      component: WindowsExplorerView,
      meta: { requiresAuth: true },
    },
  ],
})

// Navigation guards
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  // Load user if not already loaded
  if (!authStore.user && !authStore.loading) {
    await authStore.loadUser()
  }

  // Check authentication requirements
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/auth')
  } else if (to.meta.requiresGuest && authStore.isAuthenticated) {
    next('/explorer')
  } else {
    next()
  }
})

export default router
