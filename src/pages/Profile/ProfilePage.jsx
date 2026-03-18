import React, { useState, useEffect } from 'react';
import { User, Phone, Car, Save, Wallet, ChevronRight, Briefcase, MapPin, ShieldCheck } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { useNavigate } from 'react-router-dom';

const VILOYATLAR = [
  "Toshkent", "Andijon", "Buxoro", "Farg'ona", "Jizzax", 
  "Xorazm", "Namangan", "Navoiy", "Qashqadaryo", 
  "Qoraqalpog'iston", "Samarqand", "Sirdaryo", "Surxondaryo"
];

const ProfilePage = () => {
  const { user, initData, setUser, role } = useStore();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    phone_number: user?.phone_number || '',
    car_model: user?.car_model || '',
    car_color: user?.car_color || '',
    car_number: user?.car_number || '',
    working_cities: user?.working_cities || ''
  });
  
  const [loading, setLoading] = useState(false);

  // Sync with store if user changes
  useEffect(() => {
    if (user) {
      setFormData({
        phone_number: user.phone_number || '',
        car_model: user.car_model || '',
        car_color: user.car_color || '',
        car_number: user.car_number || '',
        working_cities: user.working_cities || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const toggleCity = (city) => {
    let cities = formData.working_cities ? formData.working_cities.split(',') : [];
    if (cities.includes(city)) {
      cities = cities.filter(c => c !== city);
    } else {
      cities.push(city);
    }
    setFormData({ ...formData, working_cities: cities.join(',') });
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/users/me`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `tma_${initData}` 
        },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        const updatedUser = await res.json();
        setUser(updatedUser);
        alert("Profil muvaffaqiyatli saqlandi!");
      } else {
        alert("Saqlashda xatolik yuz berdi.");
      }
    } catch (err) {
      console.error(err);
      alert("Tizimda xatolik");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 space-y-6 pb-32">
      <header className="flex items-center gap-4">
        {user?.photo_url ? (
          <img src={user.photo_url} alt="Profile" className="w-16 h-16 rounded-full object-cover border border-white/20 shadow-xl shadow-blue-500/10" />
        ) : (
          <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center">
            <User className="w-8 h-8 text-blue-500" />
          </div>
        )}
        <div>
          <h1 className="text-2xl font-black tracking-tight">{user?.full_name || 'Foydalanuvchi'}</h1>
          <div className="flex flex-col">
             {user?.username && <span className="text-xs opacity-50 font-bold">@{user.username}</span>}
             <div className="flex items-center gap-1 text-xs opacity-70 capitalize mt-1 text-blue-500 font-black">
                <Briefcase className="w-3 h-3" />
                {role === 'driver' ? 'Haydovchi' : 'Yo\'lovchi'}
             </div>
          </div>
        </div>
      </header>

      {/* WALLET BUTTON (Only for Drivers) */}
      {(role === 'driver' || role === 'investor') && (
        <button 
          onClick={() => navigate('/wallet')}
          className="w-full bg-gradient-to-r from-blue-600 to-blue-500 p-5 rounded-3xl flex justify-between items-center text-white shadow-xl shadow-blue-500/20 active:scale-95 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="p-2 bg-white/20 rounded-xl">
               <Wallet className="w-6 h-6" />
            </div>
            <div className="text-left">
               <div className="text-[10px] opacity-70 uppercase font-black">Mening balansim</div>
               <div className="text-xl font-black">{(user?.balance || 0).toLocaleString()} <span>UZS</span></div>
            </div>
          </div>
          <ChevronRight className="w-6 h-6 opacity-30" />
        </button>
      )}

      <div className="space-y-6">
        <label className="text-xs font-black opacity-30 uppercase tracking-widest ml-2">Shaxsiy ma'lumotlar</label>
        
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 ml-2 mb-1">
              <Phone className="w-4 h-4 text-blue-500" />
              <span className="text-xs font-bold opacity-60">Telefon raqam</span>
            </div>
            <input 
              type="tel"
              name="phone_number"
              value={formData.phone_number}
              onChange={handleChange}
              placeholder="+998901234567"
              className="w-full glass-card p-4 rounded-2xl text-base outline-none focus:ring-2 focus:ring-blue-500 transition-all border border-white/5 shadow-md"
            />
          </div>

          {(role === 'driver' || role === 'investor') && (
            <div className="space-y-6 pt-4 animate-slide-up">
              <label className="text-xs font-black opacity-30 uppercase tracking-widest ml-2">Mashina ma'lumotlari</label>
              
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2 ml-2 mb-1">
                  <Car className="w-4 h-4 text-blue-500" />
                  <span className="text-xs font-bold opacity-60">Mashina rusumi</span>
                </div>
                <input 
                  type="text"
                  name="car_model"
                  value={formData.car_model}
                  onChange={handleChange}
                  placeholder="Masalan: Chevrolet Cobalt"
                  className="w-full glass-card p-4 rounded-2xl text-base outline-none focus:ring-2 focus:ring-blue-500 transition-all border border-white/5 shadow-md"
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold opacity-60 ml-2 mb-1">Rangi</span>
                  <input 
                    type="text"
                    name="car_color"
                    value={formData.car_color}
                    onChange={handleChange}
                    placeholder="Oq"
                    className="w-full glass-card p-4 rounded-2xl text-base outline-none focus:ring-2 focus:ring-blue-500 transition-all border border-white/5 shadow-md"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <span className="text-xs font-bold opacity-60 ml-2 mb-1">Davlat raqami</span>
                  <input 
                    type="text"
                    name="car_number"
                    value={formData.car_number}
                    onChange={handleChange}
                    placeholder="01 A 123 AA"
                    className="w-full glass-card p-4 rounded-2xl text-base outline-none focus:ring-2 focus:ring-blue-500 transition-all border border-white/5 shadow-md font-black uppercase tracking-wider"
                  />
                </div>
              </div>

              {/* WORKING CITIES */}
              <div className="space-y-3 pt-6">
                 <label className="text-xs font-black opacity-30 uppercase ml-2 tracking-widest flex items-center gap-2">
                   <MapPin className="w-3 h-3 text-blue-500" /> Ishlash hududlaringiz
                 </label>
                 <div className="grid grid-cols-2 gap-2">
                   {VILOYATLAR.map(city => {
                     const isActive = formData.working_cities?.split(',').includes(city);
                     return (
                       <button
                         key={city}
                         onClick={() => toggleCity(city)}
                         className={`p-3 rounded-2xl text-[10px] font-bold border transition-all ${
                           isActive 
                           ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20' 
                           : 'glass-card border-white/5 opacity-40'
                         }`}
                       >
                         {city}
                       </button>
                     );
                   })}
                 </div>
                 <p className="text-[10px] opacity-40 italic ml-2 mt-2">Tanlangan hududlar bo'yicha sizga botdan buyurtmalar yuboriladi</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <button 
        onClick={handleSave}
        disabled={loading}
        className="w-full bg-blue-600 p-5 rounded-3xl flex items-center justify-center gap-2 text-white font-black shadow-xl shadow-blue-500/20 active:scale-95 transition-all mt-4 disabled:opacity-50"
      >
        <Save className="w-6 h-6" />
        <span>{loading ? 'Saqlanmoqda...' : 'Profilni Saqlash'}</span>
      </button>

      <button
        onClick={() => {
          if(window.confirm("Hisobdan chiqmoqchimisiz?")) resetUser();
        }}
        className="text-[10px] font-black opacity-20 uppercase tracking-widest text-center w-full pb-8 hover:opacity-50 transition-opacity mt-6"
      >
        Hisobdan chiqish
      </button>
    </div>
  );
};

export default ProfilePage;
