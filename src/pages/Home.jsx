import { useState } from 'react';
import ApplyModal from '../components/ApplyModal';
import { api } from '../utils/api';

export default function Home() {
  const [showApply, setShowApply] = useState(false);
  const [trackCode, setTrackCode] = useState('');
  const [trackResult, setTrackResult] = useState(null);
  const [trackError, setTrackError] = useState('');
  const [tracking, setTracking] = useState(false);

  const handleTrack = async (e) => {
    e.preventDefault();
    setTrackError('');
    setTrackResult(null);
    if (!trackCode.trim()) {
      setTrackError('Please enter your file code');
      return;
    }
    setTracking(true);
    try {
      const res = await api.track(trackCode.trim());
      setTrackResult(res);
    } catch (err) {
      setTrackError(err.message);
    } finally {
      setTracking(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#0A2647]">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute -top-24 -left-24 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#144272] to-transparent blur-3xl"></div>
          <div className="absolute -bottom-32 -right-32 w-[700px] h-[700px] rounded-full bg-gradient-to-tl from-[#CCA43B]/20 to-transparent blur-3xl"></div>
        </div>
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-[11px] tracking-widest uppercase text-[#E2C275] font-bold">
                <span className="w-2 h-2 rounded-full bg-[#CCA43B] animate-pulse"></span>
                Trusted Single Office DSA • 60+ Connectors
              </div>
              <h1 className="mt-6 text-4xl sm:text-5xl lg:text-[56px] font-black tracking-tight leading-[1.05] text-white">
                Your Trusted <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#CCA43B] to-[#E2C275]">Loan Bazaar</span><br />
                Partner.
              </h1>
              <p className="mt-5 text-[15px] leading-6 text-white/70 max-w-xl">
                My Loan Bazaar is a proprietary single-office Loan DSA system built for speed, transparency, and mobile-first experience. We handle Plot, Home, Villa, Mortgage, Construction & more.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <button onClick={()=>setShowApply(true)} className="px-7 py-3.5 rounded-full bg-[#CCA43B] text-[#0A2647] font-extrabold text-sm shadow-[0_0_0_6px_rgba(204,164,59,0.15)] hover:shadow-[0_0_0_10px_rgba(204,164,59,0.15)] transition-all flex items-center gap-2">
                  Apply for Loan Directly <span className="text-lg">↗</span>
                </button>
                <a href="#track" className="px-7 py-3.5 rounded-full bg-white/10 text-white font-semibold text-sm border border-white/10 hover:bg-white/15">Track Loan Status</a>
              </div>

              <div className="mt-10 grid grid-cols-3 gap-6 max-w-md border-t border-white/10 pt-6">
                <div><div className="text-2xl font-black text-white">60+</div><div className="text-[11px] uppercase tracking-widest text-white/50">Connectors</div></div>
                <div><div className="text-2xl font-black text-white">9</div><div className="text-[11px] uppercase tracking-widest text-white/50">Loan Products</div></div>
                <div><div className="text-2xl font-black text-[#CCA43B]">24h</div><div className="text-[11px] uppercase tracking-widest text-white/50">File Login</div></div>
              </div>
            </div>

            {/* Visual Card */}
            <div className="relative lg:pl-8 animate-slide-up">
              <div className="relative bg-white rounded-[28px] shadow-2xl p-2">
                <div className="rounded-[20px] overflow-hidden bg-gradient-to-br from-slate-50 to-white p-6 sm:p-8">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#0A2647] flex items-center justify-center text-[#CCA43B] font-black text-sm">MLB</div>
                      <div><div className="font-bold text-[#0A2647] text-sm">Live File Tracker</div><div className="text-[11px] text-slate-500">Secure • Private • Instant</div></div>
                    </div>
                    <div className="px-2.5 py-1 rounded-full bg-green-50 text-green-700 text-[10px] font-bold">● LIVE SYNC</div>
                  </div>

                  <div className="mt-8 space-y-4">
                    {[
                      { code: 'MLB-402', type: 'House Purchase', status: 'Sanctioned', color: 'bg-emerald-500' },
                      { code: 'MLB-719', type: 'Plot Purchase', status: 'Bank Login', color: 'bg-amber-500' },
                      { code: 'MLB-183', type: 'Balance Transfer', status: 'Logged In', color: 'bg-slate-400' },
                    ].map(row=>(
                      <div key={row.code} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 bg-white">
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${row.color}`}></div>
                          <div><div className="font-mono text-xs font-bold text-[#0A2647]">{row.code}</div><div className="text-[11px] text-slate-500">{row.type}</div></div>
                        </div>
                        <div className="text-[11px] font-semibold px-2.5 py-1 rounded-full bg-[#0A2647] text-white">{row.status}</div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 p-4 rounded-xl bg-[#0A2647] text-white flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-[#CCA43B] flex items-center justify-center text-[#0A2647] font-black">C</div>
                    <div className="text-xs"><div className="font-bold">Connector Mode Enabled</div><div className="text-white/60 text-[11px]">Files auto-tagged with Agent Code • Isolated view</div></div>
                  </div>
                </div>
              </div>

              {/* floating */}
              <div className="absolute -bottom-6 -left-6 hidden sm:flex items-center gap-3 bg-white rounded-full shadow-xl px-4 py-2.5 border border-slate-100">
                <div className="w-8 h-8 rounded-full bg-[#CCA43B] flex items-center justify-center font-black text-[#0A2647] text-xs">✓</div>
                <div className="text-xs"><div className="font-bold text-[#0A2647]">Cloud Database Sync</div><div className="text-slate-500 text-[11px]">All devices live</div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Center Button Section */}
      <section className="py-10 px-4">
        <div className="mx-auto max-w-3xl -mt-12 relative z-10">
          <div className="bg-white rounded-[24px] shadow-xl border border-slate-100 p-6 sm:p-8 text-center">
            <h2 className="text-xl font-black text-[#0A2647] tracking-tight">Direct Customer Application</h2>
            <p className="text-sm text-slate-500 mt-2 max-w-lg mx-auto">Walk-in customers can apply instantly. Get your unique tracking code (e.g., MLB-402) on submission.</p>
            <button onClick={()=>setShowApply(true)} className="mt-6 w-full sm:w-auto px-10 py-4 rounded-full bg-[#0A2647] text-white font-bold text-[15px] shadow-lg hover:bg-[#061a32] transition">Apply for Loan Directly</button>
            <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-slate-400"><span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> No login required • Instant code generation</div>
          </div>
        </div>
      </section>

      {/* Track Section */}
      <section id="track" className="py-12 px-4">
        <div className="mx-auto max-w-3xl">
          <div className="bg-white rounded-[24px] shadow-sm border border-slate-200 overflow-hidden">
            <div className="bg-gradient-to-r from-[#0A2647] to-[#144272] p-6 sm:p-8 text-white">
              <h3 className="text-xl font-bold flex items-center gap-3"><span className="w-8 h-8 rounded-full bg-[#CCA43B] text-[#0A2647] flex items-center justify-center text-sm">⌕</span> Track Your Loan Status</h3>
              <p className="text-white/60 text-sm mt-2">Enter your 6-digit file code (e.g., MLB-402). We securely show ONLY your File Status & Loan Type.</p>
            </div>

            <div className="p-6 sm:p-8">
              <form onSubmit={handleTrack} className="flex gap-3">
                <div className="flex-1 relative">
                  <input value={trackCode} onChange={e=>setTrackCode(e.target.value.toUpperCase())} placeholder="Enter code: MLB-402" className="w-full px-5 py-4 rounded-full bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#CCA43B]/30 focus:border-[#CCA43B] font-mono font-bold text-sm tracking-wide uppercase" />
                  <div className="absolute right-2 top-1/2 -translate-y-1/2 hidden sm:block text-[10px] text-slate-400 tracking-widest uppercase mr-3">Secure Query</div>
                </div>
                <button disabled={tracking} className="px-7 py-4 rounded-full bg-[#0A2647] text-white font-bold text-sm hover:bg-[#061a32] disabled:opacity-50">{tracking ? '...' : 'Track'}</button>
              </form>

              {trackError && <div className="mt-4 p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">{trackError}</div>}

              {trackResult && (
                <div className="mt-6 p-5 rounded-2xl bg-[#f8fafc] border border-slate-200 animate-fade-in">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[11px] font-bold tracking-widest uppercase text-slate-500">Tracking Code</div>
                      <div className="font-mono font-black text-[#0A2647] text-lg mt-1">{trackResult.trackingCode}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[11px] font-bold tracking-widest uppercase text-slate-500">Status</div>
                      <div className={`mt-1 inline-flex px-3 py-1 rounded-full text-xs font-bold ${statusColor(trackResult.fileStatus)}`}>{trackResult.fileStatus}</div>
                    </div>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                    <div><div className="text-[11px] uppercase tracking-widest text-slate-500">Loan Type</div><div className="text-sm font-semibold text-[#0A2647] mt-1">{trackResult.loanType}</div></div>
                    <div><div className="text-[11px] uppercase tracking-widest text-slate-500">Last Updated</div><div className="text-sm text-slate-600 mt-1">{new Date(trackResult.updatedAt).toLocaleDateString()}</div></div>
                  </div>
                  <div className="mt-4 text-[11px] text-slate-400 flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> Private view – only your file status visible. No other data exposed.</div>
                </div>
              )}

              <div className="mt-8 grid sm:grid-cols-3 gap-4 text-[11px] text-slate-500">
                <div className="flex gap-2"><span className="text-[#CCA43B] font-bold">●</span> 100% secure – hides all other customers</div>
                <div className="flex gap-2"><span className="text-[#CCA43B] font-bold">●</span> Live cloud sync across devices</div>
                <div className="flex gap-2"><span className="text-[#CCA43B] font-bold">●</span> Works on any mobile browser</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Loan products */}
      <section className="py-12 px-4 bg-white border-y border-slate-100">
        <div className="mx-auto max-w-7xl">
          <div className="text-center max-w-2xl mx-auto">
            <h3 className="text-2xl font-black text-[#0A2647]">Loan Products We Serve</h3>
            <p className="text-sm text-slate-500 mt-2">Every application form uses this exact dropdown – no custom entries. Keeping system lightweight & standardized.</p>
          </div>
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-w-5xl mx-auto">
            {[
              "Plot Purchase","House Purchase","Villa Purchase","Composite Loan (Site + Construction)","Mortgage Loan","Construction Loan","Flat Purchase","Balance Transfer","Personal Loans"
            ].map((t,i)=>(
              <div key={t} className="group p-4 rounded-2xl border border-slate-100 hover:border-[#CCA43B]/30 hover:bg-[#FFFBEB] transition flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-[#0A2647] text-white flex items-center justify-center text-xs font-bold group-hover:bg-[#CCA43B] group-hover:text-[#0A2647] transition">{i+1}</div>
                <div className="text-sm font-semibold text-slate-800">{t}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="py-8 text-center text-[11px] text-slate-400 tracking-wide">
        <div className="mx-auto max-w-7xl px-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-100">
            <span className="w-6 h-6 rounded-full bg-[#0A2647] text-[#CCA43B] flex items-center justify-center font-black text-[9px]">MLB</span>
            My Loan Bazaar • Single Office DSA • No commission splitting • No payment gateway • Lightweight & Secure
          </div>
        </div>
      </footer>

      <ApplyModal open={showApply} onClose={()=>setShowApply(false)} source="direct" onSuccess={()=>{
        // optional: auto-track after success? keep modal behavior
      }} />
    </div>
  );
}

function statusColor(s) {
  switch(s) {
    case 'Logged In': return 'bg-slate-100 text-slate-700';
    case 'Bank Login': return 'bg-amber-100 text-amber-800';
    case 'Sanctioned': return 'bg-blue-100 text-blue-800';
    case 'Disbursed': return 'bg-green-100 text-green-700';
    case 'Rejected': return 'bg-red-100 text-red-700';
    default: return 'bg-slate-100 text-slate-700';
  }
}
