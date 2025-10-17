import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { authApi, User } from '@/lib/api'
import { toast } from 'sonner'

interface AuthState {
  user: User | null
  token: string | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (data: any) => Promise<void>
  logout: () => void
  checkAuth: () => Promise<void>
  updateUser: (user: User) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isLoading: true,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        try {
          const response = await authApi.login({ email, password })
          localStorage.setItem('token', response.token)
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
          })
          toast.success(`Welcome back, ${response.user.name}!`)
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || error.message || 'Login failed. Please check your credentials.'
          toast.error(errorMessage)
          console.error('Login error:', error)
          throw error
        }
      },

      register: async (data: any) => {
        try {
          const response = await authApi.register(data)
          localStorage.setItem('token', response.token)
          set({
            user: response.user,
            token: response.token,
            isAuthenticated: true,
          })
          toast.success('Account created successfully!')
        } catch (error: any) {
          toast.error(error.response?.data?.message || 'Registration failed')
          throw error
        }
      },

      logout: () => {
        localStorage.removeItem('token')
        set({
          user: null,
          token: null,
          isAuthenticated: false,
        })
        toast.success('Logged out successfully')
      },

      checkAuth: async () => {
        const token = localStorage.getItem('token')
        
        // Validate token format (JWT should have 2 dots)
        if (!token || token.split('.').length !== 3) {
          console.warn('Invalid or missing token, clearing auth')
          localStorage.removeItem('token')
          localStorage.removeItem('auth-storage')
          set({ 
            isLoading: false, 
            isAuthenticated: false, 
            user: null,
            token: null 
          })
          return
        }

        try {
          const user = await authApi.getCurrentUser()
          set({
            user,
            token,
            isAuthenticated: true,
            isLoading: false,
          })
        } catch (error) {
          // Token is invalid or expired, clear everything
          console.error('Auth check failed:', error)
          localStorage.removeItem('token')
          localStorage.removeItem('auth-storage')
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          })
        }
      },

      updateUser: (user: User) => {
        set({ user })
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    }
  )
)
