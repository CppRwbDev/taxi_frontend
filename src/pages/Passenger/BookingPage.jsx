import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Users, Send, Calendar, Clock } from 'lucide-react';
import { useStore } from '../../store/useStore';

const VILOYATLAR = [
  "Toshkent", "Andijon", "Buxoro", "Farg'ona", "Jizzax", 
  "Xorazm", "Namangan", "Navoiy", "Qashqadaryo", 
  "Qoraqalpog'iston", "Samarqand", "Sirdaryo", "Surxondaryo"
];

const BookingPage = () => {
  const { initData } = useStore();
  const navigate = useNavigate();
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [passengers, setPassengers] = useState(1);
  const [loading, setLoading] = useState(false);
  
  // Sana va vaqt
  const [dateType, setDateType] = useState('bugun'); // bugun, ertaga, boshqa
  const [customDate, setCustomDate] = useState('');
  const [timeType, setTimeType] = useState('hozir'); // hozir, boshqa
  const [customTime, setCustomTime] = useState('');

  const handleBooking = async () => {
    if (!from || !to) {
      alert("Iltimos, yo'nalishni tanlang!");
      return;
    }
    
    // Sanani aniqlash
    let finalDate = dateType;
    if (dateType === 'boshqa' && customDate) {
      finalDate = customDate;
    }
    
    // Vaqtni aniqlash
    let finalTime = timeType;
    if (timeType === 'boshqa' && customTime) {
      finalTime = customTime;
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
          from_city: "",
          to_city: "",
          passenger_count: passengers,
          contact_phone: "",
          departure_date: finalDate,
          departure_time: finalTime
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
        <p className="text-[var(--tg-hint-color)] text-sm">Yo'nalish va vaqtni belgilang</p>
      </header>

      <section className="space-y-4">
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

      {/* SANA VA VAQT */}
      <section className="space-y-4">
        <label className="text-sm font-bold opacity-70 flex items-center gap-2 ml-2">
          <Calendar className="w-4 h-4" /> Jo'nash sanasi
        </label>
        <div className="flex gap-2">
          {['bugun', 'ertaga', 'boshqa'].map(type => (
            <button
              key={type}
              onClick={() => setDateType(type)}
              className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
                dateType === type ? 'bg-blue-500 text-white shadow-md' : 'glass-card opacity-60'
              }`}
            >
              {type === 'bugun' ? 'Bugun' : type === 'ertaga' ? 'Ertaga' : 'Sana...'}
            </button>
          ))}
        </div>
        {dateType === 'boshqa' && (
          <input 
            type="date" 
            className="w-full glass-card p-3 rounded-xl outline-none"
            value={customDate}
            onChange={e => setCustomDate(e.target.value)}
          />
        )}

        <label className="text-sm font-bold opacity-70 flex items-center gap-2 ml-2 pt-2">
          <Clock className="w-4 h-4" /> Vaqti
        </label>
        <div className="flex gap-2">
          {['hozir', 'boshqa'].map(type => (
            <button
              key={type}
              onClick={() => setTimeType(type)}
              className={`flex-1 py-3 rounded-xl text-sm font-medium transition-all ${
                timeType === type ? 'bg-blue-500 text-white shadow-md' : 'glass-card opacity-60'
              }`}
            >
              {type === 'hozir' ? 'Hozir' : 'Vaqt tanlash'}
            </button>
          ))}
        </div>
        {timeType === 'boshqa' && (
          <input 
            type="time" 
            className="w-full glass-card p-3 rounded-xl outline-none"
            value={customTime}
            onChange={e => setCustomTime(e.target.value)}
          />
        )}
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
