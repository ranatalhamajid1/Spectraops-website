import React from 'react';
import { Target, CheckCircle } from 'lucide-react';

const cases = [
  {
    title: 'Mitigating Zero-Day Risks for an Enterprise FinTech Platform',
    category: 'Cybersecurity',
    statValue: '100%',
    statLabel: 'Vulnerabilities Mitigated',
    client: 'Apex Capital Inc.',
    challenge: 'The client needed immediate PCI-DSS alignment and a thorough penetration test of their custom multi-tenant billing APIs.',
    solution: 'Our Red Team performed a 2-week assumed-breach assessment, identifying 4 high-severity vulnerabilities in token management before public release.',
    results: [
      'Successful zero-downtime hotfixes deployed',
      'PCI-DSS compliance certified without issues',
      'SOC 2 Type II audit readiness completed',
    ],
  },
  {
    title: 'Automated Tax Compliance Setup for 120+ International Sellers',
    category: 'Compliance',
    statValue: '$340k+',
    statLabel: 'Estimated Annual Tax Savings',
    client: 'GlobalCommerce LLC',
    challenge: 'Managing sales tax nexus and federal reporting requirements across multiple state jurisdictions for non-US owners.',
    solution: 'Engineered an automated business formation and tax intelligence pipeline that syncs marketplace sales data with state filing regulations.',
    results: [
      '120+ LLC and EIN structures created',
      'Automated sales tax nexus mapping',
      'No state audit failures in the first 12 months',
    ],
  },
  {
    title: 'Horizontally Scaling a Logistics Platform to 5M Daily Requests',
    category: 'Web Development',
    statValue: '2.4x',
    statLabel: 'Performance Speedup',
    client: 'SwiftLogistics Corp',
    challenge: 'Legacy Ruby backend was failing under surge peak hours with response times climbing over 8 seconds.',
    solution: 'Redesigned the core microservices architecture to Node.js / Go, integrated Redis cache clusters, and set up Cloudflare CDN load balancing.',
    results: [
      'Average load time decreased from 8s to 120ms',
      '99.99% system uptime during black friday spikes',
      'Reduced server infrastructure cost by 45%',
    ],
  },
];

export const CaseStudies: React.FC = () => {
  return (
    <div className="relative pt-20 pb-24 cyber-grid min-h-screen">
      <div className="aurora-bg aurora-blue top-40 right-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mt-12 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-white/5 border border-slate-200 dark:border-white/10 rounded-full text-xs text-cyber-accent font-semibold tracking-wide">
            <Target className="h-3.5 w-3.5" />
            <span>SPECTRAOPS CASE STUDIES</span>
          </div>
          <h1 className="text-4xl font-extrabold font-heading  text-slate-900 dark:text-white tracking-tight">
            Proven Results for<br />
            <span className="bg-gradient-to-r from-cyber-accent to-cyber-glow bg-clip-text text-transparent">
              Global Scale Enterprises
            </span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-xl mx-auto">
            Review detailed case reports of our cybersecurity, custom engineering, and tax compliance engagements.
          </p>
        </div>

        {/* Case Studies List */}
        <div className="space-y-12">
          {cases.map((cs) => (
            <div key={cs.title} className="glass-panel p-8 md:p-12 rounded-3xl border border-slate-200 dark:border-white/5 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center hover:border-slate-200 dark:border-white/10 transition-all">
              {/* Highlight Metric */}
              <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left space-y-3">
                <span className="text-[11px] uppercase font-bold text-cyber-accent px-3 py-1 bg-cyber-accent/10 rounded-full">
                  {cs.category}
                </span>
                <div className="text-5xl md:text-6xl font-extrabold font-heading  text-slate-900 dark:text-white bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
                  {cs.statValue}
                </div>
                <div className="text-xs uppercase tracking-wider font-semibold text-slate-500">
                  {cs.statLabel}
                </div>
              </div>

              {/* Study Description */}
              <div className="lg:col-span-8 space-y-6">
                <div className="space-y-2">
                  <span className="text-xs text-slate-500 font-semibold">{cs.client}</span>
                  <h3 className="text-xl md:text-2xl font-heading font-extrabold text-slate-900 dark:text-white">
                    {cs.title}
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs text-slate-600 dark:text-slate-400">
                  <div className="space-y-1">
                    <span className="font-bold text-white uppercase tracking-wider text-[10px]">The Challenge</span>
                    <p className="leading-relaxed">{cs.challenge}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="font-bold text-white uppercase tracking-wider text-[10px]">Our Solution</span>
                    <p className="leading-relaxed">{cs.solution}</p>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <span className="font-bold text-white uppercase tracking-wider text-[10px]">Key Outcomes</span>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {cs.results.map((res, index) => (
                      <li key={index} className="flex items-center text-xs text-slate-700 dark:text-slate-300">
                        <CheckCircle className="h-3.5 w-3.5 text-cyber-accent mr-2 shrink-0" />
                        <span>{res}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CaseStudies;
