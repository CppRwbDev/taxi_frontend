import React from 'react';
import { Users, ClipboardList, TrendingUp } from 'lucide-react';

const AdminDashboard = () => {
  return (
    <div className="p-6 space-y-6 pb-32">
      <header>
        <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">
          Admin Panel
        </h1>
        <p className="text-sm opacity-70">Umumiy statistika va boshqaruv</p>
      </header>

      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card p-4 flex flex-col items-center justify-center gap-2">
          <Users className="w-8 h-8 text-blue-500" />
          <div className="text-2xl font-bold">124</div>
          <div className="text-xs opacity-70 text-center">Foydalanuvchilar</div>
        </div>
        <div className="glass-card p-4 flex flex-col items-center justify-center gap-2">
          <ClipboardList className="w-8 h-8 text-green-500" />
          <div className="text-2xl font-bold">58</div>
          <div className="text-xs opacity-70 text-center">Buyurtmalar</div>
        </div>
        <div className="glass-card p-4 flex flex-col items-center justify-center gap-2 col-span-2">
          <TrendingUp className="w-8 h-8 text-purple-500" />
          <div className="text-2xl font-bold">450,000 UZS</div>
          <div className="text-xs opacity-70 text-center">Umumiy tushum (Komissiya)</div>
        </div>
      </div>
      
      <div className="mt-8 text-center opacity-50 text-sm">
        (Tez kunda to'liq boshqaruv paneli qo'shiladi)
      </div>
    </div>
  );
};

export default AdminDashboard;
