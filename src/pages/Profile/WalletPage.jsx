import React, { useEffect, useState } from 'react';
import { useStore } from '../../store/useStore';
import { Wallet, ArrowUpCircle, History, Coins, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const WalletPage = () => {
  const { initData } = useStore();
  const navigate = useNavigate();
  const [data, setData] = useState({ balance: 0, transactions: [] });
  const [loading, setLoading] = useState(true);
  const [topUpAmount, setTopUpAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/balance`, {
        headers: { 'Authorization': `tma_${initData}` }
      });
      if (res.ok) {
        const result = await res.json();
        setData(result);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleTopUp = async () => {
    if (!topUpAmount || parseFloat(topUpAmount) <= 0) {
      alert("Iltimos, summani kiriting");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/balance/topup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `tma_${initData}`
        },
        body: JSON.stringify({
          amount: parseFloat(topUpAmount),
          payment_provider: "demo_test"
        })
      });
      if (res.ok) {
        alert("Balans to'ldirildi! (Demo)");
        setTopUpAmount('');
        fetchData();
      }
    } catch (err) {
      alert("Xatolik yuz berdi");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="flex justify-center p-10"><div className="animate-spin h-8 w-8 border-b-2 border-blue-500 rounded-full"></div></div>;

  return (
    <div className="p-6 space-y-8 pb-32">
      <header className="flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="p-2 glass-card rounded-full">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold">Mening hamyonim</h1>
          <p className="text-xs opacity-60">Balans va tranzaksiyalar</p>
        </div>
      </header>

      {/* BALANCE CARD */}
      <div className="bg-gradient-to-br from-blue-600 to-blue-400 p-6 rounded-3xl text-white shadow-xl shadow-blue-500/20 space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <span className="text-sm opacity-80 font-medium uppercase tracking-wider">Jami balans</span>
            <div className="text-4xl font-black">{data.balance.toLocaleString()} <span>UZS</span></div>
          </div>
          <Wallet className="w-10 h-10 opacity-30" />
        </div>
      </div>

      {/* TOP UP SECTION */}
      <section className="space-y-4">
        <label className="text-sm font-bold opacity-70 flex items-center gap-2 ml-2">
          <ArrowUpCircle className="w-4 h-4 text-green-500" /> Balansni to'ldirish (Demo)
        </label>
        <div className="flex gap-2">
          <input 
            type="number"
            value={topUpAmount}
            onChange={e => setTopUpAmount(e.target.value)}
            placeholder="Summa (masalan: 50000)"
            className="flex-1 glass-card p-4 rounded-xl outline-none text-lg font-bold"
          />
          <button 
            onClick={handleTopUp}
            disabled={submitting}
            className="bg-blue-600 hover:bg-blue-500 text-white px-6 rounded-xl font-bold transition-all active:scale-95 disabled:opacity-50"
          >
            {submitting ? '...' : 'OK'}
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {[10000, 20000, 50000, 100000].map(amt => (
            <button 
              key={amt}
              onClick={() => setTopUpAmount(amt.toString())}
              className="text-xs font-bold glass-card px-3 py-2 rounded-lg opacity-60 hover:opacity-100"
            >
              +{amt.toLocaleString()}
            </button>
          ))}
        </div>
      </section>

      {/* TRANSACTION HISTORY */}
      <section className="space-y-4">
        <label className="text-sm font-bold opacity-70 flex items-center gap-2 ml-2">
          <History className="w-4 h-4" /> Oxirgi tranzaksiyalar
        </label>
        <div className="space-y-3">
          {data.transactions.length === 0 ? (
            <div className="text-center py-6 opacity-40 text-sm italic">Hozircha tarix yo'q</div>
          ) : (
            data.transactions.map(txn => (
              <div key={txn.id} className="glass-card flex justify-between items-center p-3 animate-slide-up">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${txn.amount > 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                    <Coins className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-sm font-bold leading-tight">{txn.description}</div>
                    <div className="text-[10px] opacity-40">{new Date(txn.created_at).toLocaleDateString()} {new Date(txn.created_at).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</div>
                  </div>
                </div>
                <div className={`text-sm font-black ${txn.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {txn.amount > 0 ? '+' : ''}{txn.amount.toLocaleString()}
                </div>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default WalletPage;
