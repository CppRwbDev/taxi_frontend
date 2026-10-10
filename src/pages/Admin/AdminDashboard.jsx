import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Users, ClipboardList, TrendingUp, Shield, ShieldCheck, UserMinus, UserCheck, Edit2 } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { readErrorMessage } from '../../utils/api';

const AdminDashboard = () => {
  const { initData } = useStore();
  const location = useLocation();
  const navigate = useNavigate();
  const queryTab = new URLSearchParams(location.search).get('tab') || 'stats';

  const [stats, setStats] = useState({ users_count: 0, orders_count: 0, total_revenue: 0 });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [tab, setTab] = useState(queryTab);

  useEffect(() => {
    setTab(queryTab);
  }, [queryTab]);

  const fetchData = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/admin/stats`, { headers: { 'Authorization': `tma_${initData}` } }),
        fetch(`${import.meta.env.VITE_API_URL}/admin/users`, { headers: { 'Authorization': `tma_${initData}` } })
      ]);
      
      if (statsRes.ok) setStats(await statsRes.json());
      if (usersRes.ok) setUsers(await usersRes.json());

      if (!statsRes.ok || !usersRes.ok) {
        const failing = !statsRes.ok ? statsRes : usersRes;
        setError(await readErrorMessage(failing, "Ma'lumotlarni yuklab bo'lmadi"));
      } else {
        setError(null);
      }
    } catch (err) {
      console.error(err);
      setError("Server bilan aloqa yo'q");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdateRole = async (userId, newRole) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/users/${userId}/role?role=${newRole}`, {
        method: 'PATCH',
        headers: { 'Authorization': `tma_${initData}` }
      });
      if (res.ok) fetchData();
      else alert("Rol o'zgartirib bo'lmadi: " + await readErrorMessage(res));
    } catch (err) {
      console.error(err);
      alert("Xatolik!");
    }
  };

  const handleUpdateStatus = async (userId, newStatus) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/users/${userId}/status?is_active=${newStatus}`, {
        method: 'PATCH',
        headers: { 'Authorization': `tma_${initData}` }
      });
      if (res.ok) fetchData();
      else alert("Holat o'zgartirib bo'lmadi: " + await readErrorMessage(res));
    } catch (err) {
      console.error(err);
      alert("Xatolik!");
    }
  };

  if (loading) return <div className="p-10 text-center animate-pulse">Yuklanmoqda...</div>;

  return (
    <div className="p-6 space-y-6 pb-32 max-w-4xl mx-auto">
      <header className="flex justify-between items-center">        <div>
          <h1 className="text-2xl font-black bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">
            Admin Panel
          </h1>
          <p className="text-xs opacity-50">Tizim boshqaruvi</p>
        </div>
        <div className="flex bg-white/5 rounded-xl p-1 relative z-10">
          <button 
            onClick={() => navigate('/?tab=stats')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex-1 ${tab === 'stats' ? 'bg-blue-600 text-white shadow-lg' : 'opacity-40'}`}
          >
            Statistika
          </button>
          <button 
            onClick={() => navigate('/?tab=users')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex-1 ${tab === 'users' ? 'bg-blue-600 text-white shadow-lg' : 'opacity-40'}`}
          >
            Foydalanuvchilar
          </button>
        </div>
      </header>

      {error && (
        <div className="glass-card border-red-500/30 text-sm text-red-500 text-center py-4">{error}</div>
      )}

      {tab === 'stats' ? (
        <div className="grid grid-cols-2 gap-4 animate-slide-up">
          <div className="glass-card p-6 flex flex-col items-center justify-center gap-3">
            <div className="p-3 bg-blue-500/10 rounded-2xl">
               <Users className="w-8 h-8 text-blue-500" />
            </div>
            <div className="text-3xl font-black">{stats.users_count}</div>
            <div className="text-[10px] opacity-50 uppercase font-black tracking-widest text-center">A'zolar</div>
          </div>
          <div className="glass-card p-6 flex flex-col items-center justify-center gap-3">
            <div className="p-3 bg-green-500/10 rounded-2xl">
               <ClipboardList className="w-8 h-8 text-green-500" />
            </div>
            <div className="text-3xl font-black">{stats.orders_count}</div>
            <div className="text-[10px] opacity-50 uppercase font-black tracking-widest text-center">Buyurtmalar</div>
          </div>
          <div className="glass-card p-6 flex flex-col items-center justify-center gap-3">
            <div className="text-xl font-black">{stats.orders_active ?? 0}</div>
            <div className="text-[10px] opacity-50 uppercase font-black tracking-widest text-center">Faol</div>
          </div>
          <div className="glass-card p-6 flex flex-col items-center justify-center gap-3">
            <div className="text-xl font-black">{stats.orders_matched ?? 0}</div>
            <div className="text-[10px] opacity-50 uppercase font-black tracking-widest text-center">Kelishilgan</div>
          </div>
          <div className="glass-card p-6 flex flex-col items-center justify-center gap-3">
            <div className="text-xl font-black">{stats.orders_completed ?? 0}</div>
            <div className="text-[10px] opacity-50 uppercase font-black tracking-widest text-center">Yakunlangan</div>
          </div>
          <div className="glass-card p-8 flex flex-col items-center justify-center gap-3 col-span-2 bg-gradient-to-br from-indigo-600/10 to-purple-600/10 border-indigo-500/20">
            <div className="p-4 bg-purple-500/10 rounded-3xl">
               <TrendingUp className="w-10 h-10 text-purple-500" />
            </div>
            <div className="text-2xl sm:text-4xl font-black text-center">{(stats.total_revenue || 0).toLocaleString()} <span className="text-xs opacity-50">UZS</span></div>
            <div className="text-[10px] opacity-50 uppercase font-black tracking-widest text-center">Umumiy tushum (Jami komissiya)</div>
            <div className="text-xs opacity-60">
              Refund: {(stats.total_refunded || 0).toLocaleString()} UZS · Sof: {(stats.net_revenue || 0).toLocaleString()} UZS
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4 animate-slide-up pb-20">
          <div className="flex justify-between items-center px-2">
             <h2 className="text-[10px] font-black opacity-40 uppercase tracking-widest">Barcha foydalanuvchilar ({users.length})</h2>
          </div>
          <div className="space-y-3">
            {users.map(u => (
              <div key={u.id} className="glass-card p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border border-white/5 shadow-md">
                <div className="flex items-center gap-3 w-full sm:w-auto overflow-hidden">
                  <div className="relative flex-shrink-0">
                    {u.photo_url ? (
                      <img src={u.photo_url} className="w-10 h-10 rounded-full object-cover" alt="" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center opacity-40 font-bold">
                         {u.full_name[0]}
                      </div>
                    )}
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-black ${u.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-xs font-bold flex items-center gap-2 truncate">
                      {u.full_name}
                      {u.role === 'admin' && <ShieldCheck className="w-3 h-3 text-purple-500 flex-shrink-0" />}
                    </div>
                    <div className="text-[10px] opacity-40 font-medium truncate">@{u.username || 'user'} · ID: {u.telegram_id}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2 w-full sm:w-auto justify-end sm:justify-start">
                  <select 
                    value={u.role}
                    onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                    className="bg-white/10 border-none text-[10px] font-bold rounded-xl py-2 px-3 outline-none flex-1 sm:flex-none"
                  >
                    <option value="passenger" className="bg-[#1c1c1e]">Passenger</option>
                    <option value="driver" className="bg-[#1c1c1e]">Driver</option>
                    <option value="investor" className="bg-[#1c1c1e]">Investor</option>
                    <option value="admin" className="bg-[#1c1c1e]">Admin</option>
                  </select>
                  
                  <button 
                    onClick={() => handleUpdateStatus(u.id, !u.is_active)}
                    className={`p-2.5 rounded-xl transition-all active:scale-90 ${u.is_active ? 'text-red-500 bg-red-500/10' : 'text-green-500 bg-green-500/10'}`}
                  >
                    {u.is_active ? <UserMinus className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
