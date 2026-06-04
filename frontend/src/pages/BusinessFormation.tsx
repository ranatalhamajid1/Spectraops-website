import React, { useState } from 'react';
import { Briefcase, CheckCircle2, Clock, AlertCircle, Landmark, CreditCard, ArrowRight } from 'lucide-react';
import { makeApiRequest } from '../services/api';

export const BusinessFormation: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [formationType, setFormationType] = useState('llc');
  const [selectedBanks, setSelectedBanks] = useState<string[]>([]);
  const [selectedGateways, setSelectedGateways] = useState<string[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleBankToggle = (bank: string) => {
    setSelectedBanks(prev =>
      prev.includes(bank) ? prev.filter(b => b !== bank) : [...prev, bank]
    );
  };

  const handleGatewayToggle = (gateway: string) => {
    setSelectedGateways(prev =>
      prev.includes(gateway) ? prev.filter(g => g !== gateway) : [...prev, gateway]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      const res = await makeApiRequest('/businessformation/checkout', 'POST', {
        name,
        email,
        phone,
        companyName,
        formationType,
        bankingOptions: selectedBanks,
        gatewayOptions: selectedGateways
      });

      if (res.success) {
        setStatus('success');
        setMessage(`Success! Order logged. Reference Order ID: #${res.orderId}. A corporate coordinator will contact you shortly to review state forms and banking details.`);
        setName('');
        setEmail('');
        setPhone('');
        setCompanyName('');
        setSelectedBanks([]);
        setSelectedGateways([]);
      } else {
        throw new Error(res.error || 'Checkout failed');
      }
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message || 'An error occurred during submission.');
    }
  };

  return (
    <div className="relative pt-20 pb-24 cyber-grid min-h-screen">
      <div className="aurora-bg aurora-blue top-40 left-0"></div>
      <div className="aurora-bg aurora-purple bottom-40 right-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-20">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mt-12 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-white/5 border border-slate-200 dark:border-white/10 rounded-full text-xs text-cyber-accent font-semibold tracking-wide backdrop-blur-md">
            <Briefcase className="h-3.5 w-3.5 text-cyber-accent" />
            <span>GLOBAL FORMATION & PAYMENT COMPLIANCE</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-heading  text-slate-900 dark:text-white tracking-tight">
            Corporate Incorporation & Banking Setup
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed max-w-2xl mx-auto">
            Establish official corporate entities in the United States or United Kingdom, structure global merchant banking accounts, and verify compliant Stripe and PayPal gateway setups from anywhere.
          </p>
        </div>

        {/* Formation Pricing Matrix */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* U.S. LLC Formation */}
          <div className="glass-panel p-8 rounded-2xl border border-slate-200 dark:border-white/5 space-y-6 flex flex-col justify-between hover:border-cyber-accent/25 transition-all duration-300">
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <span className="px-3 py-1 bg-cyber-accent/10 text-cyber-accent text-[10px] font-extrabold rounded-full uppercase tracking-widest border border-cyber-accent/20">U.S. LLC</span>
                <span className="text-slate-600 dark:text-slate-400 text-xs flex items-center"><Clock className="h-3.5 w-3.5 mr-1" /> 5-7 Business Days</span>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-extrabold font-heading  text-slate-900 dark:text-white">$199<span className="text-xs font-normal text-slate-500"> + state fee</span></div>
                <h3 className="text-lg font-heading font-extrabold text-slate-900 dark:text-white">U.S. LLC Incorporation</h3>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                Legally register your entity in top-tier states (Wyoming, Delaware, New Mexico) to process global invoices securely.
              </p>
              <ul className="space-y-3 text-[11px] text-slate-700 dark:text-slate-300">
                <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-cyber-accent mr-2 shrink-0" /> LLC Registration & Filings</li>
                <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-cyber-accent mr-2 shrink-0" /> EIN Tax ID Application</li>
                <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-cyber-accent mr-2 shrink-0" /> BOI Compliance Filing</li>
                <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-cyber-accent mr-2 shrink-0" /> Official State Documents</li>
                <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-cyber-accent mr-2 shrink-0" /> Operating Agreement drafting</li>
                <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-cyber-accent mr-2 shrink-0" /> Registered Agent & US Address</li>
                <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-cyber-accent mr-2 shrink-0" /> US Virtual Phone Number</li>
              </ul>
            </div>
            <button onClick={() => setFormationType('llc')} className={`w-full py-3.5 rounded-xl text-xs font-bold transition-all duration-200 ${
              formationType === 'llc' ? 'bg-cyber-accent text-white shadow-glow' : 'bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-white/10 text-white'
            }`}>
              {formationType === 'llc' ? 'Selected LLC' : 'Select LLC Package'}
            </button>
          </div>

          {/* UK LTD Formation */}
          <div className="glass-panel p-8 rounded-2xl border border-slate-200 dark:border-white/5 space-y-6 flex flex-col justify-between hover:border-cyber-accent/25 transition-all duration-300">
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <span className="px-3 py-1 bg-cyber-glow/10 text-cyber-glow text-[10px] font-extrabold rounded-full uppercase tracking-widest border border-cyber-glow/20">UK LTD</span>
                <span className="text-slate-600 dark:text-slate-400 text-xs flex items-center"><Clock className="h-3.5 w-3.5 mr-1" /> 24 Hours</span>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-extrabold font-heading  text-slate-900 dark:text-white">$99<span className="text-xs font-normal text-slate-500"> Flat Rate</span></div>
                <h3 className="text-lg font-heading font-extrabold text-slate-900 dark:text-white">UK Ltd Incorporation</h3>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                Rapid incorporation with UK Companies House. Complete corporate portfolio setup for international founders.
              </p>
              <ul className="space-y-3 text-[11px] text-slate-700 dark:text-slate-300">
                <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-cyber-glow mr-2 shrink-0" /> LTD Companies House Registration</li>
                <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-cyber-glow mr-2 shrink-0" /> Digital Articles of Association</li>
                <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-cyber-glow mr-2 shrink-0" /> Share Certificates copies</li>
                <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-cyber-glow mr-2 shrink-0" /> UK Registered Office Address</li>
                <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-cyber-glow mr-2 shrink-0" /> UK WebFiling Auth Code</li>
                <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-cyber-glow mr-2 shrink-0" /> LTD Compliance Support</li>
                <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-cyber-glow mr-2 shrink-0" /> Continuous Business Guidance</li>
              </ul>
            </div>
            <button onClick={() => setFormationType('ltd')} className={`w-full py-3.5 rounded-xl text-xs font-bold transition-all duration-200 ${
              formationType === 'ltd' ? 'bg-cyber-glow text-white shadow-glow' : 'bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-white/10 text-white'
            }`}>
              {formationType === 'ltd' ? 'Selected UK LTD' : 'Select LTD Package'}
            </button>
          </div>

          {/* IRS ITIN Application */}
          <div className="glass-panel p-8 rounded-2xl border border-slate-200 dark:border-white/5 space-y-6 flex flex-col justify-between relative overflow-hidden hover:border-cyber-accent/25 transition-all duration-300">
            <div className="absolute top-0 right-0 bg-cyber-accent text-cyber-bg font-extrabold text-[9px] uppercase tracking-widest py-1 px-4 rounded-bl-xl shadow-glow">
              Popular
            </div>
            <div className="space-y-6">
              <div className="flex justify-between items-start">
                <span className="px-3 py-1 bg-cyber-accent/10 text-cyber-accent text-[10px] font-extrabold rounded-full uppercase tracking-widest border border-cyber-accent/20">IRS ITIN</span>
                <span className="text-slate-600 dark:text-slate-400 text-xs flex items-center"><Clock className="h-3.5 w-3.5 mr-1" /> 4-6 Weeks</span>
              </div>
              <div className="space-y-2">
                <div className="text-4xl font-extrabold font-heading  text-slate-900 dark:text-white">$199<span className="text-xs font-normal text-slate-500"> Flat Rate</span></div>
                <h3 className="text-lg font-heading font-extrabold text-slate-900 dark:text-white">U.S. ITIN Application</h3>
              </div>
              <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
                Obtain a U.S. Individual Taxpayer Identification Number to legally sign and verify merchant agreements.
              </p>
              <ul className="space-y-3 text-[11px] text-slate-700 dark:text-slate-300">
                <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-cyber-accent mr-2 shrink-0" /> IRS Eligibility Review</li>
                <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-cyber-accent mr-2 shrink-0" /> CAA Document Preparation</li>
                <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-cyber-accent mr-2 shrink-0" /> Passport Verification Support</li>
                <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-cyber-accent mr-2 shrink-0" /> IRS W-7 Application Submission</li>
                <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-cyber-accent mr-2 shrink-0" /> Application Status Tracking</li>
                <li className="flex items-center"><CheckCircle2 className="h-4 w-4 text-cyber-accent mr-2 shrink-0" /> Dedicated ITIN Support Desk</li>
              </ul>
            </div>
            <button onClick={() => setFormationType('itin')} className={`w-full py-3.5 rounded-xl text-xs font-bold transition-all duration-200 ${
              formationType === 'itin' ? 'bg-gradient-to-r from-cyber-accent to-cyber-glow text-white shadow-glow' : 'bg-white/5 border border-slate-200 dark:border-white/10 hover:bg-white/10 text-white'
            }`}>
              {formationType === 'itin' ? 'Selected ITIN' : 'Select ITIN Package'}
            </button>
          </div>

        </div>

        {/* Banking and Gateways grids */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Business Banking partners */}
          <div className="glass-panel p-8 rounded-2xl border border-slate-200 dark:border-white/5 space-y-6">
            <h3 className="text-lg font-heading font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <Landmark className="h-5 w-5 text-cyber-accent" />
              <span>Business Banking Integrations</span>
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
              Select the banking partners you wish to integrate with your entity. We coordinate application briefs, verify state documentation requirements, and provide banking consultations.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {['Payoneer', 'Wise Business', 'Sunrate', 'Airwallex', 'Revolut Business'].map((bank) => {
                const isSelected = selectedBanks.includes(bank);
                return (
                  <button
                    key={bank}
                    type="button"
                    onClick={() => handleBankToggle(bank)}
                    className={`p-4 rounded-xl border text-xs font-bold transition-all text-left flex justify-between items-center ${
                      isSelected ? 'border-cyber-accent bg-cyber-accent/5 text-white' : 'border-slate-200 dark:border-white/5 bg-white/5 text-slate-600 dark:text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>{bank}</span>
                    <span className={`w-4 h-4 rounded-full border flex items-center justify-center text-[8px] ${
                      isSelected ? 'border-cyber-accent bg-cyber-accent text-cyber-bg' : 'border-slate-600'
                    }`}>
                      {isSelected ? '✓' : ''}
                    </span>
                  </button>
                );
              })}
            </div>
            <div className="p-4 bg-white/5 border border-slate-200 dark:border-white/5 rounded-xl text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
              💡 <strong>Note:</strong> Selected banking packages include a <strong>Business Banking Consultation</strong> with our corporate coordinators.
            </div>
          </div>

          {/* Payment Gateways */}
          <div className="glass-panel p-8 rounded-2xl border border-slate-200 dark:border-white/5 space-y-6">
            <h3 className="text-lg font-heading font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-cyber-glow" />
              <span>Payment Gateway Setup</span>
            </h3>
            <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
              Compliant checkout structures mapping your UK or U.S. credentials. Connect payment processing gateways seamlessly into your software platforms.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {['Stripe Business', 'PayPal Merchant', 'Square Account', 'Custom Gateway Consulting'].map((gateway) => {
                const isSelected = selectedGateways.includes(gateway);
                return (
                  <button
                    key={gateway}
                    type="button"
                    onClick={() => handleGatewayToggle(gateway)}
                    className={`p-4 rounded-xl border text-xs font-bold transition-all text-left flex justify-between items-center ${
                      isSelected ? 'border-cyber-glow bg-cyber-glow/5 text-white' : 'border-slate-200 dark:border-white/5 bg-white/5 text-slate-600 dark:text-slate-400 hover:text-white'
                    }`}
                  >
                    <span>{gateway}</span>
                    <span className={`w-4 h-4 rounded-full border flex items-center justify-center text-[8px] ${
                      isSelected ? 'border-cyber-glow bg-cyber-glow text-cyber-bg' : 'border-slate-600'
                    }`}>
                      {isSelected ? '✓' : ''}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

        {/* Corporate Package Wizard Checkout Form */}
        <div className="max-w-3xl mx-auto">
          <div className="glass-panel p-10 rounded-3xl border border-slate-200 dark:border-white/10 space-y-8 relative overflow-hidden">
            <div className="aurora-bg aurora-purple -bottom-40 -left-40"></div>
            
            <div className="relative z-10 space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-heading font-extrabold text-slate-900 dark:text-white">Initialize Incorporation Order</h2>
                <p className="text-slate-600 dark:text-slate-400 text-xs">Verify your corporate selections. A director will reach out within 24 hours.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-600 dark:text-slate-400">Full Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      className="w-full glass-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-600 dark:text-slate-400">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="john@example.com"
                      className="w-full glass-input"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-600 dark:text-slate-400">Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+92 300 1234567"
                      className="w-full glass-input"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-600 dark:text-slate-400">Proposed Company Name *</label>
                    <input
                      type="text"
                      required
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Acme Global LLC"
                      className="w-full glass-input"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-600 dark:text-slate-400">Selected Incorporation Package</label>
                  <div className="grid grid-cols-3 gap-4">
                    {['llc', 'ltd', 'itin'].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFormationType(type)}
                        className={`py-3.5 rounded-xl text-xs font-bold border uppercase transition-all ${
                          formationType === type
                            ? 'bg-cyber-accent/15 border-cyber-accent text-cyber-accent shadow-glow'
                            : 'bg-white/5 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-400 hover:text-white'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit Checkout */}
                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full py-4 bg-gradient-to-r from-cyber-accent to-cyber-glow text-white font-bold rounded-xl text-xs hover:brightness-110 shadow-glow disabled:opacity-50 transition-all flex items-center justify-center space-x-2"
                >
                  <span>{status === 'loading' ? 'Processing Checkout Brief...' : 'Confirm Incorporation Order'}</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                {/* Status messages */}
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
    </div>
  );
};

export default BusinessFormation;
