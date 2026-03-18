import React from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../store/useStore';
import { 
  Languages, Moon, Sun, User as UserIcon, 
  Car, Settings as SettingsIcon, ChevronLeft, LogOut,
  Shield, Briefcase, ChevronRight, HelpCircle, Bell
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { t, i18n } = useTranslation();
  const { theme, language, role, user, setTheme, setLanguage, setRole, resetUser, syncUser } = useStore();
  const navigate = useNavigate();

  const handleLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setLanguage(lang);
    localStorage.setItem('language', lang);
    syncUser({ language: lang });
  };

  const handleTheme = (t) => {
    setTheme(t);
    syncUser({ theme: t });
  };

  const handleRole = (r) => {
    setRole(r);
    syncUser({ role: r });
  };

  return (
    <div className="min-h-screen p-6 pb-32">
      <div className="flex items-center gap-4 mb-8">
        <button onClick={() => navigate(-1)} className="p-2 glass-card rounded-full active:scale-90 transition-transform">
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold">{t('settings.title', 'Sozlamalar')}</h1>
      </div>

      <div className="space-y-6">
        {/* Til */}
        <section>
          <h2 className="text-[var(--tg-hint-color)] text-sm font-medium uppercase mb-3 px-2">Til</h2>
          <div className="glass-card overflow-hidden !p-0 shadow-lg">
            <button 
              onClick={() => handleLanguage('uz_latn')}
              className={`w-full flex items-center justify-between p-4 border-b border-white/5 active:bg-white/5 transition-colors ${language === 'uz_latn' ? 'text-blue-500' : ''}`}
            >
              <div className="flex items-center gap-3">
                <Languages className="w-5 h-5 opacity-40" />
                <span>O'zbekcha (Lotin)</span>
              </div>
              {language === 'uz_latn' && <div className="w-2 h-2 rounded-full bg-blue-500" />}
            </button>
            <button 
              onClick={() => handleLanguage('ru')}
              className={`w-full flex items-center justify-between p-4 active:bg-white/5 transition-colors ${language === 'ru' ? 'text-blue-500' : ''}`}
            >
              <div className="flex items-center gap-3">
                <Languages className="w-5 h-5 opacity-40" />
                <span>Русский</span>
              </div>
              {language === 'ru' && <div className="w-2 h-2 rounded-full bg-blue-500" />}
            </button>
          </div>
        </section>

        {/* Mavzu */}
        <section>
          <h2 className="text-[var(--tg-hint-color)] text-sm font-medium uppercase mb-3 px-2">Rejim</h2>
          <div className="glass-card flex items-center justify-between p-4 shadow-lg">
            <div className="flex items-center gap-3">
              {theme === 'dark' ? <Moon className="w-5 h-5 text-blue-500" /> : <Sun className="w-5 h-5 text-yellow-500" />}
              <span>Qorong'u mavzu</span>
            </div>
            <button 
              onClick={() => handleTheme(theme === 'dark' ? 'light' : 'dark')}
              className={`w-12 h-6 rounded-full relative transition-colors ${theme === 'dark' ? 'bg-blue-600' : 'bg-gray-400'}`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${theme === 'dark' ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
        </section>

        {/* Rol Tanlash */}
        <section>
          <h2 className="text-[var(--tg-hint-color)] text-sm font-medium uppercase mb-3 px-2">Rolingiz</h2>
          <div className="glass-card overflow-hidden !p-0 shadow-lg">
            {[
              { id: 'passenger', label: 'Yo\'lovchi', icon: UserIcon },
              { id: 'driver', label: 'Haydovchi', icon: Car },
              { id: 'investor', label: 'Investor', icon: Briefcase },
              { id: 'admin', label: 'Admin', icon: Shield }
            ].map((r, index, arr) => (
              <button 
                key={r.id}
                onClick={() => handleRole(r.id)}
                className={`w-full flex items-center justify-between p-4 active:bg-white/5 transition-colors ${index !== arr.length - 1 ? 'border-b border-white/5' : ''} ${role === r.id ? 'text-blue-500' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <r.icon className="w-5 h-5 opacity-40" />
                  <span>{r.label}</span>
                </div>
                {role === r.id && <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />}
              </button>
            ))}
          </div>
        </section>

        {/* Qo'shimcha */}
        <section>
           <h2 className="text-[var(--tg-hint-color)] text-sm font-medium uppercase mb-3 px-2">Ilova</h2>
           <div className="glass-card overflow-hidden !p-0 shadow-lg">
              <button 
                className="w-full flex items-center justify-between p-4 border-b border-white/5 active:bg-white/5"
              >
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 opacity-40" />
                  <span>Xabarnomalar</span>
                </div>
                <div className="px-2 py-0.5 bg-blue-500/10 text-blue-500 text-[10px] font-bold rounded">Yoqilgan</div>
              </button>
              <button 
                className="w-full flex items-center justify-between p-4 active:bg-white/5"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 opacity-40" />
                  <span>Yordam va qo'llab-quvvatlash</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-20" />
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
          className="w-full text-red-500 flex items-center justify-center gap-2 p-4 mt-8 opacity-60 active:opacity-100 transition-opacity"
        >
          <LogOut className="w-5 h-5" />
          <span>Hisobdan chiqish</span>
        </button>
      </div>
    </div>
  );
};

export default Settings;
