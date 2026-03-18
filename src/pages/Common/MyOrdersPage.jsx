import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, MapPin, CheckCircle, XCircle, Calendar } from 'lucide-react';
import { useStore } from '../../store/useStore';

const MyOrdersPage = () => {
  const { initData, role } = useStore();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/orders`, {
        headers: { 'Authorization': `tma_${initData}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'searching': return <Clock className="w-5 h-5 text-blue-500" />;
      case 'has_offers': return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'matched': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return null;
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'searching': return 'Qidirilmoqda...';
      case 'has_offers': return 'Takliflar bor';
      case 'matched': return 'Kelishilgan';
      case 'cancelled': return 'Bekor qilingan';
      default: return status;
    }
  };

  if (loading) return <div className="flex justify-center p-10"><div className="animate-spin h-8 w-8 border-b-2 border-blue-500 rounded-full"></div></div>;

  return (
    <div className="p-6 space-y-6 pb-32">
      <header>
        <h1 className="text-2xl font-bold">Buyurtmalarim</h1>
        <p className="text-sm opacity-70">Tarix va aktiv buyurtmalar</p>
      </header>

      {orders.length === 0 ? (
        <div className="text-center opacity-60 py-10">Hozircha buyurtmalar yo'q</div>
      ) : (
        <div className="space-y-4">
          {orders.map(order => (
            <div 
              key={order.id} 
              onClick={() => {
                if (role === 'passenger' && (order.status === 'searching' || order.status === 'has_offers')) {
                  navigate(`/order/${order.id}/offers`);
                }
              }}
              className={`glass-card p-4 space-y-3 ${role === 'passenger' && (order.status === 'searching' || order.status === 'has_offers') ? 'cursor-pointer hover:bg-white/5' : ''}`}
            >
              <div className="flex justify-between items-center border-b border-white/10 pb-2">
                <div className="text-xs opacity-60">#{order.id}</div>
                <div className="flex items-center gap-1 text-sm font-medium">
                  {getStatusIcon(order.status)}
                  {getStatusText(order.status)}
                </div>
              </div>
              
              <div className="flex flex-col gap-1 pt-2">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-blue-500" />
                  <span className="font-medium">{order.from_location} → {order.to_location}</span>
                </div>
                <div className="flex gap-4 pl-7 text-xs opacity-70">
                   <div className="flex items-center gap-1">
                     <Calendar className="w-3 h-3" />
                     {order.departure_date === 'bugun' ? 'Bugun' : order.departure_date === 'ertaga' ? 'Ertaga' : order.departure_date}
                   </div>
                   <div className="flex items-center gap-1">
                     <Clock className="w-3 h-3" />
                     {order.departure_time === 'hozir' ? 'Hozir' : order.departure_time}
                   </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center text-sm opacity-80 pt-2">
                <span>{order.passenger_count} yo'lovchi</span>
                <span className="text-[10px] opacity-40">{new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;
