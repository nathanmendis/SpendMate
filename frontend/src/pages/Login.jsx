import React, { useState } from 'react';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, ArrowRight, Wallet, AlertCircle, ShieldCheck } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('login/', { username, password });
      localStorage.setItem('access', res.data.access);
      localStorage.setItem('refresh', res.data.refresh);
      window.location.href = '/';
    } catch (err) {
      setError('Invalid username or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-6 animate-in fade-in zoom-in-95 duration-700">
      <div className="w-full max-w-sm space-y-10 text-center">
        {/* Simple Brand */}
        <div className="space-y-4">
           <div className="p-3 bg-cyan-500 w-fit mx-auto rounded-2xl shadow-lg shadow-cyan-100 flex items-center justify-center">
              <Wallet size={32} className="text-white" />
           </div>
           <h1 className="text-2xl font-black italic tracking-tighter text-slate-900 uppercase">SpendMate</h1>
        </div>

        {/* Simple Form */}
        <div className="p-10 bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-200/50 space-y-8 relative overflow-hidden">
           <div className="space-y-1">
              <h2 className="text-xl font-black text-slate-800">Sign In</h2>
              <p className="text-xs font-bold text-slate-400">Welcome back! Analyze your statements.</p>
           </div>

           <form onSubmit={handleLogin} className="space-y-4 text-left">
              <div className="space-y-1.5">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Username</label>
                 <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-500 transition-colors" size={16} />
                    <input 
                       type="text" 
                       placeholder="Enter your username" 
                       className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none transition-all text-sm font-bold placeholder:text-slate-300"
                       value={username}
                       onChange={(e) => setUsername(e.target.value)}
                       required
                    />
                 </div>
              </div>

              <div className="space-y-1.5">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Password</label>
                 <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-500 transition-colors" size={16} />
                    <input 
                       type="password" 
                       placeholder="••••••••" 
                       className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none transition-all text-sm font-bold placeholder:text-slate-300"
                       value={password}
                       onChange={(e) => setPassword(e.target.value)}
                       required
                    />
                 </div>
              </div>

              {error && (
                <div className="p-3 bg-rose-50 border border-rose-100 text-rose-500 rounded-lg text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2">
                   <AlertCircle size={14} /> {error}
                </div>
              )}

              <button 
                 type="submit"
                 disabled={loading}
                 className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-cyan-600 transition-all flex items-center justify-center gap-2 group active:scale-95 disabled:opacity-50"
              >
                 {loading ? 'Thinking...' : 'Sign In'} 
                 {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
              </button>
           </form>

           <div className="pt-6 border-t border-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              No account? <Link to="/register" className="text-cyan-600 hover:underline">Create one</Link>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
