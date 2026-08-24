import { useState } from 'react';
import { LOAN_TYPES } from '../utils/constants';
import { api } from '../utils/api';

export default function ApplyModal({ open, onClose, source = 'direct', agentCode = null, onSuccess }) {
  const [form, setForm] = useState({ customerName: '', contactNumber: '', loanType: '', amount: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successData, setSuccessData] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.customerName || !form.contactNumber || !form.loanType || !form.amount) {
      setError('Please fill all fields');
      return;
    }
    if (!/^[0-9]{10}$/.test(form.contactNumber)) {
      setError('Enter valid 10-digit mobile number');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        customerName: form.customerName,
        contactNumber: form.contactNumber,
        loanType: form.loanType,
        amount: form.amount,
        source,
        agentCode
      };
      const res = await api.createApplication(payload);
      setSuccessData(res);
      onSuccess && onSuccess(res);
      setForm({ customerName: '', contactNumber: '', loanType: '', amount: '' });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[#0A2647]/80 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="relative w-full max-w-md bg-white rounded-[20px] shadow-2xl overflow-hidden animate-slide-up max-h-[90vh] overflow-y-auto">
        {/* header */}
        <div className="bg-[#0A2647] px-6 py-5 flex justify-between items-center">
          <div>
            <h3 className="text-white font-bold text-lg">{source === 'direct' ? 'Apply for Loan Directly' : 'Add New Customer File'}</h3>
            <p className="text-[#E2C275] text-xs mt-1">{source === 'direct' ? 'Walk-in customer application' : `Tagged to Agent: ${agentCode}`}</p>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 text-white hover:bg-white/20 flex items-center justify-center">✕</button>
        </div>

        {successData ? (
          <div className="p-8 text-center">
            <div className="w-16 h-16 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto mb-4 text-2xl">✓</div>
            <h4 className="font-bold text-[#0A2647] text-xl">Application Submitted!</h4>
            <p className="text-slate-500 text-sm mt-2">Your file has been logged successfully.</p>
            
            <div className="mt-6 bg-[#0A2647] rounded-2xl p-5 text-left">
              <div className="text-[10px] tracking-widest uppercase text-[#CCA43B] font-bold">Tracking Code</div>
              <div className="text-2xl font-black text-white mt-1 tracking-wide">{successData.trackingCode}</div>
              <div className="mt-3 flex justify-between text-xs">
                <span className="text-white/60">Customer: {successData.customerName}</span>
                <span className="text-[#CCA43B] font-bold">{successData.fileStatus}</span>
              </div>
            </div>

            <p className="text-[11px] text-slate-400 mt-4">Save this code to track your loan status anytime from home page.</p>

            <div className="mt-6 flex gap-3">
              <button onClick={() => { setSuccessData(null); onClose(); }} className="flex-1 py-3 rounded-full bg-[#0A2647] text-white font-semibold text-sm hover:bg-[#061a32]">Done</button>
              <button onClick={() => setSuccessData(null)} className="flex-1 py-3 rounded-full border border-slate-200 text-slate-700 font-semibold text-sm hover:bg-slate-50">Add Another</button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-5">
            {error && <div className="p-3 rounded-xl bg-red-50 text-red-600 text-xs font-medium">{error}</div>}

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">Customer Name</label>
              <input value={form.customerName} onChange={e=>setForm({...form, customerName: e.target.value})} placeholder="e.g. Rahul Sharma" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#CCA43B]/30 focus:border-[#CCA43B] text-sm" />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">Contact Number</label>
              <input value={form.contactNumber} onChange={e=>setForm({...form, contactNumber: e.target.value})} placeholder="10-digit mobile" type="tel" maxLength={10} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#CCA43B]/30 focus:border-[#CCA43B] text-sm" />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">Loan Type</label>
              <div className="relative">
                <select value={form.loanType} onChange={e=>setForm({...form, loanType: e.target.value})} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#CCA43B]/30 focus:border-[#CCA43B] text-sm appearance-none">
                  <option value="">Select Loan Product</option>
                  {LOAN_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">▼</div>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-widest text-slate-500 mb-1.5">Loan Amount (₹)</label>
              <input value={form.amount} onChange={e=>setForm({...form, amount: e.target.value})} placeholder="e.g. 2500000" type="number" min="10000" className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#CCA43B]/30 focus:border-[#CCA43B] text-sm" />
            </div>

            <button disabled={loading} className="w-full py-3.5 rounded-full bg-gradient-to-r from-[#0A2647] to-[#144272] text-white font-bold text-sm shadow-lg shadow-[#0A2647]/20 hover:opacity-95 disabled:opacity-50 flex items-center justify-center gap-2">
              {loading ? 'Submitting...' : (<>Submit Application <span className="text-[#E2C275]">→</span></>)}
            </button>

            <p className="text-[10px] text-center text-slate-400">By submitting, you agree that file will be auto-tagged {source === 'direct' ? 'as direct walk-in' : `to ${agentCode}`} and tracking code like MLB-402 will be generated.</p>
          </form>
        )}
      </div>
    </div>
  );
}
