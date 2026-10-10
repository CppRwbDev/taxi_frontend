import React, { useEffect, useState } from 'react';
import { useStore } from '../../store/useStore';
import { useNavigate } from 'react-router-dom';
import { MapPin, Users, Zap, RefreshCw, ChevronRight, Calendar, Clock } from 'lucide-react';
import { readErrorMessage } from '../../utils/api';

const DriverOrderList = () => {
  const { initData } = useStore();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const resp = await fetch(`${import.meta.env.VITE_API_URL}/orders`, {
        headers: { 'Authorization': `tma_${initData}` }
      });
      if (resp.ok) {
        const data = await resp.json();
        setOrders(Array.isArray(data) ? data : (data.items || []));
        setError(null);
      } else {
        setError(await readErrorMessage(resp, "Buyurtmalarni yuklab bo'lmadi"));
      }
    } catch (err) {
      console.error(err);
      setError("Server bilan aloqa yo'q");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const timer = setInterval(fetchOrders, 30000); // Har 30 sekundda yangilash
    return () => clearInterval(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="p-4 pb-24 space-y-4">
      <header className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Yo'lovchilar</h1>
          <p className="text-xs text-[var(--tg-hint-color)]">Yangi buyurtmalar ro'yxati</p>
        </div>
        <button onClick={fetchOrders} className={`p-2 glass-card rounded-full ${loading ? 'animate-spin' : ''}`}>
          <RefreshCw className="w-5 h-5" />
        </button>
      </header>

      {error && (
        <div className="glass-card border-red-500/30 text-sm text-red-500 text-center py-4">{error}</div>
      )}

      {orders.length === 0 ? (
        <div className="text-center py-20 opacity-50 space-y-4">
          <Zap className="w-12 h-12 mx-auto text-yellow-500 animate-pulse" />
          <p>Hozircha buyurtmalar yo'q...</p>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div key={order.id} className="glass-card flex flex-col gap-4 relative overflow-hidden group active:scale-[0.98] transition-all">
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm font-semibold opacity-80">
                    <MapPin className="w-4 h-4 text-blue-500" />
                    <span>{order.from_location} → {order.to_location}</span>
                  </div>
                  <div className="flex flex-col gap-1 pl-6">
                    <div className="flex items-center gap-2 text-xs opacity-70">
                      <Calendar className="w-3 h-3 text-blue-400" />
                      <span>{order.departure_date === 'bugun' ? 'Bugun' : order.departure_date === 'ertaga' ? 'Ertaga' : order.departure_date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs opacity-70">
                      <Clock className="w-3 h-3 text-blue-400" />
                      <span>{order.departure_time === 'hozir' ? 'Hozir' : order.departure_time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs opacity-70">
                      <Users className="w-3 h-3 text-blue-400" />
                      <span>{order.passenger_count} yo'lovchi</span>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-500/10 px-3 py-1 rounded-full text-[10px] font-bold text-blue-500 uppercase">
                  {order.status === 'searching' ? 'Yangi' : 'Takliflar bor'}
                </div>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-white/5">
                <div className="text-[10px] opacity-40">
                  {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
                <button 
                  onClick={() => navigate(`/driver/order/${order.id}`)}
                  className="bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-5 py-2 rounded-xl flex items-center gap-2 shadow-lg shadow-blue-600/20"
                >
                  Taklif yuborish
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DriverOrderList;
