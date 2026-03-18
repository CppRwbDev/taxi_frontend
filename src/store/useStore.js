import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      theme: 'dark', 
      language: 'uz_latn', 
      role: null, 
      isOnboarded: false,
      initData: '',

      // API Actions
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      setRole: (role) => set({ role }),
      setIsOnboarded: (status) => set({ isOnboarded: status }),
      setInitData: (initData) => set({ initData }),
      setUser: (user) => {
        set({ user });
        if (user) {
          if (user.role) set({ role: user.role });
          if (user.theme) set({ theme: user.theme });
          if (user.language) set({ language: user.language });
          set({ isOnboarded: user.is_onboarded });
        }
      },
      
      // Async Actions
      completeOnboarding: async () => {
        const { language, theme, role, initData } = get();
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/onboarding?init_data=${encodeURIComponent(initData)}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ language, theme, role }),
          });
          if (response.ok) {
            const user = await response.json();
            set({ user, isOnboarded: true });
            return true;
          }
        } catch (error) {
          console.error('Onboarding error:', error);
        }
        return false;
      },

      // Sync User Profile (Save settings to backend)
      syncUser: async (updates) => {
        const { initData, setUser } = get();
        try {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/users/me`, {
            method: 'PATCH',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `tma_${initData}`
            },
            body: JSON.stringify(updates),
          });
          if (response.ok) {
            const user = await response.json();
            setUser(user);
            return true;
          }
        } catch (error) {
          console.error('Sync error:', error);
        }
        return false;
      },

      // Logout / Reset
      resetUser: () => set({ role: null, isOnboarded: false, user: null })
    }),
    {
      name: 'taxi-storage', 
    }
  )
)
