import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useStore } from '../../store/useStore';
import { 
  Languages, Moon, Sun, User as UserIcon, 
  Car, TrendingUp, CheckCircle2, ChevronRight 
} from 'lucide-react';

const Onboarding = () => {
  const { t, i18n } = useTranslation();
  const { setLanguage, setTheme, setRole, completeOnboarding, theme } = useStore();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const nextStep = () => setStep(s => s + 1);

  const handleLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setLanguage(lang);
    localStorage.setItem('language', lang);
    nextStep();
  };

  const handleTheme = (t) => {
    setTheme(t);
    nextStep();
  };

  const handleRole = (r) => {
    setRole(r);
    nextStep();
  };

  const finish = async () => {
    setLoading(true);
    const success = await completeOnboarding();
    setLoading(false);
    if (!success) {
      alert("Xatolik yuz berdi. Iltimos qaytadan urinib ko'ring.");
    }
  };

  const variants = {
    enter: { x: 300, opacity: 0 },
    center: { x: 0, opacity: 1 },
    exit: { x: -300, opacity: 0 }
  };

  return (
    <div className="min-h-screen flex flex-col p-6 max-w-md mx-auto relative overflow-hidden">
      <AnimatePresence mode="wait">
        
        {/* STEP 1: LANGUAGE */}
        {step === 1 && (
          <motion.div 
            key="step1"
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            className="flex-1 flex flex-col justify-center"
          >
            <div className="bg-blue-500/10 w-20 h-20 rounded-3xl flex items-center justify-center mb-8 mx-auto animate-pulse">
              <Languages className="text-blue-500 w-10 h-10" />
            </div>
            <h1 className="text-3xl font-bold text-center mb-2">{t('choose_language')}</h1>
            <p className="text-center text-[var(--tg-hint-color)] mb-10">Tilni tanlang / Выберите язык</p>
            
            <div className="space-y-4">
              <button onClick={() => handleLanguage('uz_latn')} className="glass-card w-full flex items-center justify-between group active:scale-95 transition-transform">
                <span className="text-xl font-medium">O'zbekcha</span>
                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                  <ChevronRight className="w-5 h-5 group-hover:text-white" />
                </div>
              </button>
              <button onClick={() => handleLanguage('ru')} className="glass-card w-full flex items-center justify-between group active:scale-95 transition-transform">
                <span className="text-xl font-medium">Русский</span>
                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500 transition-colors">
                  <ChevronRight className="w-5 h-5 group-hover:text-white" />
                </div>
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 2: THEME */}
        {step === 2 && (
          <motion.div 
            key="step2"
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            className="flex-1 flex flex-col justify-center"
          >
            <div className="bg-amber-500/10 w-20 h-20 rounded-3xl flex items-center justify-center mb-8 mx-auto">
              {theme === 'dark' ? <Moon className="text-amber-500 w-10 h-10" /> : <Sun className="text-amber-500 w-10 h-10" />}
            </div>
            <h1 className="text-3xl font-bold text-center mb-10">Mavzuni tanlang</h1>
            
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => handleTheme('dark')}
                className={`glass-card flex flex-col items-center gap-3 ${theme === 'dark' ? 'ring-2 ring-blue-500' : ''}`}
              >
                <Moon className="w-8 h-8 text-blue-400" />
                <span className="font-medium">Tungi</span>
              </button>
              <button 
                onClick={() => handleTheme('light')}
                className={`glass-card flex flex-col items-center gap-3 ${theme === 'light' ? 'ring-2 ring-blue-500' : ''}`}
              >
                <Sun className="w-8 h-8 text-amber-500" />
                <span className="font-medium">Kunduzgi</span>
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 3: ROLE */}
        {step === 3 && (
          <motion.div 
            key="step3"
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            className="flex-1 flex flex-col justify-center"
          >
            <h1 className="text-3xl font-bold text-center mb-2">{t('choose_role')}</h1>
            <p className="text-center text-[var(--tg-hint-color)] mb-10">{t('role_subtitle')}</p>
            
            <div className="space-y-4 text-left">
              <button 
                onClick={() => handleRole('passenger')}
                className="glass-card w-full flex items-center gap-5 group"
              >
                <div className="bg-blue-500/20 p-4 rounded-2xl group-hover:bg-blue-500 transition-colors">
                  <UserIcon className="w-8 h-8 text-blue-500 group-hover:text-white" />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-bold">{t('passenger')}</h3>
                  <p className="text-sm opacity-60">{t('passenger_desc')}</p>
                </div>
              </button>

              <button 
                onClick={() => handleRole('driver')}
                className="glass-card w-full flex items-center gap-5 group"
              >
                <div className="bg-green-500/20 p-4 rounded-2xl group-hover:bg-green-500 transition-colors">
                  <Car className="w-8 h-8 text-green-500 group-hover:text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">{t('driver')}</h3>
                  <p className="text-sm opacity-60">{t('driver_desc')}</p>
                </div>
              </button>
            </div>
          </motion.div>
        )}

        {/* STEP 4: BENEFITS */}
        {step === 4 && (
          <motion.div 
            key="step4"
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            className="flex-1 flex flex-col justify-center"
          >
            <div className="text-center mb-10">
              <div className="bg-green-500/10 w-20 h-20 rounded-full flex items-center justify-center mb-6 mx-auto">
                <CheckCircle2 className="text-green-500 w-12 h-12" />
              </div>
              <h1 className="text-3xl font-bold mb-3">Tayyormisiz?</h1>
              <p className="text-[var(--tg-hint-color)]">Tizim imkoniyatlaridan to'liq foydalanishga tayyormiz</p>
            </div>

            <div className="space-y-4 mb-10">
              <div className="flex items-center gap-4">
                <TrendingUp className="text-blue-500" />
                <span>Safarlar narxlarida erkinlik</span>
              </div>
              <div className="flex items-center gap-4">
                <CheckCircle2 className="text-blue-500" />
                <span>Ishonchli haydovchilar bazasi</span>
              </div>
            </div>

            <button onClick={finish} disabled={loading} className="btn-primary flex items-center justify-center gap-2">
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : t('next')}
            </button>
          </motion.div>
        )}

      </AnimatePresence>

      {/* Progress Dots */}
      <div className="flex justify-center gap-2 mt-auto pb-4">
        {[1, 2, 3, 4].map(i => (
          <div 
            key={i}
            className={`h-1 rounded-full transition-all duration-300 ${step === i ? 'w-8 bg-blue-500' : 'w-2 bg-gray-600/30'}`}
          />
        ))}
      </div>
    </div>
  );
};

export default Onboarding;
