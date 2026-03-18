import React from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../store/useStore';
import { 
  Languages, Moon, Sun, User as UserIcon, 
  Car, Settings as SettingsIcon, ChevronLeft, LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { t, i18n } = useTranslation();
  const { theme, language, role, setTheme, setLanguage, setRole, resetUser } = useStore();
  const navigate = useNavigate();

  const handleLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setLanguage(lang);
    localStorage.setItem('language', lang);
  };

  return (
    <div className="min-h-screen p-6">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 glass-card rounded-full active:scale-90 transition-transform">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold">Sozlamalar</h1>
      </div>

      <div className="space-y-6">
        {/* Til */}
        <section>
          <h2 className="text-[var(--tg-hint-color)] text-sm font-medium uppercase mb-3 px-2">Til</h2>
          <div className="glass-card overflow-hidden !p-0">
            <button 
              onClick={() => handleLanguage('uz_latn')}
              className={`w-full flex items-center justify-between p-4 border-b border-white/5 ${language === 'uz_latn' ? 'text-blue-500' : ''}`}
            >
              <span>O'zbekcha (Lotin)</span>
              {language === 'uz_latn' && <div className="w-2 h-2 rounded-full bg-blue-500" />}
            </button>
            <button 
              onClick={() => handleLanguage('ru')}
              className={`w-full flex items-center justify-between p-4 ${language === 'ru' ? 'text-blue-500' : ''}`}
            >
              <span>Русский</span>
              {language === 'ru' && <div className="w-2 h-2 rounded-full bg-blue-500" />}
            </button>
          </div>
        </section>

        {/* Mavzu */}
        <section>
          <h2 className="text-[var(--tg-hint-color)] text-sm font-medium uppercase mb-3 px-2">Rejim</h2>
          <div className="glass-card flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              {theme === 'dark' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
              <span>Qorong'u mavzu</span>
            </div>
            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className={`w-12 h-6 rounded-full relative transition-colors ${theme === 'dark' ? 'bg-blue-600' : 'bg-gray-400'}`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${theme === 'dark' ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
        </section>

        {/* Rol */}
        <section>
          <h2 className="text-[var(--tg-hint-color)] text-sm font-medium uppercase mb-3 px-2">Rolingiz</h2>
          <div className="glass-card overflow-hidden !p-0">
            <button 
              onClick={() => setRole('passenger')}
              className={`w-full flex items-center justify-between p-4 border-b border-white/5 ${role === 'passenger' ? 'text-blue-500' : ''}`}
            >
              <div className="flex items-center gap-3">
                <UserIcon className="w-5 h-5" />
                <span>Yo'lovchi</span>
              </div>
            </button>
            <button 
              onClick={() => setRole('driver')}
              className={`w-full flex items-center justify-between p-4 ${role === 'driver' ? 'text-blue-500' : ''}`}
            >
              <div className="flex items-center gap-3">
                <Car className="w-5 h-5" />
                <span>Haydovchi</span>
              </div>
            </button>
          </div>
        </section>

        {/* Reset */}
        <button 
          onClick={() => {
            if(window.confirm("Haqiqatdan ham akkauntingizni reset qilmoqchimisiz?")) {
              resetUser();
            }
          }}
          className="w-full text-red-500 flex items-center justify-center gap-2 p-4 mt-10 opacity-60"
        >
          <LogOut className="w-5 h-5" />
          <span>Akkauntni reset qilish</span>
        </button>
      </div>
    </div>
  );
};

export default Settings;
