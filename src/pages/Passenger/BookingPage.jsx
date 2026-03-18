import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Users, Send } from 'lucide-react';
import { useStore } from '../../store/useStore';

const VILOYATLAR = [
  "Toshkent", "Andijon", "Buxoro", "Farg'ona", "Jizzax", 
  "Xorazm", "Namangan", "Navoiy", "Qashqadaryo", 
  "Qoraqalpog'iston", "Samarqand", "Sirdaryo", "Surxondaryo"
];

const BookingPage = () => {
  const { role, initData } = useStore();
  const navigate = useNavigate();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [loading, setLoading] = useState(false);

  const handleBooking = async () => {
    if (!from || !to) {
      alert("Iltimos, yo'nalishni tanlang!");
      return;
    }
    setLoading(true);
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `tma_${initData}`
        },
        body: JSON.stringify({
          order_type: "taxi",
          from_location: from,
          to_location: to,
          from_city: "", // Can be extended to have city selections later
          to_city: "",
          passenger_count: passengers,
          contact_phone: "" // Will be taken from user context on backend
        })
      });

      if (response.ok) {
        const orderData = await response.json();
        navigate(`/order/${orderData.id}/offers`);
      } else {
        const errData = await response.json();
        alert("Xatolik: " + (errData.detail || "Buyurtma berishda xatolik yuz berdi"));
      }
    } catch (error) {
      console.error("Booking error:", error);
      alert("Tizimda xatolik yuz berdi. Iltimos qaytadan urinib ko'ring.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-8 pb-32">
      <header>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-500 to-blue-300 bg-clip-text text-transparent">
          Qayerga boramiz?
        </h1>
        <p className="text-[var(--tg-hint-color)] text-sm">Yo'nalish va yo'lovchilar sonini belgilang</p>
      </header>

      <section className="space-y-4">
        {/* FROM */}
        <div className="glass-card flex flex-col gap-2">
          <label className="text-xs font-bold uppercase opacity-50 flex items-center gap-2">
            <MapPin className="w-3 h-3" /> Qayerdan
          </label>
          <select 
            value={from} 
            onChange={(e) => setFrom(e.target.value)}
            className="bg-transparent text-lg font-medium outline-none border-0 p-0"
          >
            <option value="" disabled>Viloyatni tanlang</option>
            {VILOYATLAR.map(v => <option key={v} value={v} className="text-black">{v}</option>)}
          </select>
        </div>

        {/* TO */}
        <div className="glass-card flex flex-col gap-2">
          <label className="text-xs font-bold uppercase opacity-50 flex items-center gap-2">
            <MapPin className="w-3 h-3 text-red-500" /> Qayerga
          </label>
          <select 
            value={to} 
            onChange={(e) => setTo(e.target.value)}
            className="bg-transparent text-lg font-medium outline-none border-0 p-0"
          >
            <option value="" disabled>Viloyatni tanlang</option>
            {VILOYATLAR.map(v => <option key={v} value={v} className="text-black">{v}</option>)}
          </select>
        </div>
      </section>

      <section className="space-y-4">
        <label className="text-sm font-bold opacity-70 flex items-center gap-2 ml-2">
          <Users className="w-4 h-4" /> Yo'lovchilar soni
        </label>
        <div className="flex justify-between gap-2">
          {[1, 2, 3, 4, 5].map(num => (
            <button
              key={num}
              onClick={() => setPassengers(num)}
              className={`flex-1 py-4 rounded-2xl font-bold transition-all ${
                passengers === num 
                ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/40 scale-105' 
                : 'glass-card text-gray-400'
              }`}
            >
              {num}{num === 5 ? '+' : ''}
            </button>
          ))}
        </div>
      </section>

      <section>
        <button 
          onClick={handleBooking}
          disabled={loading}
          className="btn-primary flex items-center justify-center gap-3 py-5 text-lg"
        >
          {loading ? (
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <Send className="w-5 h-5" />
              <span>Yo'l band qilish</span>
            </>
          )}
        </button>
      </section>
    </div>
  );
};

export default BookingPage;
