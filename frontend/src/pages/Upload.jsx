import React, { useState, useRef } from 'react';
import api from '../api';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2, ArrowRight, ShieldCheck, Database } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: null, message: '' });
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await api.post('upload/', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
      setResult(res.data);
      setStatus({ type: 'success', message: res.data.message });
    } catch (err) {
      setStatus({ type: 'error', message: 'Ingestion failed. Invalid PDF stream.' });
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-6 duration-1000">
      <section className="text-center space-y-4 py-6 bg-white p-6 rounded-3xl border border-slate-100 shadow-sm relative overflow-hidden group">
         <div className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-100 text-cyan-600 rounded-full text-[10px] font-black uppercase tracking-widest">
            <ShieldCheck size={12} /> Encrypted Ingestion Active
         </div>
         <h1 className="text-3xl font-black italic tracking-tighter text-slate-900 uppercase">
            DATA <span className="text-cyan-500 underline decoration-cyan-100 decoration-4">PIPELINE</span>
         </h1>
         <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Ingest capital movement records for encrypted profiling.</p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* Compact Upload Card */}
        <div className="p-8 bg-white border border-slate-100 rounded-3xl shadow-sm flex flex-col gap-6">
           <div 
             onClick={() => fileInputRef.current?.click()}
             className={`cursor-pointer group relative flex flex-col items-center justify-center gap-4 py-12 px-6 border-2 border-dashed rounded-2xl transition-all duration-500 ${
               file ? 'border-cyan-500 bg-cyan-50/20' : 'border-slate-100 hover:border-cyan-400 hover:bg-slate-50'
             }`}
           >
              <div className={`p-4 rounded-xl transition-all duration-500 ${
                file ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-100 scale-110' : 'bg-slate-50 text-slate-400 group-hover:scale-110 group-hover:text-cyan-500'
              }`}>
                 {file ? <FileText size={32} /> : <Upload size={32} />}
              </div>
              <div className="text-center">
                 <h3 className="text-sm font-black tracking-tight mb-1">{file ? file.name : 'Select bank PDF'}</h3>
                 <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Encrypted Upload</p>
              </div>
              <input type="file" ref={fileInputRef} className="hidden" onChange={(e) => setFile(e.target.files[0])} accept="application/pdf" />
           </div>

           {status.type && (
             <div className={`flex items-center gap-3 p-4 rounded-xl text-xs font-black uppercase tracking-widest ${status.type === 'success' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-rose-50 text-rose-600 border border-rose-100'}`}>
                {status.type === 'success' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                <p className="tracking-tight">{status.message}</p>
             </div>
           )}

           <button 
             onClick={handleUpload}
             disabled={loading || !file}
             className={`w-full py-4 rounded-xl flex items-center justify-center gap-3 text-xs font-black uppercase tracking-widest transition-all ${
               loading || !file 
               ? 'bg-slate-100 text-slate-300 cursor-not-allowed' 
               : 'bg-slate-900 text-white hover:bg-cyan-600 shadow-xl shadow-slate-200'
             }`}
           >
             {loading ? <Loader2 className="animate-spin" /> : <Database size={18} />}
             {loading ? 'Initializing Stream...' : 'Authorize Ingestion'}
           </button>
        </div>

        {/* Info / Result Section */}
        <div className="space-y-6 lg:h-full">
           {!result ? (
             <div className="p-8 bg-slate-50 border border-slate-100 rounded-3xl space-y-6 flex flex-col justify-center lg:h-full">
                <div className="flex items-center gap-3">
                   <ShieldCheck size={20} className="text-cyan-500" />
                   <h3 className="text-lg font-black tracking-tighter uppercase italic">Registry Guard</h3>
                </div>
                <div className="space-y-4">
                   {[
                     'AES-256 field-level encryption active.',
                     'PII entities (Names, UPI IDs) are zero-knowledge.',
                     'Supports Union Bank, HDFC, and ICICI formats.'
                   ].map((txt, i) => (
                     <div key={i} className="flex gap-3">
                        <div className="w-1 h-auto bg-cyan-400 rounded-full" />
                        <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest leading-relaxed">{txt}</p>
                     </div>
                   ))}
                </div>
             </div>
           ) : (
             <div className="p-8 bg-white border border-cyan-100 rounded-3xl shadow-xl shadow-cyan-100/10 space-y-6 animate-in zoom-in-95 duration-500">
                <div className="flex items-center gap-3">
                   <div className="p-2.5 bg-cyan-500 text-white rounded-xl">
                      <CheckCircle size={24} />
                   </div>
                   <div>
                      <h3 className="text-lg font-black tracking-tighter text-slate-900 uppercase italic">Validated</h3>
                      <p className="text-[10px] font-black text-cyan-600 tracking-widest uppercase">{result.saved} New items saved</p>
                   </div>
                </div>

                <div className="divide-y divide-slate-50 border-t border-b border-slate-50 py-2">
                   {result.transactions.slice(0, 4).map((t, idx) => (
                      <div key={idx} className="py-3 flex items-center justify-between gap-4">
                         <div className="flex-1 min-w-0">
                            <p className="text-[11px] font-black text-slate-900 uppercase truncate mb-0.5">{t.description}</p>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{t.date}</span>
                         </div>
                         <span className={`text-xs font-black ${t.type === 'DEBIT' ? 'text-rose-500' : 'text-emerald-500'}`}>
                            {t.type === 'DEBIT' ? '-' : '+'}₹{parseFloat(t.amount).toLocaleString()}
                         </span>
                      </div>
                   ))}
                </div>

                <button onClick={() => navigate('/dashboard')} className="w-full py-4 border-2 border-slate-900 rounded-xl flex items-center justify-center gap-3 text-xs font-black text-slate-900 hover:bg-slate-900 hover:text-white transition-all group uppercase tracking-widest">
                   Finalize Analysis <ArrowRight size={14} className="group-hover:translate-x-2 transition-transform" />
                </button>
             </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default UploadPage;
