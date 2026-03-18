import React from 'react';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../store/useStore';
import { 
  Languages, Moon, Sun, User as UserIcon, 
  Car, Settings as SettingsIcon, ChevronLeft, LogOut,
  Shield, ShieldCheck, Briefcase, Wallet, Bell, HelpCircle,
  TrendingUp, ChevronRight
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
        <h1 className="text-2xl font-black bg-gradient-to-r from-blue-500 to-blue-300 bg-clip-text text-transparent">
          {t('settings.title', 'Sozlamalar')}
        </h1>
      </div>

      <div className="space-y-6 animate-slide-up">
        {/* Admin Section */}
        {user?.role === 'admin' && (
          <section className="animate-pulse-subtle">
             <h2 className="text-purple-500 text-[10px] font-black uppercase mb-3 px-2 tracking-widest">Admin Boshqaruvi</h2>
             <button 
                onClick={() => navigate('/?tab=stats')}
                className="w-full glass-card p-4 flex items-center justify-between border-l-4 border-l-purple-500 bg-gradient-to-r from-purple-500/5 to-transparent shadow-lg shadow-purple-500/10"
             >
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-purple-500/20 rounded-xl">
                    <ShieldCheck className="w-5 h-5 text-purple-500" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-black">Admin Dashboard</div>
                    <div className="text-[10px] opacity-40 uppercase font-bold">Tizimni boshqarish</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                   <TrendingUp className="w-4 h-4 text-purple-500 opacity-40" />
                   <ChevronRight className="w-4 h-4 opacity-20" />
                </div>
             </button>
          </section>
        )}

        {/* Til */}
        <section>
          <h2 className="text-[var(--tg-hint-color)] text-[10px] font-black uppercase mb-3 px-2 tracking-widest opacity-50">Ilova Tili</h2>
          <div className="glass-card overflow-hidden !p-0">
            <button 
              onClick={() => handleLanguage('uz_latn')}
              className={`w-full flex items-center justify-between p-4 border-b border-white/5 active:bg-white/5 transition-colors ${language === 'uz_latn' ? 'text-blue-500' : ''}`}
            >
              <div className="flex items-center gap-3">
                <Languages className="w-5 h-5 opacity-40" />
                <span className="text-sm font-bold">O'zbekcha (Lotin)</span>
              </div>
              {language === 'uz_latn' && <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />}
            </button>
            <button 
              onClick={() => handleLanguage('ru')}
              className={`w-full flex items-center justify-between p-4 active:bg-white/5 transition-colors ${language === 'ru' ? 'text-blue-500' : ''}`}
            >
              <div className="flex items-center gap-3">
                <Languages className="w-5 h-5 opacity-40" />
                <span className="text-sm font-bold">Русский</span>
              </div>
              {language === 'ru' && <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />}
            </button>
          </div>
        </section>

        {/* Rejim */}
        <section>
          <h2 className="text-[var(--tg-hint-color)] text-[10px] font-black uppercase mb-3 px-2 tracking-widest opacity-50">Ko'rinish</h2>
          <div className="glass-card flex items-center justify-between p-4 px-5">
            <div className="flex items-center gap-4">
              <div className="p-2 bg-blue-500/10 rounded-xl">
                 {theme === 'dark' ? <Moon className="w-5 h-5 text-blue-500" /> : <Sun className="w-5 h-5 text-blue-500" />}
              </div>
              <span className="text-sm font-bold">Qorong'u mavzu</span>
            </div>
            <button 
              onClick={() => handleTheme(theme === 'dark' ? 'light' : 'dark')}
              className={`w-12 h-6 rounded-full relative transition-all duration-300 ${theme === 'dark' ? 'bg-blue-600' : 'bg-gray-400'}`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow-md transition-all duration-300 ${theme === 'dark' ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
        </section>

        {/* Rol Tanlash */}
        <section>
          <h2 className="text-[var(--tg-hint-color)] text-[10px] font-black uppercase mb-3 px-2 tracking-widest opacity-50">Rol va Imkoniyatlar</h2>
          <div className="glass-card grid grid-cols-2 gap-2 !bg-transparent !border-0 !p-0">
            {[
              { id: 'passenger', label: 'Yo\'lovchi', icon: UserIcon, color: 'text-blue-500', bg: 'bg-blue-500/10' },
              { id: 'driver', label: 'Haydovchi', icon: Car, color: 'text-green-500', bg: 'bg-green-500/10' },
              { id: 'investor', label: 'Investor', icon: Briefcase, color: 'text-orange-500', bg: 'bg-orange-500/10' },
              { id: 'admin', label: 'Admin', icon: Shield, color: 'text-purple-500', bg: 'bg-purple-500/10' }
            ].map(r => (
              (r.id !== 'admin' || user?.role === 'admin') && (
                <button
                  key={r.id}
                  onClick={() => handleRole(r.id)}
                  className={`flex flex-col items-center justify-center p-4 rounded-2xl border-2 transition-all active:scale-95 ${
                    role === r.id 
                    ? `border-blue-500 bg-blue-500/10 shadow-lg shadow-blue-500/10` 
                    : 'border-white/5 opacity-40 grayscale hover:grayscale-0 hover:opacity-100 hover:border-white/20'
                  }`}
                >
                  <div className={`p-2 rounded-xl mb-2 ${r.bg} ${r.color}`}>
                    <r.icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-wider">{r.label}</span>
                </button>
              )
            ))}
          </div>
        </section>

        {/* Qo'shimcha */}
        <section>
           <h2 className="text-[var(--tg-hint-color)] text-[10px] font-black uppercase mb-3 px-2 tracking-widest opacity-50">Moliya va Yordam</h2>
           <div className="glass-card overflow-hidden !p-0">
              <button 
                onClick={() => navigate('/wallet')}
                className="w-full flex items-center justify-between p-4 border-b border-white/5 active:bg-white/5"
              >
                <div className="flex items-center gap-3">
                  <Wallet className="w-5 h-5 text-green-500" />
                  <span className="text-sm font-bold">Mening hamyonim</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-20" />
              </button>
              <button 
                className="w-full flex items-center justify-between p-4 border-b border-white/5 active:bg-white/5"
              >
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-blue-500" />
                  <span className="text-sm font-bold">Xabarnomalar</span>
                </div>
                <div className="px-2 py-0.5 bg-blue-500/20 text-blue-500 text-[10px] font-black rounded-lg uppercase">Yoqilgan</div>
              </button>
              <button 
                className="w-full flex items-center justify-between p-4 active:bg-white/5"
              >
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-orange-500" />
                  <span className="text-sm font-bold">Yordam va qo'llab-quvvatlash</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-20" />
              </button>
           </div>
        </section>

        {/* Reset / Logout */}
        <section className="pt-4">
          <button 
            onClick={() => {
              if(window.confirm("Haqiqatdan ham akkauntingizni reset qilmoqchimisiz?")) {
                resetUser();
              }
            }}
            className="w-full glass-card border-red-500/20 flex items-center justify-center gap-3 p-5 text-red-500 active:bg-red-500/10 transition-colors shadow-lg shadow-red-500/5 group"
          >
            <LogOut className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
            <span className="text-sm font-black uppercase tracking-widest italic opacity-80">Hisobdan chiqish</span>
          </button>
          <div className="text-center mt-6">
             <div className="text-[10px] font-black opacity-10 uppercase tracking-[0.2em]">Taxi Terminal App v2.4.0</div>
             <div className="text-[8px] opacity-10 mt-1">DarkDev Team tomonidan ishlab chiqilgan</div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Settings;
