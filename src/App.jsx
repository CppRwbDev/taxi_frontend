import React, { useEffect } from 'react'
import WebApp from '@twa-dev/sdk'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useStore } from './store/useStore'

// Components
import Onboarding from './components/Onboarding/Onboarding'

function App() {
  const { theme, isOnboarded, role } = useStore()
  
  // Telegram WebApp init & theme qo'llash
  useEffect(() => {
    const twa = window.Telegram?.WebApp || WebApp;
    if (twa?.ready) {
      twa.ready();
      twa.expand();
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
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  )
}

export default App
