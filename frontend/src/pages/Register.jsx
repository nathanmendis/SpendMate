import React, { useState } from 'react';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Wallet, AlertCircle, CheckCircle, ShieldCheck } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [status, setStatus] = useState({ type: null, message: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: null, message: '' });
    try {
      await api.post('register/', formData);
      setStatus({ type: 'success', message: 'Account created! Redirecting...' });
      setTimeout(() => navigate('/login'), 2500);
    } catch (err) {
      console.error(err);
      setStatus({ type: 'error', message: 'Username is taken. Try another.' });
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
              <ShieldCheck size={32} className="text-white" />
           </div>
           <h1 className="text-2xl font-black italic tracking-tighter text-slate-900 uppercase">SpendMate</h1>
        </div>

        {/* Simple Form Container */}
        <div className="p-10 bg-white border border-slate-100 rounded-3xl shadow-xl shadow-slate-200/50 space-y-8 relative overflow-hidden">
           <div className="space-y-1">
              <h2 className="text-xl font-black text-slate-800 tracking-tight">Create Account</h2>
              <p className="text-xs font-bold text-slate-400">Join SpendMate and simplify your finances.</p>
           </div>

           <form onSubmit={handleRegister} className="space-y-4 text-left">
              <div className="space-y-1.5">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Username</label>
                 <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-500 transition-colors" size={16} />
                    <input 
                       type="text" 
                       placeholder="Enter a username" 
                       className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none transition-all text-sm font-bold placeholder:text-slate-300"
                       value={formData.username}
                       onChange={(e) => setFormData({...formData, username: e.target.value})}
                       required
                    />
                 </div>
              </div>

              <div className="space-y-1.5">
                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                 <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-cyan-500 transition-colors" size={16} />
                    <input 
                       type="email" 
                       placeholder="your@email.com" 
                       className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:ring-4 focus:ring-cyan-500/10 focus:border-cyan-500 outline-none transition-all text-sm font-bold placeholder:text-slate-300"
                       value={formData.email}
                       onChange={(e) => setFormData({...formData, email: e.target.value})}
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
                       value={formData.password}
                       onChange={(e) => setFormData({...formData, password: e.target.value})}
                       required
                    />
                 </div>
              </div>

              {status.type && (
                <div className={`p-4 rounded-xl font-bold flex items-center justify-center gap-4 animate-in slide-in-from-top-4 ${status.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-500 border border-rose-100'}`}>
                   {status.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                   <p className="text-[10px] font-black uppercase tracking-widest italic">{status.message}</p>
                </div>
              )}

              <button 
                 type="submit"
                 disabled={loading}
                 className={`w-full py-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-3 relative overflow-hidden group active:scale-95 ${
                    loading 
                    ? 'bg-slate-100 text-slate-300' 
                    : 'bg-slate-900 text-white hover:bg-cyan-600 shadow-xl shadow-slate-200'
                 }`}
              >
                 {loading ? 'Creating Account...' : 'Sign Up'} 
                 {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
              </button>
           </form>

           <div className="pt-6 border-t border-slate-50 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
              Have an account? <Link to="/login" className="text-cyan-600 hover:underline">Log in</Link>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
