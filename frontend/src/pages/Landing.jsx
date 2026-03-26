import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { Wallet, ShieldCheck, Activity, BarChart3, ArrowRight, Zap, Target, Lock } from 'lucide-react';

const Landing = () => {
   const isAuthenticated = !!localStorage.getItem('access');

   if (isAuthenticated) {
      return <Navigate to="/dashboard" />;
   }

   return (
      <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-cyan-100 animate-in fade-in duration-1000">
         {/* Top Bar */}
         <nav className="flex items-center justify-between p-6 max-w-7xl mx-auto">
            <div className="flex items-center gap-3">
               <div className="p-2 bg-gradient-to-br from-cyan-400 to-cyan-600 rounded-xl shadow-lg shadow-cyan-100">
                  <Wallet size={20} className="text-white" />
               </div>
               <h1 className="text-xl font-black italic tracking-tighter text-slate-900 uppercase">SPENDMATE</h1>
            </div>
            <div className="flex items-center gap-6">
               <Link to="/login" className="text-sm font-black text-slate-500 hover:text-cyan-500 transition-colors uppercase tracking-widest">Sign In</Link>
               <Link to="/register" className="px-6 py-2.5 bg-slate-900 text-white text-sm font-black rounded-xl hover:bg-cyan-600 transition-all shadow-xl shadow-slate-200">Get Started</Link>
            </div>
         </nav>

         {/* Hero Section */}
         <main className="max-w-7xl mx-auto px-6 py-24 flex flex-col items-center text-center space-y-12">
            <div className="space-y-6">
               <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-100 text-cyan-600 rounded-full text-[10px] font-black uppercase tracking-widest animate-bounce">
                  <Zap size={10} /> VERSION 0.0.1 RELEASED
               </div>
               <h2 className="text-7xl font-black italic tracking-tighter text-slate-900 leading-[0.95] max-w-4xl mx-auto uppercase">
                  HIGH-PRECISION BANK <span className="text-cyan-500 underline decoration-cyan-200 decoration-8 underline-offset-8">STATEMENT ANALYSIS.</span>
               </h2>
               <p className="text-slate-500 font-bold text-xl max-w-2xl mx-auto leading-relaxed">
                  Professional-grade financial profiling with field-level encryption. Transform raw PDFs into structured insights with our precision regex engine.
               </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-4">
               <Link to="/register" className="px-10 py-5 bg-slate-900 text-white text-lg font-black rounded-2xl hover:bg-cyan-600 transition-all shadow-2xl shadow-slate-200 flex items-center gap-3 group">
                  Start Free Registry <ArrowRight className="group-hover:translate-x-2 transition-transform" />
               </Link>
               <Link to="/login" className="px-10 py-5 bg-white border border-slate-200 text-slate-900 text-lg font-black rounded-2xl hover:bg-slate-50 transition-all">
                  Launch Dashboard
               </Link>
            </div>

            {/* Feature Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full py-24">
               {[
                  { title: 'AES-256 SECURED', desc: 'Every name, UPI ID, and narrative is encrypted before it touches your database.', icon: Lock },
                  { title: 'REGEX-TUTORED ENGINE', desc: 'Specially tuned for Indian bank formats with high-precision pattern extraction.', icon: Activity },
                  { title: 'PERSON ANALYTICS', desc: 'Consolidated overview of all peer-to-peer data with net liquidity tracking.', icon: Target }
               ].map((f, i) => (
                  <div key={i} className="p-10 bg-white border border-slate-100 rounded-[2.5rem] shadow-sm text-left hover:shadow-xl hover:shadow-cyan-100/20 transition-all group">
                     <div className="p-4 bg-cyan-50 text-cyan-500 rounded-2xl w-fit mb-6 group-hover:bg-cyan-500 group-hover:text-white transition-all">
                        <f.icon size={32} />
                     </div>
                     <h3 className="text-xl font-black italic tracking-tight mb-2 uppercase">{f.title}</h3>
                     <p className="font-bold text-slate-400 text-sm leading-relaxed">{f.desc}</p>
                  </div>
               ))}
            </div>
         </main>

         {/* Footer Branding */}
         <footer className="py-12 border-t border-slate-100 text-center">
            <div className="flex items-center justify-center gap-3 opacity-30 mb-2">
               <ShieldCheck size={16} />
               <p className="text-[10px] font-black uppercase tracking-widest">REGULATED ENCRYPTED ANALYSIS PULSE</p>
            </div>
         </footer>
      </div>
   );
};

export default Landing;
