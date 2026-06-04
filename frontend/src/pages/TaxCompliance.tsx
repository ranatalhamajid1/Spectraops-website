import React, { useState } from 'react';
import { FileCheck, ShieldCheck, CheckCircle2, ArrowRight, AlertCircle } from 'lucide-react';
import { makeApiRequest } from '../services/api';

const taxServices = [
  {
    title: 'LLC Name Change',
    desc: 'Amend your official Articles of Organization with the state registrar. We prepare and submit state certificate amendments.',
    turnaround: '2-4 Business Days'
  },
  {
    title: 'LLC Address Change',
    desc: 'Submit official address amendments to the state division of corporations and notify the IRS of physical location updates.',
    turnaround: '1-3 Business Days'
  },
  {
    title: 'Registered Agent Change',
    desc: 'Transition your registered agent services to SpectraOps to ensure prompt reception of legal correspondence and notices.',
    turnaround: '24 Hours'
  },
  {
    title: 'LLC Conversion',
    desc: 'Convert standard partnership structures to limited liability companies, or convert LLCs to corporate stock organizations.',
    turnaround: '5-7 Business Days'
  },
  {
    title: 'Sales Tax Assistance',
    desc: 'Verify state sales tax nexus thresholds, register for sales tax permits, and compute automated tax filings.',
    turnaround: 'Ongoing Advisory'
  },
  {
    title: 'Tax Compliance Support',
    desc: 'End-to-end guidance for international owners. Avoid penalties by filing federal returns (Form 1120 & 5472) and state franchise taxes.',
    turnaround: 'Annual Services'
  }
];

export const TaxCompliance: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [serviceType, setServiceType] = useState('tax_support');
  const [messageText, setMessageText] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const res = await makeApiRequest('/crm/leads', 'POST', {
        name,
        email,
        company,
        service_type: `tax_${serviceType}`,
        message: messageText,
        source: 'tax_compliance_page',
      });

      if (res.success) {
        setStatus('success');
        setMessage('Compliance request logged successfully. A corporate compliance officer will contact you within 24 hours.');
        setName('');
        setEmail('');
        setCompany('');
        setMessageText('');
      } else {
        throw new Error(res.error || 'Submission failed');
      }
    } catch (err: unknown) {
      setStatus('error');
      const errorMessage = err instanceof Error ? err.message : 'An error occurred.';
      setMessage(errorMessage);
    }
  };

  return (
    <div className="relative pt-20 pb-24 cyber-grid min-h-screen">
      <div className="aurora-bg aurora-blue top-40 right-10"></div>
      <div className="aurora-bg aurora-purple bottom-20 left-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-20">

        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mt-12 space-y-5">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-white/5 border border-slate-200 dark:border-white/10 rounded-full text-xs text-cyber-accent font-semibold tracking-wide backdrop-blur-md">
            <FileCheck className="h-3.5 w-3.5 text-cyber-accent" />
            <span>CORPORATE MAINTENANCE & IRS RETURNS</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-heading  text-slate-900 dark:text-white tracking-tight">
            Corporate Tax & State Compliance
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed max-w-2xl mx-auto">
            Stay in good standing with state registries and the IRS. We manage amendments, registered agent transitions, conversions, and federal reporting requirements for global corporations.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {taxServices.map((svc, i) => (
            <div key={i} className="glass-panel rounded-2xl p-6 border border-slate-200 dark:border-white/5 space-y-4 hover:border-cyber-accent/20 transition-all duration-300 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-heading font-extrabold text-slate-900 dark:text-white">{svc.title}</h3>
                  <span className="text-[10px] bg-white/5 border border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded font-mono">
                    {svc.turnaround}
                  </span>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">{svc.desc}</p>
              </div>
              <div className="pt-4 flex items-center text-[10px] text-cyber-accent font-extrabold tracking-widest uppercase">
                <ShieldCheck className="h-4 w-4 mr-1.5" />
                <span>Verified Procedure</span>
              </div>
            </div>
          ))}
        </div>

        {/* Request Form */}
        <div className="max-w-2xl mx-auto">
          <div className="glass-panel p-10 rounded-3xl border border-slate-200 dark:border-white/10 space-y-8">
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-heading font-extrabold text-slate-900 dark:text-white">Initialize Compliance Review</h2>
              <p className="text-slate-600 dark:text-slate-400 text-xs">Verify your corporate tax parameters or filing needs to request an audit.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-600 dark:text-slate-400">Full Name</label>
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" className="w-full glass-input" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-600 dark:text-slate-400">Email Address</label>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@company.com" className="w-full glass-input" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-600 dark:text-slate-400">Company Name</label>
                  <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Acme LLC" className="w-full glass-input" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-600 dark:text-slate-400">Filing / Maintenance Needed</label>
                  <select value={serviceType} onChange={(e) => setServiceType(e.target.value)} className="w-full glass-input bg-cyber-bg border border-slate-200 dark:border-white/10 rounded-xl">
                    <option value="name_change">LLC Name Amendment</option>
                    <option value="address_change">LLC Address Update</option>
                    <option value="agent_change">Change Registered Agent</option>
                    <option value="conversion">Corporate/LLC Conversion</option>
                    <option value="sales_tax">Sales Tax Registration & Filing</option>
                    <option value="tax_support">Annual Income Tax Filings (1120/5472)</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-600 dark:text-slate-400">Corporate Details / Filing History</label>
                <textarea rows={4} required value={messageText} onChange={(e) => setMessageText(e.target.value)} placeholder="Include registration state, date of formation, and specific filings due..." className="w-full glass-input resize-none" />
              </div>

              <button type="submit" disabled={status === 'loading'} className="w-full py-4 bg-gradient-to-r from-cyber-accent to-cyber-glow text-white font-bold rounded-xl text-xs hover:brightness-110 shadow-glow disabled:opacity-50 transition-all flex items-center justify-center space-x-2">
                <span>Request Compliance Action</span>
                <ArrowRight className="h-4 w-4" />
              </button>

              {status === 'success' && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs font-semibold flex items-center space-x-2">
                  <CheckCircle2 className="h-5 w-5 shrink-0" />
                  <span>{message}</span>
                </div>
              )}
              {status === 'error' && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs font-semibold flex items-center space-x-2">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <span>{message}</span>
                </div>
              )}
            </form>
          </div>
        </div>

      </div>
    </div>
  );
};

export default TaxCompliance;
