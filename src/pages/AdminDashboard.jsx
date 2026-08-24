import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../utils/api';
import { FILE_STATUSES } from '../utils/constants';

export default function AdminDashboard() {
  const [apps, setApps] = useState([]);
  const [connectors, setConnectors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [updating, setUpdating] = useState(null);
  const nav = useNavigate();
  const token = localStorage.getItem('mlb_admin_token');

  useEffect(()=>{
    if (!token) { nav('/admin-bazaar'); return; }
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const [a, c] = await Promise.all([api.getAllApplications(token), api.getAllConnectors(token)]);
      setApps(a);
      setConnectors(c);
    } catch(e) {
      console.error(e);
      if (e.message.includes('Unauthorized') || e.message.includes('admin')) {
        localStorage.removeItem('mlb_admin_token');
        nav('/admin-bazaar');
      }
    } finally { setLoading(false); }
  };

  const handleStatusChange = async (id, newStatus) => {
    setUpdating(id);
    try {
      const updated = await api.updateStatus(id, newStatus, token);
      setApps(prev => prev.map(p => p.id===id ? updated : p));
    } catch(e){ alert(e.message); }
    finally{ setUpdating(null); }
  };

  const filtered = apps.filter(app=>{
    const matchStatus = filter==='all' || app.fileStatus===filter;
    const q = search.toLowerCase();
    const matchSearch = !q || app.trackingCode.toLowerCase().includes(q) || app.customerName.toLowerCase().includes(q) || (app.agentCode||'').toLowerCase().includes(q) || app.loanType.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const stats = {
    total: apps.length,
    direct: apps.filter(a=>a.source==='direct').length,
    connector: apps.filter(a=>a.source==='connector').length,
    disbursed: apps.filter(a=>a.fileStatus==='Disbursed').length,
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="bg-[#0A2647] text-white px-4 sm:px-8 py-5">
        <div className="mx-auto max-w-7xl flex flex-col gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black flex items-center gap-3">Admin Dashboard <span className="px-2.5 py-1 rounded-full bg-[#CCA43B] text-[#0A2647] text-[10px] tracking-widest">PERMANENT</span></h2>
              <div className="text-white/60 text-xs mt-1">Global view • Direct + Connector submissions • Hardcoded admin786 access</div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={load} className="px-4 py-2 rounded-full bg-white/10 text-white text-xs font-bold hover:bg-white/20">↻ Refresh</button>
              <button onClick={()=>{ localStorage.removeItem('mlb_admin_token'); nav('/admin-bazaar'); }} className="px-4 py-2 rounded-full bg-white text-[#0A2647] text-xs font-bold">Logout</button>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-2">
            <div className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/10"><div className="text-[10px] uppercase tracking-widest font-bold text-white/60">Total Files</div><div className="text-2xl font-black text-white mt-1">{stats.total}</div><div className="text-[11px] text-[#E2C275] mt-1">{stats.direct} direct • {stats.connector} connector</div></div>
            <div className="bg-white/10 backdrop-blur rounded-2xl p-4 border border-white/10"><div className="text-[10px] uppercase tracking-widest font-bold text-white/60">Connectors</div><div className="text-2xl font-black text-white mt-1">{connectors.length}</div><div className="text-[11px] text-white/50 mt-1">Active agents</div></div>
            <div className="bg-white rounded-2xl p-4 text-[#0A2647]"><div className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Disbursed</div><div className="text-2xl font-black mt-1">{stats.disbursed}</div><div className="text-[11px] text-green-600 mt-1">Completed files</div></div>
            <div className="bg-[#CCA43B] rounded-2xl p-4 text-[#0A2647]"><div className="text-[10px] uppercase tracking-widest font-bold opacity-70">Live Sync</div><div className="text-sm font-black mt-1">Cloud Database</div><div className="text-[11px] opacity-70 mt-1">All devices synced</div></div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-8 py-6">
        {/* filters */}
        <div className="bg-white rounded-2xl border border-slate-100 p-4 flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex gap-2 flex-wrap">
            <button onClick={()=>setFilter('all')} className={`px-4 py-2 rounded-full text-xs font-bold border ${filter==='all' ? 'bg-[#0A2647] text-white border-[#0A2647]' : 'bg-white text-slate-600 border-slate-200'}`}>All</button>
            {FILE_STATUSES.map(s=>(
              <button key={s} onClick={()=>setFilter(s)} className={`px-4 py-2 rounded-full text-xs font-bold border ${filter===s ? 'bg-[#CCA43B] text-[#0A2647] border-[#CCA43B]' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'}`}>{s}</button>
            ))}
          </div>
          <div className="flex gap-2 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-[300px]">
              <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search code, name, agent, loan type..." className="w-full pl-10 pr-4 py-2.5 rounded-full bg-slate-50 border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#CCA43B]/30" />
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">⌕</span>
            </div>
          </div>
        </div>

        {/* table */}
        <div className="mt-6 bg-white rounded-[20px] border border-slate-100 shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-slate-400 text-sm">Loading global records...</div>
          ) : filtered.length===0 ? (
            <div className="p-12 text-center"><div className="font-bold text-[#0A2647]">No records found</div><div className="text-xs text-slate-500 mt-1">Try adjusting filters</div></div>
          ) : (
            <>
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-[11px] uppercase tracking-widest text-slate-500">
                    <tr>
                      <th className="px-5 py-3 text-left">Code</th>
                      <th className="px-5 py-3 text-left">Customer</th>
                      <th className="px-5 py-3 text-left">Loan Type</th>
                      <th className="px-5 py-3 text-left">Amount</th>
                      <th className="px-5 py-3 text-left">Source</th>
                      <th className="px-5 py-3 text-left">Status (Admin Only)</th>
                      <th className="px-5 py-3 text-left">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {filtered.map(app=>(
                      <tr key={app.id} className="hover:bg-slate-50/70">
                        <td className="px-5 py-4 font-mono font-bold text-[#0A2647]">{app.trackingCode}</td>
                        <td className="px-5 py-4"><div className="font-semibold text-[#0A2647]">{app.customerName}</div><div className="text-xs text-slate-500">{app.contactNumber}</div></td>
                        <td className="px-5 py-4"><div className="text-xs">{app.loanType}</div></td>
                        <td className="px-5 py-4 font-semibold">₹{Number(app.amount).toLocaleString('en-IN')}</td>
                        <td className="px-5 py-4">
                          {app.source==='direct' ? <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 text-[11px] font-bold">Direct</span> : <span className="px-2.5 py-1 rounded-full bg-[#0A2647] text-[#E2C275] text-[11px] font-mono font-bold">{app.agentCode}</span>}
                        </td>
                        <td className="px-5 py-4">
                          <div className="relative">
                            <select value={app.fileStatus} onChange={e=>handleStatusChange(app.id, e.target.value)} disabled={updating===app.id} className={`px-3 py-2 rounded-full text-xs font-bold border appearance-none pr-8 focus:outline-none focus:ring-2 ${statusBorder(app.fileStatus)}`}>
                              {FILE_STATUSES.map(s=><option key={s} value={s}>{s}</option>)}
                            </select>
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-[10px]">▼</span>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-xs text-slate-500">{new Date(app.createdAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* mobile */}
              <div className="lg:hidden divide-y divide-slate-100">
                {filtered.map(app=>(
                  <div key={app.id} className="p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <div className="font-mono font-bold text-[#0A2647]">{app.trackingCode}</div>
                      {app.source==='direct' ? <span className="text-[10px] px-2 py-1 rounded-full bg-slate-100 font-bold">DIRECT</span> : <span className="text-[10px] px-2 py-1 rounded-full bg-[#0A2647] text-[#CCA43B] font-mono font-bold">{app.agentCode}</span>}
                    </div>
                    <div><div className="font-bold text-sm">{app.customerName}</div><div className="text-xs text-slate-500">{app.contactNumber} • ₹{Number(app.amount).toLocaleString()}</div></div>
                    <div className="text-xs bg-slate-50 rounded-lg px-2.5 py-1 inline-block">{app.loanType}</div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-slate-500">Status:</span>
                      <select value={app.fileStatus} onChange={e=>handleStatusChange(app.id, e.target.value)} className={`flex-1 px-3 py-2 rounded-full text-xs font-bold border ${statusBorder(app.fileStatus)}`}>
                        {FILE_STATUSES.map(s=><option key={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* connectors list */}
        <div className="mt-8 bg-white rounded-[20px] border border-slate-100 p-6">
          <h3 className="font-bold text-[#0A2647] flex items-center gap-2">Connectors Directory <span className="text-[11px] px-2 py-1 rounded-full bg-slate-100 font-bold">{connectors.length}</span></h3>
          <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {connectors.map(c=>(
              <div key={c.id} className="p-3 rounded-xl border border-slate-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0A2647] text-[#CCA43B] flex items-center justify-center font-bold text-sm">{c.name[0]}</div>
                <div><div className="font-bold text-sm text-[#0A2647]">{c.name} <span className="font-mono text-[11px] text-[#CCA43B] bg-[#0A2647] px-1.5 py-0.5 rounded ml-1">{c.agentCode}</span></div><div className="text-xs text-slate-500">{c.phone}</div></div>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 text-center text-[11px] text-slate-400">Admin exclusive rights: can change File Status via dropdown • No commission splitting • No payment gateway • Lightweight</div>
      </div>
    </div>
  );
}

function statusBorder(s){
  switch(s){
    case 'Logged In': return 'bg-slate-50 border-slate-200 text-slate-700';
    case 'Bank Login': return 'bg-amber-50 border-amber-200 text-amber-800';
    case 'Sanctioned': return 'bg-blue-50 border-blue-200 text-blue-800';
    case 'Disbursed': return 'bg-green-50 border-green-200 text-green-700';
    case 'Rejected': return 'bg-red-50 border-red-200 text-red-700';
    default: return 'bg-white border-slate-200';
  }
}
