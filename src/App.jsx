import { useEffect } from 'react'
import { useStore } from './store/useStore'
import WebApp from '@twa-dev/sdk'

function App() {
  const theme = useStore((state) => state.theme)
  
  // Telegram WebApp init & theme qo'llash
  useEffect(() => {
    WebApp.ready()
    WebApp.expand()
    
    // HTML root ga dark mode class qoshish
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [theme])

  return (
    <div className="min-h-screen p-4 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-primary-500 mb-4">
        Viloyatlararo Taksi
      </h1>
      <p className="text-center opacity-80 mb-6">
        Telegram Mini App (Frontend) muvaffaqiyatli ishga tushdi!
      </p>
      
      {/* Test qismi */}
      <div className="bg-white dark:bg-dark-surface p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-dark-border max-w-sm w-full">
         <h2 className="text-xl font-semibold mb-3">Tizim holati</h2>
         <ul className="space-y-2 opacity-90">
           <li className="flex justify-between">
             <span>Platforma:</span> 
             <span className="font-mono text-primary-500">{WebApp.platform || 'web'}</span>
           </li>
           <li className="flex justify-between">
             <span>Rejim:</span> 
             <span className="font-mono text-primary-500">{theme}</span>
           </li>
         </ul>
      </div>
    </div>
  )
}

export default App
