import React, { useState } from 'react';
import { ShieldCheck, CheckCircle2, ArrowRight, AlertCircle, ShoppingCart } from 'lucide-react';
import { makeApiRequest } from '../services/api';
import { TurnstileWidget } from '../components/TurnstileWidget';

const ecommerceServices = [
  {
    title: 'Amazon Seller Tax Support',
    desc: 'VAT registration and monthly filings for Amazon UK/EU FBA. We structure US LLCs to claim tax exemptions on FBA inventory transfers.',
    features: ['UK/EU FBA VAT registrations', 'Form 1099-K validation advisory', 'US inventory nexus certificates']
  },
  {
    title: 'eBay Seller Tax Support',
    desc: 'Verify cross-border marketplace compliance rules, sales tax withholding certificates, and global seller account parameters.',
    features: ['Cross-border tax reporting', 'W-8BEN / W-9 verification audits', 'Double-taxation mitigation advisory']
  },
  {
    title: 'Shopify Tax Support',
    desc: 'Integrate automated tax calculation APIs (Shopify Tax, Avalara) to compute destination-based sales taxes across 50+ states.',
    features: ['Shopify Tax API setups', 'Destination-based tax configuration', 'Automated sales tax filings logs']
  },
  {
    title: 'Marketplace Compliance',
    desc: 'Establish and verify high-volume payment processor approvals. Navigate PCI-DSS audits, Stripe verification requests, and merchant reserve thresholds.',
    features: ['Stripe & PayPal verification assist', 'PCI-DSS readiness assessments', 'Merchant account risk mitigating']
  }
];

export const EcommerceCompliance: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [marketplaceType, setMarketplaceType] = useState('amazon');
  const [details, setDetails] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!turnstileToken && (import.meta as any).env?.VITE_TURNSTILE_ENABLED !== 'false') {
      setStatus('error');
      setMessage('Please complete the security verification (Turnstile) challenge.');
      return;
    }
    setStatus('loading');
    setMessage('');

    try {
      const res = await makeApiRequest('/crm/leads', 'POST', {
        name,
        email,
        company,
        service_type: `ecom_${marketplaceType}`,
        message: details,
        source: 'ecommerce_compliance_page',
        turnstileToken,
      });

      if (res.success) {
        setStatus('success');
        setMessage('E-commerce compliance audit request sent. A corporate consultant will review your seller parameters and contact you.');
        setName('');
        setEmail('');
        setCompany('');
        setDetails('');
        setTurnstileToken(null);
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
      <div className="aurora-bg aurora-blue top-40 left-10"></div>
      <div className="aurora-bg aurora-purple bottom-40 right-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-20">

        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mt-12 space-y-5">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-white/5 border border-slate-200 dark:border-white/10 rounded-full text-xs text-cyber-accent font-semibold tracking-wide backdrop-blur-md">
            <ShoppingCart className="h-3.5 w-3.5 text-cyber-accent" />
            <span>GLOBAL ONLINE MERCHANT MATRIX</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-heading  text-slate-900 dark:text-white tracking-tight">
            E-Commerce Tax & Marketplace Compliance
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed max-w-2xl mx-auto">
            Scale your online store globally with secure compliance setups. We guide Amazon, eBay, and Shopify merchants through VAT filings, sales tax configurations, and payment merchant audits.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {ecommerceServices.map((svc, i) => (
            <div key={i} className="glass-panel rounded-2xl p-8 border border-slate-200 dark:border-white/5 space-y-5 hover:border-cyber-accent/20 transition-all duration-300 flex flex-col justify-between group">
              <div className="space-y-4">
                <h3 className="text-base font-heading font-extrabold text-slate-900 dark:text-white">{svc.title}</h3>
                <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">{svc.desc}</p>
                <ul className="space-y-2 pt-2">
                  {svc.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-center text-[11px] text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="h-3.5 w-3.5 text-cyber-accent mr-2 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="pt-4 flex items-center text-[10px] text-cyber-accent font-extrabold tracking-widest uppercase">
                <ShieldCheck className="h-4 w-4 mr-1.5" />
                <span>Verified Standard</span>
              </div>
            </div>
          ))}
        </div>

        {/* Consultation Form */}
        <div className="max-w-2xl mx-auto">
          <div className="glass-panel p-10 rounded-3xl border border-slate-200 dark:border-white/10 space-y-8">
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-heading font-extrabold text-slate-900 dark:text-white">Request Merchant Assessment</h2>
              <p className="text-slate-600 dark:text-slate-400 text-xs">Submit your store information to audit payment gateways and sales tax exposures.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-600 dark:text-slate-400">Full Name</label>
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" className="w-full glass-input" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-600 dark:text-slate-400">Corporate Email</label>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@company.com" className="w-full glass-input" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-600 dark:text-slate-400">Store / Company Name</label>
                  <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="MyStore LLC" className="w-full glass-input" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-600 dark:text-slate-400">Store Platform</label>
                  <select value={marketplaceType} onChange={(e) => setMarketplaceType(e.target.value)} className="w-full glass-input bg-cyber-bg border border-slate-200 dark:border-white/10 rounded-xl">
                    <option value="amazon">Amazon FBA / Merchant</option>
                    <option value="ebay">eBay Seller Account</option>
                    <option value="shopify">Shopify Store</option>
                    <option value="stripe">Stripe Gateway Compliance</option>
                    <option value="other">Multi-platform merchant</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-600 dark:text-slate-400">Store Metrics / Operations Overview</label>
                <textarea rows={4} required value={details} onChange={(e) => setDetails(e.target.value)} placeholder="Please detail approximate monthly volume, locations of sales (nexus states), or gateway verification issues..." className="w-full glass-input resize-none" />
              </div>

              <TurnstileWidget onVerify={setTurnstileToken} />

              <button type="submit" disabled={status === 'loading'} className="w-full py-4 bg-gradient-to-r from-cyber-accent to-cyber-glow text-white font-bold rounded-xl text-xs hover:brightness-110 shadow-glow disabled:opacity-50 transition-all flex items-center justify-center space-x-2">
                <span>Submit Merchant Audit request</span>
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

export default EcommerceCompliance;
