import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { 
  Calendar, ArrowLeft, ArrowUpRight, ArrowDownLeft, 
  CreditCard, Wallet, Activity, User 
} from 'lucide-react';

const DayTransactions = () => {
  const { date } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDay = async () => {
      try {
        const res = await api.get(`day-transactions/?date=${date}`);
        setData(res.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchDay();
  }, [date]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
       <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
       <p className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">Retrieving context...</p>
    </div>
  );

  const formattedDate = new Date(date).toLocaleDateString(undefined, { 
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
  });

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <button 
        onClick={() => navigate('/dashboard')}
        className="flex items-center gap-2 text-slate-400 hover:text-cyan-600 transition-colors font-bold uppercase tracking-widest text-[10px]"
      >
        <ArrowLeft size={14} /> Back to Dashboard
      </button>

      {/* Daily Summary Card */}
      <header className="bg-white border border-slate-100 p-8 rounded-3xl shadow-sm space-y-6">
         <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
               <div className="p-4 bg-slate-900 text-white rounded-2xl">
                  <Calendar size={32} />
               </div>
               <div>
                  <h1 className="text-2xl font-black italic tracking-tighter text-slate-900 uppercase">{formattedDate}</h1>
                  <p className="text-[10px] font-black text-cyan-500 uppercase tracking-widest">Temporal Registry Log</p>
               </div>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            {[
              { label: 'Outflow', val: data.summary.sent, icon: ArrowUpRight, color: 'text-rose-500', bg: 'bg-rose-50' },
              { label: 'Inflow', val: data.summary.received, icon: ArrowDownLeft, color: 'text-emerald-500', bg: 'bg-emerald-50' },
              { label: 'Daily Net', val: data.summary.net, icon: Wallet, color: 'text-cyan-600', bg: 'bg-cyan-50' },
            ].map((s, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-50 border border-slate-100">
                 <div className="flex items-center gap-2 mb-2">
                    <s.icon size={14} className={s.color} />
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{s.label}</span>
                 </div>
                 <p className="text-xl font-black italic tracking-tighter">₹{s.val.toLocaleString()}</p>
              </div>
            ))}
         </div>
      </header>

      {/* Transaction List */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
         <div className="p-6 border-b border-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
               <Activity size={18} className="text-slate-400" />
               <h3 className="text-sm font-black text-slate-900 uppercase italic">ledger entries</h3>
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{data.summary.count} Records</span>
         </div>

         <div className="divide-y divide-slate-50">
            {data.transactions.map((t, i) => (
              <div key={i} className="p-6 flex items-center justify-between hover:bg-slate-50/50 transition-colors group">
                 <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="mt-1 p-2 bg-slate-50 rounded-lg text-slate-400 group-hover:text-cyan-500 transition-colors">
                       <CreditCard size={14} />
                    </div>
                    <div className="min-w-0">
                       <p className="text-sm font-black text-slate-800 uppercase italic truncate">{t.description}</p>
                       <div className="flex items-center gap-3 mt-1">
                          <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1 uppercase tracking-widest">
                             {t.category}
                          </span>
                          {t.person && (
                             <span className="text-[9px] font-black text-cyan-500 uppercase tracking-widest flex items-center gap-1">
                                <User size={10} /> {t.person}
                             </span>
                          )}
                       </div>
                    </div>
                 </div>
                 <div className="text-right ml-4">
                    <p className={`text-sm font-black italic tracking-tighter ${t.type === 'DEBIT' ? 'text-rose-500' : 'text-emerald-500'}`}>
                       {t.type === 'DEBIT' ? '-' : '+'}₹{parseFloat(t.amount).toLocaleString()}
                    </p>
                 </div>
              </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default DayTransactions;
