import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { User, ArrowUpRight, ArrowDownLeft, Search, Activity, Users, ShieldCheck } from 'lucide-react';

const PersonAnalysis = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchData = async () => {
       try {
         const res = await api.get('person-analysis/');
         setStats(res.data);
       } catch (err) { console.error(err); }
       finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const filteredStats = stats.filter(s => 
    s.person?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
       <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
       <p className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">Loading Network...</p>
    </div>
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <header className="flex flex-col lg:flex-row items-center justify-between gap-6 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
         <div className="space-y-1">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight italic uppercase">People</h1>
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest leading-none">Your top transaction nodes.</p>
         </div>
         
         <div className="relative group w-full lg:w-96">
            <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-500 transition-colors" size={20} />
            <input 
               type="text" 
               placeholder="Search by name..." 
               className="w-full pl-14 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none transition-all text-sm font-bold tracking-tight"
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredStats.map((s, i) => (
          <Link 
            key={i} 
            to={`/person/${encodeURIComponent(s.person)}`}
            className="group p-6 bg-white border border-slate-100 rounded-3xl shadow-sm flex flex-col gap-5 hover:translate-y-[-4px] hover:shadow-xl hover:shadow-cyan-500/10 transition-all"
          >
            <div className="flex items-center justify-between">
               <div className="p-3 bg-cyan-100 text-cyan-500 rounded-2xl group-hover:bg-cyan-500 group-hover:text-white transition-all">
                  <User size={24} />
               </div>
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{s.count} Transactions</span>
            </div>

            <div className="min-w-0">
               <h3 className="text-lg font-black tracking-tighter text-slate-900 uppercase italic line-clamp-1">{s.person || 'Unknown'}</h3>
            </div>

            <div className="space-y-4">
               <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-0.5 text-rose-500">
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">SENT</p>
                     <span className="text-sm font-black italic">₹{s.sent?.toLocaleString()}</span>
                  </div>
                  <div className="space-y-0.5 text-emerald-500">
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">RECVD</p>
                     <span className="text-sm font-black italic">₹{s.received?.toLocaleString()}</span>
                  </div>
               </div>

               <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                     <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none">Net Position</p>
                     <span className={`text-xs font-black italic tracking-tighter ${s.net >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {s.net >= 0 ? '+' : '-'}₹{Math.abs(s.net)?.toLocaleString()}
                     </span>
                  </div>
                  <div className="w-full bg-slate-50 h-1.5 rounded-full overflow-hidden">
                     <div 
                        className={`h-full rounded-full transition-all duration-1000 ${s.net >= 0 ? 'bg-cyan-500' : 'bg-rose-400'}`}
                        style={{ width: `${Math.min(100, (Math.abs(s.net) / (s.sent + s.received + 1)) * 100)}%` }}
                     />
                  </div>
               </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredStats.length === 0 && (
         <div className="text-center py-24 bg-slate-50 border border-dashed border-slate-200 rounded-3xl">
            <Users className="mx-auto text-slate-300 mb-4" size={48} />
            <h3 className="text-lg font-black text-slate-400 uppercase tracking-tighter">No one found</h3>
            <p className="text-slate-400 font-bold uppercase tracking-widest text-[9px] mt-1">Try another name</p>
         </div>
      )}
    </div>
  );
};

export default PersonAnalysis;
