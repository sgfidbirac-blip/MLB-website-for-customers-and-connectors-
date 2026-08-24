import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApplyModal from '../components/ApplyModal';
import { api } from '../utils/api';

export default function ConnectorDashboard() {
  const [connector, setConnector] = useState(null);
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showApply, setShowApply] = useState(false);
  const nav = useNavigate();

  useEffect(()=>{
    const stored = localStorage.getItem('mlb_connector');
    if (!stored) { nav('/connector-login'); return; }
    const parsed = JSON.parse(stored);
    setConnector(parsed);
    fetchApps(parsed.agentCode);
  }, []);

  const fetchApps = async (code) => {
    setLoading(true);
    try {
      const data = await api.getConnectorApps(code);
      setApps(data);
    } catch (e) {
      console.error(e);
    } finally { setLoading(false); }
  };

  if (!connector) return null;

  const stats = {
    total: apps.length,
    logged: apps.filter(a=>a.fileStatus==='Logged In').length,
    sanctioned: apps.filter(a=>a.fileStatus==='Sanctioned').length,
    disbursed: apps.filter(a=>a.fileStatus==='Disbursed').length,
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* header */}
      <div className="bg-[#0A2647] text-white px-4 sm:px-8 py-6">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white text-[#0A2647] flex items-center justify-center font-black text-xl">{connector.name[0]}</div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-black">{connector.name}</h2>
                <span className="px-2.5 py-1 rounded-full bg-[#CCA43B] text-[#0A2647] text-[11px] font-black tracking-widest">{connector.agentCode}</span>
              </div>
              <div className="text-white/60 text-xs mt-1">{connector.phone} • Permanent Agent Code • Isolated Dashboard</div>
            </div>
          </div>
          <button onClick={()=>setShowApply(true)} className="px-6 py-3 rounded-full bg-[#CCA43B] text-[#0A2647] font-bold text-sm hover:bg-[#E2C275]">+ Add New Customer File</button>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-8 py-8">
        {/* stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-slate-100 p-5"><div className="text-[11px] uppercase tracking-widest font-bold text-slate-500">Total Files</div><div className="text-2xl font-black text-[#0A2647] mt-1">{stats.total}</div><div className="text-[11px] text-slate-400 mt-1">Tagged to {connector.agentCode}</div></div>
          <div className="bg-white rounded-2xl border border-slate-100 p-5"><div className="text-[11px] uppercase tracking-widest font-bold text-slate-500">Logged In</div><div className="text-2xl font-black text-slate-800 mt-1">{stats.logged}</div><div className="text-[11px] text-amber-600 mt-1">Awaiting bank</div></div>
          <div className="bg-white rounded-2xl border border-slate-100 p-5"><div className="text-[11px] uppercase tracking-widest font-bold text-slate-500">Sanctioned</div><div className="text-2xl font-black text-blue-700 mt-1">{stats.sanctioned}</div><div className="text-[11px] text-blue-600 mt-1">Approved files</div></div>
          <div className="bg-white rounded-2xl border border-slate-100 p-5"><div className="text-[11px] uppercase tracking-widest font-bold text-slate-500">Disbursed</div><div className="text-2xl font-black text-green-700 mt-1">{stats.disbursed}</div><div className="text-[11px] text-green-600 mt-1">Completed</div></div>
        </div>

        {/* table */}
        <div className="mt-8 bg-white rounded-[20px] border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-5 sm:p-6 flex items-center justify-between border-b border-slate-100">
            <h3 className="font-bold text-[#0A2647]">Your Files History</h3>
            <div className="text-[11px] px-3 py-1 rounded-full bg-slate-50 border border-slate-200 text-slate-600">Only {connector.agentCode} files visible</div>
          </div>

          {loading ? (
            <div className="p-12 text-center text-slate-400 text-sm">Loading your files...</div>
          ) : apps.length===0 ? (
            <div className="p-12 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-50 mx-auto flex items-center justify-center text-slate-400">📁</div>
              <div className="mt-3 font-bold text-[#0A2647]">No files yet</div>
              <div className="text-xs text-slate-500 mt-1">Add your first customer file. It will be auto-tagged with {connector.agentCode}.</div>
              <button onClick={()=>setShowApply(true)} className="mt-4 px-5 py-2.5 rounded-full bg-[#0A2647] text-white text-xs font-bold">Add File</button>
            </div>
          ) : (
            <>
              {/* desktop */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-[11px] uppercase tracking-widest text-slate-500"><tr><th className="px-6 py-3 text-left font-bold">Tracking Code</th><th className="px-6 py-3 text-left font-bold">Customer</th><th className="px-6 py-3 text-left font-bold">Loan Type</th><th className="px-6 py-3 text-left font-bold">Amount</th><th className="px-6 py-3 text-left font-bold">Status</th><th className="px-6 py-3 text-left font-bold">Date</th></tr></thead>
                  <tbody className="divide-y divide-slate-100">
                    {apps.map(app=>(
                      <tr key={app.id} className="hover:bg-slate-50/50">
                        <td className="px-6 py-4 font-mono font-bold text-[#0A2647]">{app.trackingCode}</td>
                        <td className="px-6 py-4"><div className="font-semibold">{app.customerName}</div><div className="text-xs text-slate-500">{app.contactNumber}</div></td>
                        <td className="px-6 py-4 text-xs">{app.loanType}</td>
                        <td className="px-6 py-4 font-semibold">₹{Number(app.amount).toLocaleString('en-IN')}</td>
                        <td className="px-6 py-4"><span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${statusStyle(app.fileStatus)}`}>{app.fileStatus}</span></td>
                        <td className="px-6 py-4 text-xs text-slate-500">{new Date(app.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* mobile cards */}
              <div className="sm:hidden divide-y divide-slate-100">
                {apps.map(app=>(
                  <div key={app.id} className="p-4">
                    <div className="flex justify-between items-start"><span className="font-mono font-bold text-[#0A2647] text-sm">{app.trackingCode}</span><span className={`px-2 py-1 rounded-full text-[10px] font-bold ${statusStyle(app.fileStatus)}`}>{app.fileStatus}</span></div>
                    <div className="mt-2"><div className="font-bold text-sm">{app.customerName}</div><div className="text-xs text-slate-500">{app.contactNumber} • ₹{Number(app.amount).toLocaleString()}</div></div>
                    <div className="mt-2 text-[11px] bg-slate-50 rounded-lg px-2.5 py-1.5 inline-block">{app.loanType}</div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="mt-6 text-[11px] text-slate-400 text-center">Secure isolated view • You cannot see files from other connectors • Cloud sync live</div>
      </div>

      <ApplyModal open={showApply} onClose={()=>setShowApply(false)} source="connector" agentCode={connector.agentCode} onSuccess={(newFile)=>setApps(prev=>[newFile, ...prev])} />
    </div>
  );
}

function statusStyle(s){
  switch(s){
    case 'Logged In': return 'bg-slate-100 text-slate-700';
    case 'Bank Login': return 'bg-amber-100 text-amber-800';
    case 'Sanctioned': return 'bg-blue-100 text-blue-800';
    case 'Disbursed': return 'bg-green-100 text-green-700';
    case 'Rejected': return 'bg-red-100 text-red-700';
    default: return 'bg-slate-100';
  }
}
