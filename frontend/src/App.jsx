import React, { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import api from './api';

// Pages
import Dashboard from './pages/Dashboard';
import Upload from './pages/Upload';
import PersonAnalysis from './pages/PersonAnalysis';
import UPISearch from './pages/UPISearch';
import PersonDetail from './pages/PersonDetail';
import DayTransactions from './pages/DayTransactions';
import Login from './pages/Login';
import Register from './pages/Register';
import Landing from './pages/Landing';

// Icons
import { 
  LayoutDashboard, Upload as UploadIcon, Users, Search, 
  LogOut, Wallet, User, ChevronDown
} from 'lucide-react';

const NavLink = ({ to, icon: Icon, children, current }) => {
  const active = current === to;
  return (
    <Link
      to={to}
      className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-bold text-sm ${
        active 
          ? 'bg-cyan-500 text-white shadow-md' 
          : 'text-slate-500 hover:bg-slate-50 hover:text-cyan-600'
      }`}
    >
      <Icon size={18} strokeWidth={active ? 2.5 : 2} />
      <span>{children}</span>
    </Link>
  );
};

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('access'));
  const [isBackendUp, setIsBackendUp] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setIsAuthenticated(!!localStorage.getItem('access'));
    setShowUserMenu(false); // Close menu on navigation
  }, [location]);

  // Click outside listener for user menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        await api.get('health/');
        setIsBackendUp(true);
      } catch {
        setIsBackendUp(false);
      }
    };
    checkHealth();
    const interval = setInterval(checkHealth, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access');
    localStorage.removeItem('refresh');
    setIsAuthenticated(false);
    navigate('/login');
  };

  const handleClearData = async () => {
    if (window.confirm('Absolutely delete all your data? This cannot be undone.')) {
      try {
        await api.delete('clear-data/');
        alert('All data deleted.');
        window.location.reload();
      } catch (err) { alert('Clear failed.'); }
    }
  };

  const isAuthPage = ['/login', '/register', '/'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-cyan-100">
      {isAuthenticated && !isAuthPage && (
        <header className="fixed top-0 inset-x-0 z-50 bg-white border-b border-slate-100 px-6 py-3 flex items-center justify-between shadow-sm">
           <Link to="/dashboard" className="flex items-center gap-3">
              <div className="p-2 bg-cyan-500 rounded-xl shadow-lg shadow-cyan-100">
                 <Wallet size={20} className="text-white" />
              </div>
              <h1 className="text-xl font-black text-slate-900 tracking-tight">SpendMate</h1>
           </Link>

           <nav className="hidden md:flex items-center gap-2">
              <NavLink to="/dashboard" icon={LayoutDashboard} current={location.pathname}>Dashboard</NavLink>
              <NavLink to="/upload" icon={UploadIcon} current={location.pathname}>Upload Statement</NavLink>
              <NavLink to="/persons" icon={Users} current={location.pathname}>People</NavLink>
              <NavLink to="/upi" icon={Search} current={location.pathname}>UPI Search</NavLink>
           </nav>

           <div className="flex items-center gap-6">
              <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-slate-50 rounded-full">
                 <div className={`w-2 h-2 rounded-full ${isBackendUp ? 'bg-cyan-400' : 'bg-rose-400'}`} />
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{isBackendUp ? 'Connected' : 'Offline'}</span>
              </div>
              
              <div className="relative" ref={userMenuRef}>
                 <button 
                   onClick={() => setShowUserMenu(!showUserMenu)}
                   className={`flex items-center gap-2 p-1.5 pr-3 rounded-xl transition-all ${
                     showUserMenu ? 'bg-cyan-50 text-cyan-600 ring-2 ring-cyan-100' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                   }`}
                 >
                    <div className="p-1.5 bg-white rounded-lg shadow-sm">
                       <User size={18} />
                    </div>
                    <ChevronDown size={14} className={`transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
                 </button>

                 {showUserMenu && (
                    <div className="absolute right-0 top-full mt-3 w-56 animate-in slide-in-from-top-2 fade-in duration-200">
                       <div className="bg-white border border-slate-100 rounded-2xl shadow-2xl p-2 flex flex-col gap-1 overflow-hidden">
                          <button onClick={handleClearData} className="w-full text-left px-4 py-2.5 text-xs font-bold text-rose-500 hover:bg-rose-50 rounded-xl transition-colors">Delete All Data</button>
                          <div className="h-px bg-slate-50 mx-2" />
                          <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-sm font-bold text-slate-600 hover:bg-slate-50 rounded-xl flex items-center justify-between group">
                             Sign Out <LogOut size={16} className="text-slate-400 group-hover:translate-x-1 transition-transform" />
                          </button>
                       </div>
                    </div>
                 )}
              </div>
           </div>
        </header>
      )}

      <main className={`${isAuthenticated && !isAuthPage ? 'pt-24 pb-12 px-6 lg:px-12 w-full max-w-[1400px] mx-auto' : ''}`}>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/dashboard" element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} />
          <Route path="/upload" element={isAuthenticated ? <Upload /> : <Navigate to="/login" />} />
          <Route path="/persons" element={isAuthenticated ? <PersonAnalysis /> : <Navigate to="/login" />} />
          <Route path="/person/:personName" element={isAuthenticated ? <PersonDetail /> : <Navigate to="/login" />} />
          <Route path="/day/:date" element={isAuthenticated ? <DayTransactions /> : <Navigate to="/login" />} />
          <Route path="/upi" element={isAuthenticated ? <UPISearch /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
