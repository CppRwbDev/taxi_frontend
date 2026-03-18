import React from 'react';
import { NavLink } from 'react-router-dom';
import { ClipboardList, Car, User, PlusCircle, Settings } from 'lucide-react';
import { useStore } from '../../store/useStore';

const BottomNav = () => {
  const { role } = useStore();

  let navItems = [
    { path: '/', label: 'Buyurtma', icon: PlusCircle },
    { path: '/my-orders', label: 'Takliflar', icon: Car },
    { path: '/profile', label: 'Profil', icon: User },
  ];

  if (role === 'driver') {
    navItems = [
      { path: '/', label: 'Yo\'lovchilar', icon: Car },
      { path: '/my-offers', label: 'Buyurtmalar', icon: ClipboardList },
      { path: '/profile', label: 'Profil', icon: User },
    ];
  } else if (role === 'admin') {
    navItems = [
      { path: '/', label: 'Dashboard', icon: ClipboardList },
      { path: '/admin/users', label: 'Foydalanuvchilar', icon: User },
      { path: '/settings', label: 'Sozlamalar', icon: Settings },
    ];
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-[var(--tg-bg-color)] border-t border-white/5 pb-safe pt-2 px-4 shadow-2xl z-50">
      <div className="max-w-md mx-auto flex justify-between items-center h-16">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                `flex flex-col items-center gap-1 transition-all flex-1 ${isActive ? 'text-blue-500 scale-110' : 'text-gray-500 opacity-60'}`
              }
            >
              <Icon className="w-6 h-6" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
