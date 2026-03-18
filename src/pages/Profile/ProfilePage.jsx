import React, { useState, useEffect } from 'react';
import { User, Phone, Car, Save } from 'lucide-react';
import { useStore } from '../../store/useStore';

const ProfilePage = () => {
  const { user, initData, setUser } = useStore();
  
  const [formData, setFormData] = useState({
    phone_number: user?.phone_number || '',
    car_model: user?.car_model || '',
    car_color: user?.car_color || '',
    car_number: user?.car_number || ''
  });
  
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
          <img src={user.photo_url} alt="Profile" className="w-16 h-16 rounded-full object-cover border border-white/20" />
        ) : (
          <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center">
            <User className="w-8 h-8 text-blue-500" />
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold">{user?.full_name || 'Foydalanuvchi'}</h1>
          <div className="flex flex-col">
             {user?.username && <span className="text-sm opacity-70">@{user.username}</span>}
             <span className="text-sm opacity-70 capitalize mt-1">{user?.role === 'driver' ? 'Haydovchi' : 'Yo\'lovchi'}</span>
          </div>
        </div>
      </header>

      <div className="space-y-4">
        <h2 className="font-bold text-lg">Asosiy ma'lumotlar</h2>
        
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold opacity-70 flex items-center gap-2">
            <Phone className="w-4 h-4" /> Telefon raqam
          </label>
          <input 
            type="tel"
            name="phone_number"
            value={formData.phone_number}
            onChange={handleChange}
            placeholder="+998901234567"
            className="w-full bg-black/5 dark:bg-white/5 border-none rounded-xl p-4 text-base outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        {user?.role === 'driver' && (
          <>
            <h2 className="font-bold text-lg pt-4 border-t border-white/10 mt-4">Mashina ma'lumotlari</h2>
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold opacity-70 flex items-center gap-2">
                <Car className="w-4 h-4" /> Mashina rusumi
              </label>
              <input 
                type="text"
                name="car_model"
                value={formData.car_model}
                onChange={handleChange}
                placeholder="Masalan: Chevrolet Cobalt"
                className="w-full bg-black/5 dark:bg-white/5 border-none rounded-xl p-4 text-base outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
            </div>
            
            <div className="flex gap-4">
              <div className="flex flex-col gap-2 flex-1">
                <label className="text-sm font-bold opacity-70">Rang</label>
                <input 
                  type="text"
                  name="car_color"
                  value={formData.car_color}
                  onChange={handleChange}
                  placeholder="Oq"
                  className="w-full bg-black/5 dark:bg-white/5 border-none rounded-xl p-4 text-base outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <label className="text-sm font-bold opacity-70">Davlat raqami</label>
                <input 
                  type="text"
                  name="car_number"
                  value={formData.car_number}
                  onChange={handleChange}
                  placeholder="01 A 123 AA"
                  className="w-full bg-black/5 dark:bg-white/5 border-none rounded-xl p-4 text-base outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
            </div>
          </>
        )}
      </div>

      <button 
        onClick={handleSave}
        disabled={loading}
        className="w-full btn-primary py-4 flex justify-center items-center gap-2 text-lg font-medium mt-8"
      >
        {loading ? (
          <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
            <Save className="w-5 h-5" />
            Saqlash
          </>
        )}
      </button>
    </div>
  );
};

export default ProfilePage;
