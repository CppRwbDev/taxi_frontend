import React, { useState, useEffect } from 'react';
import { Clock, MapPin, CheckCircle, XCircle, DollarSign } from 'lucide-react';
import { useStore } from '../../store/useStore';

const MyOffersPage = () => {
  const { initData } = useStore();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOffers();
  }, []);

  const fetchOffers = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/offers`, {
        headers: { 'Authorization': `tma_${initData}` }
      });
      if (res.ok) {
        const data = await res.json();
        setOffers(data.items || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'pending': return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'accepted': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return null;
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'pending': return 'Kutilmoqda';
      case 'accepted': return 'Qabul qilingan';
      case 'rejected': return 'Rad etilgan';
      default: return status;
    }
  };

  if (loading) return <div className="flex justify-center p-10"><div className="animate-spin h-8 w-8 border-b-2 border-blue-500 rounded-full"></div></div>;

  return (
    <div className="p-6 space-y-6 pb-32">
      <header>
        <h1 className="text-2xl font-bold">Mening takliflarim</h1>
        <p className="text-sm opacity-70">Yo'lovchilarga yuborilgan takliflar tarixi</p>
      </header>

      {offers.length === 0 ? (
        <div className="text-center opacity-60 py-10">Hozircha takliflar yo'q</div>
      ) : (
        <div className="space-y-4">
          {offers.map(offer => (
            <div key={offer.id} className="glass-card p-4 space-y-3">
              <div className="flex justify-between items-center border-b border-white/10 pb-2">
                <div className="text-xs opacity-60">{new Date(offer.created_at).toLocaleDateString('uz-UZ', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</div>
                <div className="flex items-center gap-1 text-sm font-medium">
                  {getStatusIcon(offer.status)}
                  {getStatusText(offer.status)}
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-blue-500" />
                <span className="font-medium text-sm">{offer.order.from_location} → {offer.order.to_location}</span>
              </div>
              
              <div className="flex justify-between items-center pt-2">
                <div className="flex items-center gap-1 font-bold text-green-500">
                  <DollarSign className="w-4 h-4" />
                  {offer.proposed_price.toLocaleString()} UZS
                </div>
                <div className="text-sm opacity-80">
                  Vaqt: {offer.proposed_time}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOffersPage;
