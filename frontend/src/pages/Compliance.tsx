import React from 'react';
import { Link } from 'react-router-dom';
import { FileCheck, ShieldCheck, CreditCard, CheckCircle2, ArrowRight } from 'lucide-react';

const taxItems = [
  'U.S. Federal & State Tax Filings',
  'Annual Report & Registry Renewals',
  'UK VAT Registration & Filing',
  'FBAR & FATCA Compliance',
  'EIN / ITIN Tax ID Processing',
  'Bookkeeping & Financial Statements',
];

const ecommerceItems = [
  'Payment Gateway Compliance Reviews',
  'PCI-DSS Readiness Assessments',
  'Terms of Service & Privacy Policy Drafting',
  'Cookie Consent & GDPR Compliance',
  'Sales Tax Nexus Analysis',
  'Marketplace Seller Compliance (Amazon, Shopify)',
];

export const Compliance: React.FC = () => {
  return (
    <div className="relative pt-20 pb-24 cyber-grid min-h-screen">
      <div className="aurora-bg aurora-blue top-40 right-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-20">

        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mt-12 space-y-5">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/5 border border-slate-200 dark:border-white/10 rounded-full text-xs text-cyber-accent font-semibold tracking-wide">
            <FileCheck className="h-3.5 w-3.5" />
            <span>CORPORATE COMPLIANCE</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-heading  text-slate-900 dark:text-white tracking-tight">
            Tax Compliance &<br />
            <span className="bg-gradient-to-r from-cyber-accent to-cyber-glow bg-clip-text text-transparent">
              E-Commerce Regulations
            </span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed max-w-2xl mx-auto">
            Stay compliant with U.S. federal, state, and international tax regulations. We help businesses navigate complex regulatory frameworks so you can focus on growth.
          </p>
        </div>

        {/* Two-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

          {/* Tax Compliance */}
          <div className="glass-panel p-8 rounded-2xl border border-slate-200 dark:border-white/5 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-cyber-accent/10">
                <ShieldCheck className="h-5 w-5 text-cyber-accent" />
              </div>
              <h2 className="text-xl font-heading font-bold text-slate-900 dark:text-white">Tax Compliance</h2>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              End-to-end corporate tax filing and compliance services for U.S. LLCs, UK LTDs, and international entities operating across jurisdictions.
            </p>
            <ul className="space-y-3">
              {taxItems.map((item) => (
                <li key={item} className="flex items-center text-sm text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="h-4 w-4 text-cyber-accent mr-3 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Link to="/business-formation" className="inline-flex items-center space-x-2 text-sm text-cyber-accent font-semibold hover:underline">
              <span>Start LLC/LTD Filing</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* E-Commerce Compliance */}
          <div className="glass-panel p-8 rounded-2xl border border-slate-200 dark:border-white/5 space-y-6">
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-xl bg-cyber-glow/10">
                <CreditCard className="h-5 w-5 text-cyber-glow" />
              </div>
              <h2 className="text-xl font-heading font-bold text-slate-900 dark:text-white">E-Commerce Compliance</h2>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              Ensure your online business meets payment processing, data privacy, and marketplace seller requirements worldwide.
            </p>
            <ul className="space-y-3">
              {ecommerceItems.map((item) => (
                <li key={item} className="flex items-center text-sm text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="h-4 w-4 text-cyber-glow mr-3 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <Link to="/cybersecurity" className="inline-flex items-center space-x-2 text-sm text-cyber-glow font-semibold hover:underline">
              <span>PCI-DSS Readiness Check</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Payment Gateways */}
        <div className="glass-panel p-8 rounded-2xl border border-slate-200 dark:border-white/5 space-y-6">
          <h2 className="text-xl font-heading font-bold text-slate-900 dark:text-white text-center">Supported Payment Gateways</h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm text-center max-w-xl mx-auto">
            We help businesses set up and maintain compliance for all major payment processing platforms.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4">
            {['Stripe', 'PayPal', 'Wise', 'Payoneer', 'Revolut', 'Square', 'Airwallex'].map((gw) => (
              <div key={gw} className="text-center py-4 px-3 bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl hover:bg-white/10 transition-all">
                <span className="text-sm font-semibold text-white">{gw}</span>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-heading font-bold text-slate-900 dark:text-white">Need Help With Compliance?</h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-lg mx-auto">
            Our compliance specialists can guide you through tax filings, regulatory audits, and payment gateway setup.
          </p>
          <Link to="/business-formation" className="inline-flex items-center space-x-2 px-8 py-3.5 bg-gradient-to-r from-cyber-accent to-cyber-glow text-white font-bold rounded-xl text-sm hover:brightness-110 shadow-glow transition-all">
            <span>Get Started</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

      </div>
    </div>
  );
};

export default Compliance;
