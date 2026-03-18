import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Phone, CheckCircle, Clock, MapPin, User, Car } from 'lucide-react';
import { useStore } from '../../store/useStore';

const OffersPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { initData } = useStore();
  
  const [order, setOrder] = useState(null);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acceptingOffer, setAcceptingOffer] = useState(null);

  useEffect(() => {
    fetchOrderAndOffers();
    // Har 5 soniyada yangi takliflarni tekshirish (Polling)
    const interval = setInterval(fetchOrderAndOffers, 5000);
    return () => clearInterval(interval);
  }, [orderId]);

  const fetchOrderAndOffers = async () => {
    try {
      // 1. Buyurtma holatini olish
      const orderRes = await fetch(`${import.meta.env.VITE_API_URL}/orders/${orderId}`, {
        headers: { 'Authorization': `tma_${initData}` }
      });
      if (orderRes.ok) {
        const orderData = await orderRes.json();
        setOrder(orderData);
        // Agar buyurtma bekor qilingan bo'lsa yoki tugagan bo'lsa
        if (orderData.status === 'matched') {
            // navigate to success/matched page if necessary
        }
      }

      // 2. Takliflarni olish
      const offersRes = await fetch(`${import.meta.env.VITE_API_URL}/orders/${orderId}/offers`, {
        headers: { 'Authorization': `tma_${initData}` }
      });
      if (offersRes.ok) {
        const offersData = await offersRes.json();
        setOffers(offersData.offers || []);
      }
    } catch (error) {
      console.error("Error fetching offers:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptOffer = async (offerId) => {
    setAcceptingOffer(offerId);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/offers/${offerId}/accept`, {
        method: 'PATCH',
        headers: { 'Authorization': `tma_${initData}` }
      });
      
      if (res.ok) {
        const data = await res.json();
        alert("Taklif qabul qilindi! Haydovchi telefon raqami: " + data.match.driver.phone_number);
        navigate('/my-orders'); // Yo'lovchi o'z buyurtmalari ro'yxatiga qaytadi
      } else {
        const err = await res.json();
        alert("Xatolik: " + err.detail);
      }
    } catch (err) {
      alert("Tizimda xatolik yuz berdi");
    } finally {
      setAcceptingOffer(null);
    }
  };

  if (loading && !order) {
    return <div className="flex justify-center items-center h-screen"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div></div>;
  }

  return (
    <div className="p-6 space-y-6 pb-32">
      <header>
        <h1 className="text-2xl font-bold">Takliflar</h1>
        {order && (
          <div className="mt-2 text-sm opacity-80 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-500" />
            <span>{order.from_location} → {order.to_location} ({order.passenger_count} kishi)</span>
          </div>
        )}
      </header>

      {offers.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 opacity-60">
          <div className="animate-pulse mb-4">
            <Clock className="w-12 h-12" />
          </div>
          <p>Haydovchilar qidirilmoqda...</p>
          <p className="text-xs mt-2 opacity-50">Sahifa avtomatik yangilanadi</p>
        </div>
      ) : (
        <div className="space-y-4">
          {offers.map(offer => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              key={offer.id} 
              className="glass-card p-4 space-y-4 relative overflow-hidden"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center">
                    <User className="w-6 h-6 text-blue-500" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">{offer.driver.full_name || 'Haydovchi'}</h3>
                    <div className="flex items-center gap-1 text-sm opacity-70">
                      <Car className="w-4 h-4" />
                      <span>{offer.driver.car_model || 'Mashina ma\'lumoti yo\'q'}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-xl text-green-500">{offer.proposed_price.toLocaleString()} UZS</div>
                  <div className="text-sm opacity-70 flex items-center justify-end gap-1">
                    <Clock className="w-3 h-3" />
                    {offer.proposed_time}
                  </div>
                </div>
              </div>
              
              <button 
                onClick={() => handleAcceptOffer(offer.id)}
                disabled={acceptingOffer === offer.id}
                className="w-full btn-primary py-3 flex justify-center items-center gap-2 text-base font-medium"
              >
                {acceptingOffer === offer.id ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Qabul qilish va bog'lanish
                  </>
                )}
              </button>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OffersPage;
