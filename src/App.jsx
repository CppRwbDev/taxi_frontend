import React, { useEffect, useState, useCallback } from 'react'
import WebApp from '@twa-dev/sdk'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useStore } from './store/useStore'
import { AlertTriangle, RefreshCw, Loader2 } from 'lucide-react'
import { readErrorMessage } from './utils/api'

// Components
import Onboarding from './components/Onboarding/Onboarding'
import Settings from './components/Settings/Settings'
import BottomNav from './components/Navigation/BottomNav'

// Pages
import BookingPage from './pages/Passenger/BookingPage'
import DriverOrderList from './pages/Driver/DriverOrderList'
import OffersPage from './pages/Passenger/OffersPage'
import DriverOfferPage from './pages/Driver/DriverOfferPage'
import MyOrdersPage from './pages/Common/MyOrdersPage'
import MyOffersPage from './pages/Driver/MyOffersPage'
import ProfilePage from './pages/Profile/ProfilePage'
import WalletPage from './pages/Profile/WalletPage'
import AdminDashboard from './pages/Admin/AdminDashboard'

/** Auth holatini ko'rsatadi: yuklanmoqda / xato + qayta urinish. */
function AuthGate({ checking, error, user, hasInitData, onRetry, children }) {
  if (checking) {
    return (
      <div className="flex flex-col items-center justify-center p-16 gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <p className="text-sm opacity-60">Hisobingiz tekshirilmoqda...</p>
      </div>
    )
  }
  if (error) {
    return (
      <div className="p-6">
        <div className="glass-card border-red-500/30 text-center space-y-4 py-10">
          <AlertTriangle className="w-10 h-10 mx-auto text-red-500" />
          <p className="text-sm opacity-80 px-4">{error}</p>
          <button
            onClick={onRetry}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold active:scale-95 transition-transform"
          >
            <RefreshCw className="w-4 h-4" /> Qayta urinish
          </button>
        </div>
      </div>
    )
  }
  // initData bor, lekin validate hali user bermagan (yoki yiqilgan) holat
  if (hasInitData && !user) {
    return (
      <div className="flex flex-col items-center justify-center p-16 gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
        <p className="text-sm opacity-60">Profil yuklanmoqda...</p>
      </div>
    )
  }
  return children
}

function App() {
  const { theme, isOnboarded, role, user, initData, setInitData, setUser } = useStore()
  const [authChecking, setAuthChecking] = useState(false)
  const [authError, setAuthError] = useState(null)

  const validate = useCallback(async (rawInitData) => {
    if (!rawInitData) return
    setAuthChecking(true)
    setAuthError(null)
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/validate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ init_data: rawInitData })
      })
      const data = await res.json().catch(() => null)
      if (res.ok && data?.user) {
        setUser(data.user)
      } else {
        setAuthError(await readErrorMessage(res, "Sizning sessiyangiz muddati tugagan"))
        setUser(null)
      }
    } catch (err) {
      console.error("Validation error:", err)
      setAuthError("Server bilan aloqa o'rnatilmadi")
      setUser(null)
    } finally {
      setAuthChecking(false)
    }
  }, [setUser])

  // Auth Validation - Faqat bir marta
  useEffect(() => {
    const twa = window.Telegram?.WebApp || WebApp;
    if (twa?.ready) {
      twa.ready();
      twa.expand();
    }

    if (twa?.initData) {
      setInitData(twa.initData);
      validate(twa.initData)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Faqat mountda

  // Theme qo'llash
  useEffect(() => {
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

  const retryAuth = () => {
    const twa = window.Telegram?.WebApp || WebApp
    if (twa?.initData) validate(twa.initData)
    else setAuthError(null)
  }

  const gateProps = {
    checking: authChecking,
    error: authError,
    user,
    hasInitData: Boolean(initData),
    onRetry: retryAuth,
  }

  const renderHome = () => {
    if (authChecking || authError || (initData && !user)) {
      return <AuthGate {...gateProps}><MyOrdersPage /></AuthGate>
    }
    if (role === 'admin') return <AdminDashboard />;
    if (role === 'passenger') return <BookingPage />;
    if (role === 'driver') return <DriverOrderList />;
    if (role === 'investor') return <WalletPage />;
    // Rol hali tanlanmagan (onboarding tugallanmagan) holat
    return <MyOrdersPage />;
  };

  return (
    <div className="min-h-screen bg-[var(--tg-bg-color)] text-[var(--tg-text-color)] flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <Routes>
            <Route path="/" element={renderHome()} />
            <Route path="/order/:orderId/offers" element={<AuthGate {...gateProps}><OffersPage /></AuthGate>} />
            <Route path="/driver/order/:orderId" element={<AuthGate {...gateProps}><DriverOfferPage /></AuthGate>} />
            <Route path="/my-orders" element={<AuthGate {...gateProps}><MyOrdersPage /></AuthGate>} />
            <Route path="/my-offers" element={<AuthGate {...gateProps}><MyOffersPage /></AuthGate>} />
            <Route path="/profile" element={<AuthGate {...gateProps}><ProfilePage /></AuthGate>} />
            <Route path="/wallet" element={<AuthGate {...gateProps}><WalletPage /></AuthGate>} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
      
      <BottomNav />
    </div>
  )
}

export default App
