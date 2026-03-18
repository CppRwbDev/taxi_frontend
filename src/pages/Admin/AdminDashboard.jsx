import React, { useEffect, useState } from 'react';
import { Users, ClipboardList, TrendingUp, Shield, ShieldCheck, UserMinus, UserCheck, Edit2 } from 'lucide-react';
import { useStore } from '../../store/useStore';

const AdminDashboard = () => {
  const { initData } = useStore();
  const [stats, setStats] = useState({ users_count: 0, orders_count: 0, total_revenue: 0 });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('stats'); // stats | users

  const fetchData = async () => {
    try {
      const [statsRes, usersRes] = await Promise.all([
        fetch(`${import.meta.env.VITE_API_URL}/admin/stats`, { headers: { 'Authorization': `tma_${initData}` } }),
        fetch(`${import.meta.env.VITE_API_URL}/admin/users`, { headers: { 'Authorization': `tma_${initData}` } })
      ]);
      
      if (statsRes.ok) setStats(await statsRes.json());
      if (usersRes.ok) setUsers(await usersRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateRole = async (userId, newRole) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/users/${userId}/role?role=${newRole}`, {
        method: 'PATCH',
        headers: { 'Authorization': `tma_${initData}` }
      });
      if (res.ok) fetchData();
    } catch (err) { alert("Xatolik!"); }
  };

  const handleUpdateStatus = async (userId, newStatus) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/admin/users/${userId}/status?is_active=${newStatus}`, {
        method: 'PATCH',
        headers: { 'Authorization': `tma_${initData}` }
      });
      if (res.ok) fetchData();
    } catch (err) { alert("Xatolik!"); }
  };

  if (loading) return <div className="p-10 text-center animate-pulse">Yuklanmoqda...</div>;

  return (
    <div className="p-6 space-y-6 pb-32 max-w-4xl mx-auto">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black bg-gradient-to-r from-purple-500 to-indigo-500 bg-clip-text text-transparent">
            Admin Panel
          </h1>
          <p className="text-xs opacity-50">Tizim boshqaruvi</p>
        </div>
        <div className="flex bg-white/5 rounded-xl p-1">
          <button 
            onClick={() => setTab('stats')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${tab === 'stats' ? 'bg-blue-600 text-white shadow-lg' : 'opacity-40'}`}
          >
            Statistika
          </button>
          <button 
            onClick={() => setTab('users')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${tab === 'users' ? 'bg-blue-600 text-white shadow-lg' : 'opacity-40'}`}
          >
            Foydalanuvchilar
          </button>
        </div>
      </header>

      {tab === 'stats' ? (
        <div className="grid grid-cols-2 gap-4 animate-slide-up">
          <div className="glass-card p-6 flex flex-col items-center justify-center gap-3">
            <div className="p-3 bg-blue-500/10 rounded-2xl">
               <Users className="w-8 h-8 text-blue-500" />
            </div>
            <div className="text-3xl font-black">{stats.users_count}</div>
            <div className="text-[10px] opacity-50 uppercase font-black tracking-widest">A'zolar</div>
          </div>
          <div className="glass-card p-6 flex flex-col items-center justify-center gap-3">
            <div className="p-3 bg-green-500/10 rounded-2xl">
               <ClipboardList className="w-8 h-8 text-green-500" />
            </div>
            <div className="text-3xl font-black">{stats.orders_count}</div>
            <div className="text-[10px] opacity-50 uppercase font-black tracking-widest">Buyurtmalar</div>
          </div>
          <div className="glass-card p-8 flex flex-col items-center justify-center gap-3 col-span-2 bg-gradient-to-br from-indigo-600/10 to-purple-600/10 border-indigo-500/20">
            <div className="p-4 bg-purple-500/10 rounded-3xl">
               <TrendingUp className="w-10 h-10 text-purple-500" />
            </div>
            <div className="text-4xl font-black">{stats.total_revenue.toLocaleString()} UZS</div>
            <div className="text-xs opacity-50 uppercase font-black tracking-widest">Umumiy tushum (Jami komissiya)</div>
          </div>
        </div>
      ) : (
        <div className="space-y-4 animate-slide-up">
          <div className="flex justify-between items-center px-2">
             <h2 className="text-sm font-black opacity-40 uppercase tracking-widest">Barcha foydalanuvchilar ({users.length})</h2>
          </div>
          <div className="space-y-3">
            {users.map(u => (
              <div key={u.id} className="glass-card p-4 flex justify-between items-center border border-white/5 shadow-md">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    {u.photo_url ? (
                      <img src={u.photo_url} className="w-10 h-10 rounded-full object-cover" alt="" />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center opacity-40">
                         {u.full_name[0]}
                      </div>
                    )}
                    <div className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-black ${u.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
                  </div>
                  <div>
                    <div className="text-sm font-bold flex items-center gap-2">
                      {u.full_name}
                      {u.role === 'admin' && <ShieldCheck className="w-3 h-3 text-purple-500" />}
                    </div>
                    <div className="text-[10px] opacity-40 font-medium">@{u.username || 'user'} · ID: {u.telegram_id}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <select 
                    value={u.role}
                    onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                    className="bg-white/5 border-none text-[10px] font-bold rounded-lg py-1 px-2 outline-none"
                  >
                    <option value="passenger">Passenger</option>
                    <option value="driver">Driver</option>
                    <option value="investor">Investor</option>
                    <option value="admin">Admin</option>
                  </select>
                  
                  <button 
                    onClick={() => handleUpdateStatus(u.id, !u.is_active)}
                    className={`p-2 rounded-lg transition-colors ${u.is_active ? 'text-red-500 bg-red-500/10' : 'text-green-500 bg-green-500/10'}`}
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
