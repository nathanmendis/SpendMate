import React, { useState } from 'react';
import api from '../api';
import { Search, Hash, ArrowRight, ArrowUpRight, ArrowDownLeft, Clock, TrendingUp, Shield, Activity, Calendar, Wallet } from 'lucide-react';

const UPISearch = () => {
  const [upiId, setUpiId] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSearch = async (e) => {
    e?.preventDefault();
    if (!upiId) return;
    setLoading(true);
    setError(null);
    try {
      const res = await api.get(`upi-search/?upi_id=${upiId}`);
      setResult(res.data);
    } catch (err) { setError('No matching data hash found in the encrypted database.'); }
    finally { setLoading(false); }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <header className="text-center space-y-3 py-8 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group">
         <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-100 text-cyan-600 rounded-full text-[10px] font-black uppercase tracking-widest leading-none">
            <Shield size={12} /> Deep Packet Terminal
         </div>
         <h1 className="text-3xl font-black italic tracking-tighter text-slate-900 leading-none">
            UPI <span className="text-cyan-500">ENTITY SEARCH</span>
         </h1>
         <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Analyze historical movement vectors for specific IDs.</p>
      </header>

      <form onSubmit={handleSearch} className="relative group max-w-2xl mx-auto">
         <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400 to-cyan-600 rounded-2xl blur opacity-10 group-focus-within:opacity-40 transition duration-1000" />
         <div className="relative">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-500 transition-colors" size={24} />
            <input 
               type="text" 
               placeholder="Lookup UPI ID (e.g. nathan@ybl)..." 
               className="w-full pl-16 pr-44 py-5 bg-white border border-slate-100 rounded-2xl focus:outline-none focus:border-cyan-500 shadow-xl shadow-cyan-100/10 text-lg font-black tracking-tight"
               value={upiId}
               onChange={(e) => setUpiId(e.target.value)}
            />
            <button 
               type="submit"
               disabled={loading || !upiId}
               className="absolute right-3 top-1/2 -translate-y-1/2 px-8 py-3 bg-slate-900 text-white text-xs font-black rounded-xl hover:bg-cyan-600 transition-all flex items-center gap-2 active:scale-95 disabled:opacity-50 uppercase tracking-widest"
            >
               {loading ? 'Scanning...' : 'Execute'} <ArrowRight size={16} />
            </button>
         </div>
      </form>

      {error && (
         <div className="max-w-3xl mx-auto p-4 bg-rose-50 border border-rose-100 rounded-2xl text-rose-500 font-bold text-center flex items-center justify-center gap-3 text-xs uppercase tracking-widest">
            <Hash size={18} /> {error}
         </div>
      )}

      {result && (
        <div className="space-y-8 animate-in zoom-in-95 duration-500">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'Outflow', val: result.summary.sent, icon: ArrowUpRight, color: 'text-rose-500', bg: 'bg-rose-50' },
                { label: 'Inflow', val: result.summary.received, icon: ArrowDownLeft, color: 'text-emerald-500', bg: 'bg-emerald-50' },
                { label: 'Net Pos', val: result.summary.net, icon: TrendingUp, color: 'text-cyan-500', bg: 'bg-cyan-50' },
              ].map((s, i) => (
                <div key={i} className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm group">
                   <div className="flex items-center gap-3 mb-4">
                      <div className={`p-2.5 rounded-xl ${s.bg} ${s.color}`}>
                         <s.icon size={18} />
                      </div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.label}</p>
                   </div>
                   <h3 className="text-2xl font-black tracking-tighter italic">₹{s.val.toLocaleString()}</h3>
                </div>
              ))}
           </div>

           <div className="bg-white border border-slate-100 rounded-[2.5rem] shadow-sm overflow-hidden p-6 md:p-10">
              <div className="flex items-center justify-between mb-8">
                 <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-slate-50 text-slate-800 rounded-xl">
                       <Clock size={20} />
                    </div>
                    <div>
                       <h3 className="text-lg font-black tracking-tighter uppercase italic">Ledger History</h3>
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{result.summary.count} events captured</p>
                    </div>
                 </div>
                 <div className="text-[10px] font-black text-slate-400 bg-slate-100 px-4 py-1.5 rounded-full uppercase tracking-widest italic">{result.upi_id}</div>
              </div>

              <div className="overflow-x-auto">
                 <table className="w-full text-left">
                    <thead>
                       <tr className="border-b border-slate-50">
                          <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">TIMESTAMP</th>
                          <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest">ENTITIY DESCRIPTOR</th>
                          <th className="px-4 py-3 text-[9px] font-black text-slate-400 uppercase tracking-widest text-right">VALUE</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                       {result.transactions.map((t, idx) => (
                          <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                             <td className="px-4 py-5">
                                <span className="text-[11px] font-black text-slate-500 font-mono italic tracking-tighter">{t.date}</span>
                             </td>
                             <td className="px-4 py-5 max-w-sm">
                                <div className="text-[11px] font-black text-slate-700 uppercase italic line-clamp-1">{t.description}</div>
                                <div className="text-[9px] font-black text-cyan-500 tracking-widest mt-0.5 opacity-60">CAT: {t.category}</div>
                             </td>
                             <td className={`px-4 py-5 text-right font-black italic text-sm ${t.type === 'DEBIT' ? 'text-rose-500' : 'text-emerald-500'}`}>
                                {t.type === 'DEBIT' ? '-' : '+'}₹{parseFloat(t.amount).toLocaleString()}
                             </td>
                          </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
           </div>
        </div>
      )}

      {!result && !loading && (
        <div className="text-center py-20 bg-slate-50 border border-dashed border-slate-100 rounded-[3rem]">
            <Activity className="mx-auto text-slate-300 mb-4" size={48} />
            <h3 className="text-lg font-black text-slate-400 uppercase tracking-tighter">Terminal Idle</h3>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px] mt-1">Ready for encrypted lookup pulse</p>
        </div>
      )}
    </div>
  );
};

export default UPISearch;
