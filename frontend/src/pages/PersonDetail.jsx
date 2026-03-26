import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import { 
  User, ArrowLeft, ArrowUpRight, ArrowDownLeft, 
  Calendar, CreditCard, Wallet, Activity 
} from 'lucide-react';

const PersonDetail = () => {
  const { personName } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const res = await api.get(`person-transactions/?name=${encodeURIComponent(personName)}`);
        setData(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTransactions();
  }, [personName]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
       <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
       <p className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">Retrieving context...</p>
    </div>
  );

  if (!data) return (
     <div className="text-center py-24">
        <p className="font-black text-slate-400 uppercase tracking-tighter">Profile not found</p>
        <button onClick={() => navigate('/persons')} className="mt-4 text-cyan-600 font-bold uppercase tracking-widest text-[10px]">Back to Network</button>
     </div>
  );

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <button 
        onClick={() => navigate('/persons')}
        className="flex items-center gap-2 text-slate-400 hover:text-cyan-600 transition-colors font-bold uppercase tracking-widest text-[10px]"
      >
        <ArrowLeft size={14} /> Back to Network
      </button>

      {/* Profile Header Card */}
      <header className="bg-white border border-slate-100 p-8 rounded-3xl shadow-sm space-y-6 relative overflow-hidden group">
         <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-50 rounded-full -mr-16 -mt-16 opacity-40 group-hover:scale-125 transition-transform duration-1000" />
         
         <div className="flex items-center gap-5 relative z-10">
            <div className="p-4 bg-cyan-500 text-white rounded-2xl shadow-xl shadow-cyan-100">
               <User size={32} />
            </div>
            <div>
               <h1 className="text-3xl font-black italic tracking-tighter text-slate-900 uppercase">{data.person}</h1>
               <p className="text-[10px] font-black text-cyan-500 uppercase tracking-widest">Global Relationships Registry</p>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 relative z-10">
            {[
              { label: 'Outflow', val: data.summary.sent, icon: ArrowUpRight, color: 'text-rose-500', bg: 'bg-rose-50' },
              { label: 'Inflow', val: data.summary.received, icon: ArrowDownLeft, color: 'text-emerald-500', bg: 'bg-emerald-50' },
              { label: 'Net Liquidity', val: data.summary.net, icon: Wallet, color: 'text-cyan-600', bg: 'bg-cyan-50' },
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

      {/* Transaction History Log */}
      <div className="bg-white border border-slate-100 rounded-3xl shadow-sm overflow-hidden">
         <div className="p-6 border-b border-slate-50 flex items-center justify-between">
            <div className="flex items-center gap-3">
               <Activity size={18} className="text-slate-400" />
               <h3 className="text-sm font-black text-slate-900 uppercase italic">shared history</h3>
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{data.summary.count} Events captured</span>
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
                             <Calendar size={10} /> {t.date}
                          </span>
                          <span className="text-[9px] font-black text-cyan-500 uppercase tracking-widest opacity-60 px-2 py-0.5 bg-cyan-50 rounded-full">{t.category}</span>
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

         {data.transactions.length === 0 && (
           <div className="p-12 text-center">
              <p className="text-xs font-black text-slate-300 uppercase tracking-widest">No transaction records found</p>
           </div>
         )}
      </div>
    </div>
  );
};

export default PersonDetail;
