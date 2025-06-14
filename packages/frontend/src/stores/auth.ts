import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { auth } from '@/lib/supabase'
import type { User, Session } from '@supabase/supabase-js'

export const useAuthStore = defineStore('auth', () => {
  // State
  const user = ref<User | null>(null)
  const session = ref<Session | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Computed
  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => user.value?.user_metadata?.role === 'admin')

  // Actions
  const signUp = async (email: string, password: string) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: authError } = await auth.signUp(email, password)

      if (authError) {
        error.value = authError.message
        return { success: false, error: authError.message }
      }

      if (data.user) {
        user.value = data.user
        session.value = data.session
      }

      return { success: true, data }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign up failed'
      error.value = message
      return { success: false, error: message }
    } finally {
      loading.value = false
    }
  }

  const signIn = async (email: string, password: string) => {
    loading.value = true
    error.value = null

    try {
      const { data, error: authError } = await auth.signIn(email, password)

      if (authError) {
        error.value = authError.message
        return { success: false, error: authError.message }
      }

      if (data.user) {
        user.value = data.user
        session.value = data.session
      }

      return { success: true, data }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign in failed'
      error.value = message
      return { success: false, error: message }
    } finally {
      loading.value = false
    }
  }

  const signOut = async () => {
    loading.value = true
    error.value = null

    try {
      const { error: authError } = await auth.signOut()

      if (authError) {
        error.value = authError.message
        return { success: false, error: authError.message }
      }

      user.value = null
      session.value = null

      return { success: true }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign out failed'
      error.value = message
      return { success: false, error: message }
    } finally {
      loading.value = false
    }
  }

  const loadUser = async () => {
    loading.value = true
    error.value = null

    try {
      const { user: currentUser, error: userError } = await auth.getUser()

      if (userError) {
        error.value = userError.message
        return { success: false, error: userError.message }
      }

      const { session: currentSession, error: sessionError } = await auth.getSession()

      if (sessionError) {
        error.value = sessionError.message
        return { success: false, error: sessionError.message }
      }

      user.value = currentUser
      session.value = currentSession

      return { success: true, user: currentUser, session: currentSession }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load user'
      error.value = message
      return { success: false, error: message }
    } finally {
      loading.value = false
    }
  }

  const clearError = () => {
    error.value = null
  }

  return {
    // State
    user,
    session,
    loading,
    error,

    // Computed
    isAuthenticated,
    isAdmin,

    // Actions
    signUp,
    signIn,
    signOut,
    loadUser,
    clearError,
  }
})
