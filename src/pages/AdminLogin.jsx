import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { api } from '../utils/api';

export default function AdminLogin() {
  const [form, setForm] = useState({ userId: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await api.adminLogin({ userId: form.userId, password: form.password });
      localStorage.setItem('mlb_admin_token', res.token);
      nav('/admin-dashboard');
    } catch (err) {
      setError(err.message);
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-[#061a32] flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden opacity-40">
        <div className="absolute -top-32 -left-32 w-[600px] h-[600px] rounded-full bg-[#144272] blur-[100px]"></div>
        <div className="absolute -bottom-32 -right-32 w-[600px] h-[600px] rounded-full bg-[#CCA43B]/20 blur-[100px]"></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#CCA43B] flex items-center justify-center font-black text-[#0A2647]">MLB</div>
            <span className="text-white font-black text-lg">My Loan Bazaar</span>
          </Link>
          <div className="mt-3 inline-flex px-3 py-1 rounded-full bg-[#CCA43B]/10 border border-[#CCA43B]/20 text-[#E2C275] text-[11px] tracking-widest uppercase font-bold">Permanent Admin Portal</div>
        </div>

        <div className="bg-white rounded-[24px] shadow-2xl p-8">
          <h2 className="text-xl font-black text-[#0A2647]">Admin Login</h2>
          <p className="text-xs text-slate-500 mt-1">Hardcoded permanent access: admin786 / dsapassword123</p>
          <p className="text-[11px] text-slate-400 mt-1">Route: /admin-bazaar • Lifetime access</p>

          {error && <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-xs">{error}</div>}

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500">User ID</label>
              <input value={form.userId} onChange={e=>setForm({...form, userId: e.target.value})} placeholder="admin786" className="mt-1.5 w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#CCA43B]/30 text-sm" />
            </div>
            <div>
              <label className="text-[11px] font-bold uppercase tracking-widest text-slate-500">Password</label>
              <input value={form.password} onChange={e=>setForm({...form, password: e.target.value})} type="password" placeholder="••••••••••••" className="mt-1.5 w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#CCA43B]/30 text-sm" />
            </div>
            <button disabled={loading} className="w-full py-3.5 rounded-full bg-[#0A2647] text-white font-bold text-sm hover:bg-[#061a32] disabled:opacity-50">{loading ? 'Verifying...' : 'Login as Admin'}</button>
          </form>

          <div className="mt-6 p-3 rounded-xl bg-[#FFFBEB] border border-[#E2C275]/30">
            <div className="text-[11px] font-bold text-[#A67C00]">Permanent credentials</div>
            <div className="font-mono text-xs text-[#0A2647] mt-1">ID: admin786<br/>Pass: dsapassword123</div>
          </div>

          <div className="mt-6 text-center">
            <Link to="/" className="text-xs text-slate-500 hover:text-[#0A2647]">← Back to Home</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
