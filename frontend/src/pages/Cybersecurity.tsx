import React, { useState } from 'react';
import { Shield, Target, Eye, BookOpen, CheckCircle2, ArrowRight, AlertCircle, Fingerprint, Search, Zap, Activity, FileCheck, ShieldAlert, HeartPulse, Server } from 'lucide-react';
import { makeApiRequest } from '../services/api';
import { TurnstileWidget } from '../components/TurnstileWidget';

const cybersecurityServices = [
  {
    icon: Target,
    title: 'Penetration Testing',
    color: 'cyan-400',
    description: 'Offensive assessments targeting network, cloud, API, and system targets to discover vulnerability pathways.',
    features: ['External/Internal Network assessments', 'Cloud infrastructure configuration testing', 'API endpoint logic validations']
  },
  {
    icon: Eye,
    title: 'Vulnerability Assessment',
    color: 'blue-500',
    description: 'Automated and manual audits mapping software, port configuration, and registry dependencies.',
    features: ['Infrastructure scanning logs', 'Asset discovery indexing', 'CVE threat level mapping']
  },
  {
    icon: ShieldAlert,
    title: 'VAPT Integration',
    color: 'emerald-500',
    description: 'Continuous Vulnerability Assessment & Penetration Testing workflows mapping persistent software releases.',
    features: ['DevSecOps automation triggers', 'CI/CD pipeline scanning gates', 'Remediation advisory validation']
  },
  {
    icon: Zap,
    title: 'Red Teaming',
    color: 'rose-500',
    description: 'Adversary emulation targeting human elements, physical access, and detection responses.',
    features: ['Social engineering simulations', 'Assumed breach host scenarios', 'Active Directory domain compromises']
  },
  {
    icon: Shield,
    title: 'Blue Teaming',
    color: 'indigo-500',
    description: 'Defense hardening configurations, firewall reviews, and server log security tuning.',
    features: ['Endpoint security controls hardening', 'Internal firewall configuration reviews', 'Host access telemetry monitoring']
  },
  {
    icon: Activity,
    title: 'SOC Consulting',
    color: 'purple-500',
    description: 'Build, audit, or scale 24/7 Security Operations Centers with dedicated analysts.',
    features: ['SOC design & playbook drafting', 'Alert prioritization logic tuning', 'Incident management framework setup']
  },
  {
    icon: HeartPulse,
    title: 'Incident Response',
    color: 'rose-600',
    description: 'Rapid containment, malware analysis, and system recovery guidelines after breaches.',
    features: ['Under 4-hour response SLAs', 'Post-breach data recovery plans', 'Containment & source elimination']
  },
  {
    icon: Search,
    title: 'Threat Hunting',
    color: 'cyan-500',
    description: 'Proactive searching of networks and endpoints to catch hidden advanced threats.',
    features: ['IOC & IOA compromise indicators search', 'Memory forensic investigations', 'Traffic behavior path anomalies mapping']
  },
  {
    icon: Server,
    title: 'SIEM Deployment',
    color: 'amber-500',
    description: 'Configure Splunk, Wazuh, or Elastic Security clusters with high-performance parsers.',
    features: ['Cross-log source parsing configurations', 'Custom alert routing dashboards', 'Uptime & storage pipeline optimization']
  },
  {
    icon: FileCheck,
    title: 'Compliance Audits',
    color: 'teal-500',
    description: 'Verify readiness and compliance against international regulatory standards.',
    features: ['ISO 27001 readiness reviews', 'PCI-DSS v4.0 audits checklists', 'SOC 2 Trust Services evaluations']
  },
  {
    icon: BookOpen,
    title: 'Security Awareness',
    color: 'amber-600',
    description: 'Interactive employee courses and simulated phishing exercises to prevent social engineering.',
    features: ['Customized phishing simulations template', 'Executive threat briefing courses', 'Progress testing feedback logs']
  },
  {
    icon: Fingerprint,
    title: 'Digital Forensics',
    color: 'purple-600',
    description: 'Investigate evidence trails, system breaches, file tampering, and compromised assets.',
    features: ['Chain-of-custody data acquisitions', 'Registry and event log forensics', 'Court-admissible security reporting']
  }
];

