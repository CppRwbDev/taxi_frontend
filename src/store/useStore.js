import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useStore = create(
  persist(
    (set) => ({
      theme: 'dark', // 'dark' yoki 'light'
      language: 'uz_latn', // 'uz_latn' yoki 'uz_cyrl'
      role: null, // 'passenger', 'driver', 'investor'
      isOnboarded: false,

      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      setRole: (role) => set({ role }),
      setIsOnboarded: (status) => set({ isOnboarded: status }),
      
      // Logout / Reset
      resetUser: () => set({ role: null, isOnboarded: false })
    }),
    {
      name: 'taxi-storage', // local storage key
    }
  )
)
