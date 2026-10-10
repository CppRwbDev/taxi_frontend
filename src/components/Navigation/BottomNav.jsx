import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ClipboardList, Car, User, PlusCircle, Settings, TrendingUp, LayoutDashboard, Users, Wallet } from 'lucide-react';
import { useStore } from '../../store/useStore';

const BottomNav = () => {
  const { role } = useStore();
  const { t } = useTranslation();
  const location = useLocation();

  let navItems = [
    { path: '/', label: t('nav.book', 'Buyurtma'), icon: PlusCircle },
    { path: '/my-orders', label: t('nav.myOrders', 'Buyurtmalarim'), icon: Car },
    { path: '/profile', label: t('nav.profile', 'Profil'), icon: User },
  ];

  if (role === 'driver') {
    navItems = [
      { path: '/', label: t('nav.drivers', "Yo'lovchilar"), icon: Car },
      { path: '/my-offers', label: t('nav.myOffers', 'Takliflarim'), icon: ClipboardList },
      { path: '/profile', label: t('nav.profile', 'Profil'), icon: User },
    ];
  } else if (role === 'investor') {
    navItems = [
      { path: '/wallet', label: t('nav.wallet', 'Hamyon'), icon: Wallet },
      { path: '/profile', label: t('nav.profile', 'Profil'), icon: User },
      { path: '/settings', label: t('nav.settings', 'Sozlamalar'), icon: Settings },
    ];
  } else if (role === 'admin') {
    navItems = [
      { path: '/?tab=stats', label: t('nav.stats', 'Stats'), icon: LayoutDashboard },
      { path: '/?tab=users', label: t('nav.members', "A'zolar"), icon: Users },
      { path: '/settings', label: t('nav.settings', 'Sozlamalar'), icon: Settings },
      { path: '/profile', label: t('nav.profile', 'Profil'), icon: User },
    ];
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[var(--tg-bg-color)] border-t border-white/5 pb-safe pt-2 px-4 shadow-2xl z-50">
      <div className="max-w-md mx-auto flex justify-between items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname + location.search === item.path || (item.path === '/' && location.pathname === '/' && !location.search);
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center gap-1 transition-all flex-1 ${isActive ? 'text-blue-500 scale-110' : 'text-gray-500 opacity-60'}`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-[10px] font-medium truncate w-full text-center">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
