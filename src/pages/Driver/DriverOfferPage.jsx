import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Users, Send, DollarSign, Clock } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { readErrorMessage } from '../../utils/api';

const DriverOfferPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { initData } = useStore();
  
  const [order, setOrder] = useState(null);
  const [price, setPrice] = useState('');
  const [time, setTime] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchOrderDetails();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/orders/${orderId}`, {
        headers: { 'Authorization': `tma_${initData}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOrder(data);
      } else {
        alert(await readErrorMessage(res, "Buyurtmani yuklashda xatolik yuz berdi"));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSendOffer = async () => {
    if (!price || !time) {
      alert("Iltimos narx va vaqtni kiriting");
      return;
    }
    
    setSubmitting(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/offers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `tma_${initData}`
        },
        body: JSON.stringify({
          order_id: parseInt(orderId),
          proposed_price: parseFloat(price),
          proposed_time: time,
          message: ""
        })
      });
      
      if (res.ok) {
        alert("Taklifingiz muvaffaqiyatli yuborildi!");
        // Mini App'ni yopmaymiz — haydovchi takliflar tarixini ko'ra olsin
        navigate('/my-offers');
      } else if (res.status === 402) {
        const err = await res.json().catch(() => null);
        const required = err?.required ? Number(err.required).toLocaleString() : null;
        const current = err?.current_balance ? Number(err.current_balance).toLocaleString() : null;
        const msg = [
          required ? `Kerak: ${required} UZS` : null,
          current ? `Balansingiz: ${current} UZS` : null,
        ].filter(Boolean).join(' • ');
        alert("Hisobingizda mablag' yetarli emas." + (msg ? "\n" + msg : "") + "\nBalansni to'ldirish uchun administratorga murojaat qiling.");
        navigate('/wallet');
      } else {
        alert("Xatolik: " + await readErrorMessage(res));
      }
    } catch {
      alert("Tizimda xatolik");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex justify-center p-10"><div className="animate-spin h-8 w-8 border-b-2 border-blue-500 rounded-full"></div></div>;
  if (!order) return <div className="p-6 text-center text-red-500">Buyurtma topilmadi</div>;

  return (
    <div className="p-6 space-y-6 pb-32">
      <header>
        <h1 className="text-2xl font-bold">Taklif yuborish</h1>
        <p className="text-sm opacity-70">Yo'lovchiga o'z narxingizni taklif qiling</p>
      </header>

      <div className="glass-card p-4 space-y-3">
        <div className="flex items-center gap-2">
           <MapPin className="w-4 h-4 text-blue-500" />
           <span className="font-medium">{order.from_location} → {order.to_location}</span>
        </div>
        <div className="flex items-center gap-2">
           <Users className="w-4 h-4 text-gray-400" />
           <span>{order.passenger_count} ta yo'lovchi</span>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold opacity-70 flex items-center gap-2">
            <DollarSign className="w-4 h-4" /> Narx (UZS)
          </label>
          <input 
            type="number"
            value={price}
            onChange={e => setPrice(e.target.value)}
            placeholder="Masalan: 50000"
            className="w-full bg-black/5 dark:bg-white/5 border-none rounded-xl p-4 text-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold opacity-70 flex items-center gap-2">
            <Clock className="w-4 h-4" /> Jo'nash vaqti
          </label>
          <input 
            type="text"
            value={time}
            onChange={e => setTime(e.target.value)}
            placeholder="Masalan: 14:30 yoki Hozir"
            className="w-full bg-black/5 dark:bg-white/5 border-none rounded-xl p-4 text-lg outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>
      </div>

      <button 
        onClick={handleSendOffer}
        disabled={submitting}
        className="w-full btn-primary py-4 flex justify-center items-center gap-2 text-lg font-medium mt-6"
      >
        {submitting ? (
          <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            <Send className="w-5 h-5" />
            Yuborish
          </>
        )}
      </button>
    </div>
  );
};

export default DriverOfferPage;
