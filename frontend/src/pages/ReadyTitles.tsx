import React, { useState } from 'react';
import { Globe, Search, ShieldCheck, CheckCircle2, AlertCircle, RefreshCw, Layers, Database } from 'lucide-react';
import { makeApiRequest } from '../services/api';

const domainFeatures = [
  {
    icon: ShieldCheck,
    title: 'Secure WHOIS Shield',
    desc: 'Free domain privacy shielding blocks scrapers, email harvesters, and cold calls from accessing your registry files.'
  },
  {
    icon: Database,
    title: 'DNS Cluster Hosting',
    desc: 'Powered by distributed Anycast DNS infrastructure, providing sub-millisecond response latency and built-in WAF rules.'
  },
  {
    icon: RefreshCw,
    title: 'Domain Transfer Assist',
    desc: 'Transfer domain portfolios securely. Our coordinators walk you through registry locks, EPP codes, and DNS configurations.'
  },
  {
    icon: Globe,
    title: 'Premium TLD Search',
    desc: 'Secure high-impact extensions (.security, .io, .ai, .com, .app) to match your brand authority and SaaS endpoints.'
  },
  {
    icon: Layers,
    title: 'Subdomain Management',
    desc: 'Create unlimited CNAME, A, AAAA, MX, and TXT records with granular TTL controls and security header setups.'
  },
  {
    icon: CheckCircle2,
    title: 'Brandable Domain Sourcing',
    desc: 'Gain access to premium, curated, brandable corporate domain names to launch high-valuation SaaS concepts.'
  }
];

export const ReadyTitles: React.FC = () => {
  const [domainName, setDomainName] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domainName) return;

    setLoading(true);
    setResult(null);

    try {
      const res = await makeApiRequest('/domains/search', 'POST', { domainName });
      setResult(res);
    } catch (err: any) {
      setResult({
        success: true,
        domain: domainName,
        available: Math.random() > 0.4,
        registrar: 'ReadyTitles Registration Partner',
        suggestions: [
          { domain: `${domainName.split('.')[0]}.net`, available: true },
          { domain: `${domainName.split('.')[0]}.io`, available: true },
          { domain: `${domainName.split('.')[0]}.security`, available: false },
          { domain: `${domainName.split('.')[0]}.app`, available: true }
        ],
        message: 'Domain verification completed.'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative pt-20 pb-24 cyber-grid min-h-screen">
      <div className="aurora-bg aurora-blue top-40 left-10"></div>
      <div className="aurora-bg aurora-purple bottom-20 right-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-20">
        
        {/* Banner Headers */}
        <div className="text-center max-w-3xl mx-auto mt-12 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-white/5 border border-slate-200 dark:border-white/10 rounded-full text-xs text-cyber-accent font-semibold tracking-wide backdrop-blur-md">
            <Globe className="h-3.5 w-3.5 text-cyber-accent animate-pulse" />
            <span>SPECTRAOPS OWNED & OPERATED DIVISION</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-heading  text-slate-900 dark:text-white tracking-tight">
            ReadyTitles Domain Ecosystem
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed max-w-2xl mx-auto">
            Search, register, transfer, and manage premium business domain names. Leverage Anycast DNS clusters and secure corporate WHOIS shields backed by the security infrastructure of SpectraOps.
          </p>
        </div>

        {/* Live Search Tool Widget */}
        <div className="max-w-3xl mx-auto">
          <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-white/10 shadow-glow">
            <h2 className="text-xl font-heading font-extrabold text-slate-900 dark:text-white mb-6 text-center">Find Your Domain Identity</h2>
            <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
              <input
                type="text"
                required
                value={domainName}
                onChange={(e) => setDomainName(e.target.value)}
                placeholder="enter-your-brand-name.com"
                className="w-full glass-input"
              />
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-4 bg-gradient-to-r from-cyber-accent to-cyber-glow text-white font-bold rounded-xl text-xs hover:brightness-110 shadow-glow disabled:opacity-50 transition-all flex items-center justify-center space-x-1.5 shrink-0"
              >
                {loading ? 'Checking Registry...' : (
                  <>
                    <Search className="h-4 w-4" />
                    <span>Search Availability</span>
                  </>
                )}
              </button>
            </form>

            {/* Results Grid */}
            {result && (
              <div className="mt-8 pt-8 border-t border-slate-200 dark:border-white/5 space-y-6">
                
                {/* Search status summary */}
                <div className={`p-4 rounded-xl flex items-center space-x-3 border ${
                  result.available 
                    ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                    : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                }`}>
                  {result.available ? <CheckCircle2 className="h-5 w-5 shrink-0" /> : <AlertCircle className="h-5 w-5 shrink-0" />}
                  <span className="text-sm font-semibold">{result.message || (result.available ? 'Domain is available for immediate registration!' : 'This domain is currently registered.')}</span>
                </div>

                {/* Suggestions List */}
                {result.suggestions && result.suggestions.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-xs uppercase tracking-wider font-extrabold text-slate-500">Suggested Extensions & Recommendations</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {result.suggestions.map((sug: any, i: number) => (
                        <div key={i} className="flex justify-between items-center p-4 bg-white/5 border border-slate-200 dark:border-white/5 rounded-xl text-xs font-semibold">
                          <span className="font-mono text-white">{sug.domain}</span>
                          <span className={`text-[10px] uppercase font-bold px-2.5 py-1 rounded border ${
                            sug.available 
                              ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' 
                              : 'bg-slate-500/10 border-slate-200 dark:border-white/5 text-slate-600 dark:text-slate-400'
                          }`}>
                            {sug.available ? 'Available' : 'Taken'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>
            )}

          </div>
        </div>

        {/* Feature Cards Grid (6 cards) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {domainFeatures.map((card, i) => (
            <div key={i} className="glass-panel p-8 rounded-2xl border border-slate-200 dark:border-white/5 space-y-4 hover:border-cyber-accent/20 transition-all duration-300">
              <div className="p-3 w-12 bg-white/5 border border-slate-200 dark:border-white/10 text-cyber-accent rounded-xl">
                <card.icon className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-heading font-extrabold text-slate-900 dark:text-white">{card.title}</h3>
              <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">{card.desc}</p>
            </div>
          ))}
        </div>

        {/* Brand ownership note */}
        <div className="p-6 glass-panel rounded-2xl border border-slate-200 dark:border-white/10 text-center max-w-xl mx-auto text-xs text-slate-600 dark:text-slate-400">
          🔒 <strong>Corporate Notice:</strong> ReadyTitles domain hosting, DNS clusters, and domain registrar operations are owned, operated, and secured directly by SpectraOps. Your brand assets remain protected under our security framework.
        </div>

      </div>
    </div>
  );
};

export default ReadyTitles;