export const Cybersecurity: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [company, setCompany] = useState('');
  const [service, setService] = useState('vapt');
  const [details, setDetails] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const handleConsultation = async (e: React.FormEvent) => {
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
        service_type: `cyber_${service}`,
        message: details,
        source: 'cybersecurity_page',
        turnstileToken,
      });

      if (res.success) {
        setStatus('success');
        setMessage('Consultation request submitted. Our security architects will contact you within 24 hours.');
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
      <div className="aurora-bg aurora-blue top-40 left-0"></div>
      <div className="aurora-bg aurora-purple top-[600px] right-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-24">

        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mt-12 space-y-5">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-white/5 border border-slate-200 dark:border-white/10 rounded-full text-xs text-cyber-accent font-semibold tracking-wide backdrop-blur-md">
            <Shield className="h-3.5 w-3.5 text-cyber-accent animate-pulse" />
            <span>ENTERPRISE OFFENSIVE & DEFENSIVE SUITE</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading  text-slate-900 dark:text-white tracking-tight leading-tight">
            Offensive Security.<br />
            <span className="bg-gradient-to-r from-cyber-accent to-cyber-glow bg-clip-text text-transparent">
              Defensive Excellence.
            </span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed max-w-2xl mx-auto">
            From zero-day mapping and penetration testing to threat investigations and SOC architectures, SpectraOps safeguards global digital assets.
          </p>
        </div>

        {/* Services Grid (12 services) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cybersecurityServices.map((svc, idx) => (
            <div key={idx} className="glass-panel rounded-2xl p-8 border border-slate-200 dark:border-white/5 space-y-5 hover:border-cyber-accent/30 transition-all duration-300 group flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 rounded-xl bg-white/5 text-cyber-accent group-hover:bg-cyber-accent group-hover:text-white transition-all duration-350">
                    <svc.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-heading font-extrabold text-slate-900 dark:text-white">{svc.title}</h3>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">{svc.description}</p>
                <ul className="space-y-2.5 pt-2">
                  {svc.features.map((f, fIdx) => (
                    <li key={fIdx} className="flex items-start text-[11px] text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="h-3.5 w-3.5 text-cyber-accent mr-2 shrink-0 mt-0.5" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Stats metrics */}
        <div className="glass-panel rounded-2xl p-8 border border-slate-200 dark:border-white/5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '1,400+', label: 'Engagements Audited' },
              { value: '18', label: 'Countries Serviced' },
              { value: '99.8%', label: 'Incident Deflection' },
              { value: '<2 Hours', label: 'Critical SLAs' },
            ].map((stat, i) => (
              <div key={i} className="space-y-1">
                <div className="text-3xl font-extrabold font-heading  text-slate-900 dark:text-white">{stat.value}</div>
                <div className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Consultation Form */}
        <div className="max-w-2xl mx-auto">
          <div className="glass-panel p-10 rounded-3xl border border-slate-200 dark:border-white/10 space-y-8">
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-heading font-extrabold text-slate-900 dark:text-white">Schedule Security Assessment</h2>
              <p className="text-slate-600 dark:text-slate-400 text-xs">Outline your configurations to schedule a call with our senior architects.</p>
            </div>

            <form onSubmit={handleConsultation} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-600 dark:text-slate-400">Full Name</label>
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Smith" className="w-full glass-input" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-600 dark:text-slate-400">Corporate Email</label>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@company.com" className="w-full glass-input" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-600 dark:text-slate-400">Company Name</label>
                  <input type="text" value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Acme Corp" className="w-full glass-input" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-600 dark:text-slate-400">Primary Engagement</label>
                  <select value={service} onChange={(e) => setService(e.target.value)} className="w-full glass-input bg-cyber-bg border border-slate-200 dark:border-white/10 rounded-xl">
                    <option value="vapt">Penetration Testing (VAPT)</option>
                    <option value="red_teaming">Red Team adversary emulation</option>
                    <option value="blue_teaming">Defense hardening</option>
                    <option value="soc">SOC consultation</option>
                    <option value="incident">Incident response advisory</option>
                    <option value="compliance">Compliance Audit</option>
                    <option value="other">Other Operations</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-600 dark:text-slate-400">Engagement Specifications</label>
                <textarea rows={4} required value={details} onChange={(e) => setDetails(e.target.value)} placeholder="Describe endpoints, networks, compliance goals, or critical indicators..." className="w-full glass-input resize-none" />
              </div>

              <TurnstileWidget onVerify={setTurnstileToken} />

              <button type="submit" disabled={status === 'loading'} className="w-full py-4 bg-gradient-to-r from-cyber-accent to-cyber-glow text-white font-bold rounded-xl text-xs hover:brightness-110 shadow-glow disabled:opacity-50 transition-all flex items-center justify-center space-x-2">
                <ArrowRight className="h-4 w-4" />
                <span>{status === 'loading' ? 'Submitting request...' : 'Submit Engagement Brief'}</span>
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

export default Cybersecurity;
