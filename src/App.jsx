import React, { useEffect } from 'react'
import WebApp from '@twa-dev/sdk'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useStore } from './store/useStore'
import { Settings as SettingsIcon } from 'lucide-react'

// Components
import Onboarding from './components/Onboarding/Onboarding'
import Settings from './components/Settings/Settings'

function App() {
  const { theme, isOnboarded, role, setInitData, setUser, setIsOnboarded } = useStore()
  const navigate = useNavigate()
  
  // Telegram WebApp init & theme qo'llash
  useEffect(() => {
    const twa = window.Telegram?.WebApp || WebApp;
    if (twa?.ready) {
      twa.ready();
      twa.expand();
    }
    
    // Auth Validation
    if (twa?.initData) {
      setInitData(twa.initData);
      
      // API orqali tekshirish
      fetch(`${import.meta.env.VITE_API_URL}/auth/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ init_data: twa.initData })
      })
      .then(res => res.json())
      .then(data => {
        if (data.user) {
          setUser(data.user);
          if (data.user.is_onboarded) {
             setIsOnboarded(true);
          }
        }
      })
      .catch(err => console.error("Validation error:", err));
    }
    
    // HTML root ga dark mode class qoshish
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  // Agar onboarding qilinmagan bo'lsa darhol onboardingni ko'rsatamiz
  if (!isOnboarded) {
    return <Onboarding />
  }

  return (
    <div className="min-h-screen bg-[var(--tg-bg-color)] text-[var(--tg-text-color)]">
      <Routes>
        <Route path="/" element={
          <div className="p-6 text-center">
            <div className="flex justify-end mb-4">
               <button onClick={() => navigate('/settings')} className="p-2 opacity-60">
                  <SettingsIcon className="w-6 h-6" />
               </button>
            </div>
            <h1 className="text-2xl font-bold mb-4">Xush kelibsiz!</h1>
            <p className="opacity-70">Sizning rolingiz: <span className="font-bold text-blue-500 uppercase">{role}</span></p>
            <div className="mt-10 p-10 glass-card">
              Keyingi sprintda bu erda asosiy funksiyalar paydo bo'ladi 🔥
            </div>
            <button 
              onClick={() => useStore.getState().resetUser()}
              className="mt-20 text-red-500 text-sm opacity-50 underline"
            >
              Reset (Test uchun)
            </button>
          </div>
        } />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  )
}

export default App
