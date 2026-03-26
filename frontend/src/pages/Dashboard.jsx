import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell
} from 'recharts';
import { 
  TrendingUp, TrendingDown, Wallet, Calendar, PieChart 
} from 'lucide-react';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('dashboard/');
        setData(res.data);
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    fetchDashboard();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
       <div className="w-10 h-10 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin" />
       <p className="font-bold text-slate-400 uppercase tracking-widest text-[10px]">Loading Dashboard...</p>
    </div>
  );

  const stats = [
    { label: 'Total Inflow', val: data?.overview?.income, icon: TrendingUp, color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { label: 'Total Outflow', val: data?.overview?.expense, icon: TrendingDown, color: 'text-cyan-500', bg: 'bg-cyan-50' },
    { label: 'Net Position', val: data?.overview?.net, icon: Wallet, color: 'text-slate-800', bg: 'bg-slate-100' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="p-6 bg-white rounded-2xl border border-slate-100 shadow-sm">
         <div className="space-y-1">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Overview</h1>
            <p className="text-sm font-bold text-slate-400">Your financial breakdown at a glance.</p>
         </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((s, i) => (
          <div key={i} className="p-6 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-cyan-500/5 transition-all transition-transform duration-700">
            <div className="flex items-center gap-4">
               <div className={`p-3 rounded-xl ${s.bg}`}>
                  <s.icon className={s.color} size={22} />
               </div>
               <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">{s.label}</p>
                  <h2 className="text-2xl font-black tracking-tighter italic">₹{s.val?.toLocaleString()}</h2>
               </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Main Chart Section */}
        <div className="lg:col-span-3 p-6 bg-white border border-slate-100 rounded-3xl shadow-sm space-y-6">
          <div className="flex items-center gap-3">
             <div className="p-2.5 bg-cyan-50 text-cyan-500 rounded-xl">
                <Calendar size={18} />
             </div>
             <h3 className="text-lg font-black tracking-tight uppercase">Spending Trends</h3>
          </div>
          
          <div className="h-[320px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data?.trends} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                   dataKey="day" 
                   tickFormatter={(val) => new Date(val).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                   axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 900 }}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 900 }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ backgroundColor: '#ffffff', border: '1px solid #f1f5f9', borderRadius: '16px', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }}
                  itemStyle={{ color: '#000', fontWeight: '900', fontSize: '12px' }}
                />
                <Bar 
                  dataKey="total" 
                  radius={[4, 4, 4, 4]} 
                  barSize={18}
                  style={{ cursor: 'pointer' }}
                  onClick={(entry) => navigate(`/day/${entry.day}`)}
                >
                  {data?.trends.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="#06b6d4" />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Categories Section */}
        <div className="lg:col-span-2 p-6 bg-white border border-slate-100 rounded-3xl shadow-sm flex flex-col gap-6">
          <div className="flex items-center gap-3">
             <div className="p-2.5 bg-slate-50 text-slate-800 rounded-xl">
                <PieChart size={18} />
             </div>
             <h3 className="text-lg font-black tracking-tight uppercase">Categories</h3>
          </div>
          
          <div className="space-y-5 flex-1 justify-center py-4">
            {data?.categories.map((cat, i) => (
              <div key={i} className="group space-y-1.5">
                <div className="flex items-center justify-between text-[11px] font-black">
                   <span className="text-slate-500 uppercase tracking-widest group-hover:text-cyan-500 transition-colors">{cat.category}</span>
                   <span className="text-slate-900 font-italic">₹{cat.total.toLocaleString()}</span>
                </div>
                <div className="w-full bg-slate-50 h-2 rounded-full overflow-hidden">
                   <div className="bg-cyan-500 h-full rounded-full transition-all duration-1000" style={{ width: `${(cat.total / data?.overview?.expense) * 100}%` }} />
                </div>
              </div>
            ))}
            {data?.categories.length === 0 && <p className="text-center text-slate-300 text-xs font-black uppercase tracking-widest py-10">No categories found</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
