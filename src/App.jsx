import React, { useEffect } from 'react'
import WebApp from '@twa-dev/sdk'
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom'
import { useStore } from './store/useStore'
import { Settings as SettingsIcon } from 'lucide-react'

// Components
import Onboarding from './components/Onboarding/Onboarding'
import Settings from './components/Settings/Settings'
import BottomNav from './components/Navigation/BottomNav'

// Pages
import BookingPage from './pages/Passenger/BookingPage'
import OffersPage from './pages/Passenger/OffersPage'
import DriverOfferPage from './pages/Driver/DriverOfferPage'
import MyOrdersPage from './pages/Common/MyOrdersPage'
import MyOffersPage from './pages/Driver/MyOffersPage'
import ProfilePage from './pages/Profile/ProfilePage'

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
    <div className="min-h-screen bg-[var(--tg-bg-color)] text-[var(--tg-text-color)] flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <Routes>
            <Route path="/" element={role === 'passenger' ? <BookingPage /> : <MyOrdersPage />} />
            <Route path="/order/:orderId/offers" element={<OffersPage />} />
            <Route path="/driver/order/:orderId" element={<DriverOfferPage />} />
            <Route path="/my-orders" element={<MyOrdersPage />} />
            <Route path="/my-offers" element={<MyOffersPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
      
      <BottomNav />
    </div>
  )
}

export default App
