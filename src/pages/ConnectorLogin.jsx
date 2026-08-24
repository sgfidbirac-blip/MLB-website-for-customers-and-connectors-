import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../utils/api';

export default function ConnectorLogin() {
  const [mode, setMode] = useState('login'); // login, register
  const [form, setForm] = useState({ agentCode: '', phone: '', password: '', name: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);
  const nav = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const payload = form.agentCode ? { agentCode: form.agentCode, password: form.password } : { phone: form.phone, password: form.password };
      const res = await api.loginConnector(payload);
      localStorage.setItem('mlb_connector', JSON.stringify(res));
      nav('/connector-dashboard');
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.registerConnector({ name: form.name, phone: form.phone, password: form.password });
      setSuccess(res);
      setMode('login');
      setForm({ ...form, agentCode: res.agentCode });
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex">
      {/* left */}
      <div className="hidden lg:flex w-[46%] bg-[#0A2647] relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-[500px] h-[500px] rounded-full bg-[#144272] blur-[80px] opacity-80"></div>
        <div className="absolute -bottom-20 -right-20 w-[600px] h-[600px] rounded-full bg-[#CCA43B]/20 blur-[90px]"></div>
        <div className="relative z-10 p-12 flex flex-col justify-between w-full">
          <div>
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#CCA43B] flex items-center justify-center font-black text-[#0A2647] text-sm">MLB</div>
              <span className="text-white font-bold">My Loan Bazaar</span>
            </Link>
          </div>
          <div>
            <div className="inline-flex px-3 py-1 rounded-full bg-white/10 border border-white/10 text-[11px] uppercase tracking-widest text-[#E2C275] font-bold">Connector Portal</div>
            <h2 className="mt-6 text-4xl font-black text-white leading-[1.1]">Built for your<br/><span className="text-[#CCA43B]">60+ network.</span></h2>
            <p className="mt-4 text-white/60 text-sm leading-6 max-w-sm">Secure dashboard. Every file you upload is auto-tagged with your permanent Agent Code. You see only your own history – isolated & private.</p>
            <div className="mt-10 space-y-3 max-w-sm">
              <div className="flex gap-3 p-3 rounded-xl bg-white/5 border border-white/10"><div className="w-8 h-8 rounded-full bg-[#CCA43B] text-[#0A2647] flex items-center justify-center font-bold text-xs">A</div><div><div className="text-white text-xs font-bold">Permanent Agent Code</div><div className="text-white/50 text-[11px]">e.g., CON-101 • Shown in profile</div></div></div>
              <div className="flex gap-3 p-3 rounded-xl bg-white/5 border border-white/10"><div className="w-8 h-8 rounded-full bg-white text-[#0A2647] flex items-center justify-center font-bold text-xs">🔒</div><div><div className="text-white text-xs font-bold">Isolated View</div><div className="text-white/50 text-[11px]">You cannot view other connectors' files</div></div></div>
            </div>
          </div>
          <div className="text-[11px] text-white/30">Cloud sync • Mobile optimized • Lightweight</div>
        </div>
      </div>

      {/* right */}
      <div className="flex-1 flex items-center justify-center p-4 sm:p-8">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-6">
            <div className="w-9 h-9 rounded-lg bg-[#0A2647] text-[#CCA43B] flex items-center justify-center font-black">MLB</div>
            <span className="font-bold text-[#0A2647]">My Loan Bazaar</span>
          </div>

          <div className="bg-white rounded-[24px] shadow-xl border border-slate-100 p-7 sm:p-8">
            <div className="flex p-1 rounded-full bg-slate-100">
              <button onClick={()=>setMode('login')} className={`flex-1 py-2.5 rounded-full text-sm font-bold transition ${mode==='login' ? 'bg-[#0A2647] text-white shadow' : 'text-slate-500'}`}>Login</button>
              <button onClick={()=>setMode('register')} className={`flex-1 py-2.5 rounded-full text-sm font-bold transition ${mode==='register' ? 'bg-[#0A2647] text-white shadow' : 'text-slate-500'}`}>Register</button>
            </div>

            <h3 className="mt-6 text-xl font-black text-[#0A2647]">{mode==='login' ? 'Connector Login' : 'New Connector Registration'}</h3>
            <p className="text-xs text-slate-500 mt-1">{mode==='login' ? 'Login with Agent Code + Password' : 'Get your permanent Agent Code instantly'}</p>

            {error && <div className="mt-4 p-3 rounded-xl bg-red-50 text-red-600 text-xs">{error}</div>}
            {success && <div className="mt-4 p-4 rounded-xl bg-green-50 border border-green-100"><div className="text-xs font-bold text-green-800">Registered! Your Agent Code:</div><div className="font-mono font-black text-green-900 text-lg mt-1">{success.agentCode}</div><div className="text-[11px] text-green-600 mt-1">Please save it. Now login.</div></div>}

            {mode==='login' ? (
              <form onSubmit={handleLogin} className="mt-6 space-y-4">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Agent Code</label>
                  <input value={form.agentCode} onChange={e=>setForm({...form, agentCode: e.target.value.toUpperCase()})} placeholder="CON-101" className="mt-1.5 w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#CCA43B]/30 font-mono text-sm" />
                  <div className="text-[11px] text-slate-400 mt-1">Or leave blank and use phone below</div>
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Phone (if no Agent Code)</label>
                  <input value={form.phone} onChange={e=>setForm({...form, phone: e.target.value})} placeholder="10-digit" className="mt-1.5 w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#CCA43B]/30 text-sm" />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Password</label>
                  <input value={form.password} onChange={e=>setForm({...form, password: e.target.value})} type="password" placeholder="••••••••" className="mt-1.5 w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#CCA43B]/30 text-sm" />
                </div>
                <button disabled={loading} className="w-full py-3.5 rounded-full bg-[#0A2647] text-white font-bold text-sm hover:bg-[#061a32] disabled:opacity-50">{loading ? 'Signing in...' : 'Login to Dashboard'}</button>
                <div className="text-[11px] text-center text-slate-400">Demo: CON-101 / connector123</div>
              </form>
            ) : (
              <form onSubmit={handleRegister} className="mt-6 space-y-4">
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Full Name</label>
                  <input value={form.name} onChange={e=>setForm({...form, name: e.target.value})} placeholder="Your name" className="mt-1.5 w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#CCA43B]/30 text-sm" />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Phone Number</label>
                  <input value={form.phone} onChange={e=>setForm({...form, phone: e.target.value})} placeholder="10-digit mobile" className="mt-1.5 w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#CCA43B]/30 text-sm" />
                </div>
                <div>
                  <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Set Password</label>
                  <input value={form.password} onChange={e=>setForm({...form, password: e.target.value})} type="password" placeholder="Create password" className="mt-1.5 w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#CCA43B]/30 text-sm" />
                </div>
                <button disabled={loading} className="w-full py-3.5 rounded-full bg-[#CCA43B] text-[#0A2647] font-bold text-sm hover:bg-[#E2C275] disabled:opacity-50">{loading ? 'Creating...' : 'Create Agent Code'}</button>
                <p className="text-[10px] text-center text-slate-400">Permanent Agent Code auto-generated like CON-XXX. Handles 60+ connectors.</p>
              </form>
            )}
          </div>

          <div className="mt-4 text-center">
            <Link to="/" className="text-xs text-slate-500 hover:text-[#0A2647]">← Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
