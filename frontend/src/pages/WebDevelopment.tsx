import React, { useState } from 'react';
import { Code2, Layout, Server, Cpu, CheckCircle2, ArrowRight, AlertCircle, ShoppingBag, Eye } from 'lucide-react';
import { makeApiRequest } from '../services/api';

const devServices = [
  {
    icon: Layout,
    title: 'Business Websites',
    description: 'High-converting, bespoke corporate portals designed for modern marketing presence.',
    techs: ['Vite.js', 'React.js', 'Framer Motion', 'Vanilla CSS']
  },
  {
    icon: Code2,
    title: 'Web Applications',
    description: 'Bespoke, robust single-page or server-side applications built for performance.',
    techs: ['Next.js', 'TypeScript', 'GraphQL', 'Redux / Zustand']
  },
  {
    icon: Server,
    title: 'SaaS Platforms',
    description: 'Complete multi-tenant SaaS structures with billing, session logging, and user controls.',
    techs: ['Microservices', 'Node.js', 'PostgreSQL', 'Stripe Billing']
  },
  {
    icon: Cpu,
    title: 'MERN Stack Development',
    description: 'Fullstack engineering leveraging high-speed document stores and express servers.',
    techs: ['MongoDB', 'Express.js', 'React.js', 'Node.js']
  },
  {
    icon: Layout,
    title: 'WordPress Engineering',
    description: 'Custom headless or corporate WordPress structures configured with security patches.',
    techs: ['Headless CMS', 'PHP / MySQL', 'Custom Plugins', 'WAF Hardening']
  },
  {
    icon: ShoppingBag,
    title: 'Shopify & E-Commerce',
    description: 'Verify and build custom storefronts, payment routing, and cart configurations.',
    techs: ['Liquid template', 'Shopify Hydrogen', 'API Cart Integration']
  },
  {
    icon: Eye,
    title: 'Mobile Applications',
    description: 'Secure, clean native and cross-platform applications published to Play/App Stores.',
    techs: ['React Native', 'Flutter', 'Swift / Kotlin', 'Mobile APIs']
  },
  {
    icon: Server,
    title: 'Custom Dashboards',
    description: 'Interactive admin consoles mapping telemetry metrics, CRM, and analytics logs.',
    techs: ['Chart.js', 'WebSockets', 'Real-time Feeds', 'RBAC Controls']
  },
  {
    icon: Cpu,
    title: 'AI Integrations',
    description: 'Connect generative models, custom embeddings, vector stores, and agent pipelines.',
    techs: ['OpenAI / Claude APIs', 'Pinecone Vector DB', 'LangChain / Agents']
  }
];

export const WebDevelopment: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [projectType, setProjectType] = useState('fullstack');
  const [budget, setBudget] = useState('5k-10k');
  const [details, setDetails] = useState('');
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
        service_type: `web_dev_${projectType}`,
        message: `Budget: ${budget}. Details: ${details}`,
        source: 'web_dev_page',
      });

      if (res.success) {
        setStatus('success');
        setMessage('Project brief submitted successfully. Our engineering coordinators will review it and follow up within 24 hours.');
        setName('');
        setEmail('');
        setDetails('');
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
      <div className="aurora-bg aurora-blue top-40 right-0"></div>
      <div className="aurora-bg aurora-purple top-[600px] left-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-24">
        
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mt-12 space-y-5">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-white/5 border border-slate-200 dark:border-white/10 rounded-full text-xs text-cyber-accent font-semibold tracking-wide backdrop-blur-md">
            <Code2 className="h-3.5 w-3.5 text-cyber-accent" />
            <span>SPECTRAOPS SOFTWARE LABS</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading  text-slate-900 dark:text-white tracking-tight leading-tight">
            High-Performance<br />
            <span className="bg-gradient-to-r from-cyber-accent to-cyber-glow bg-clip-text text-transparent">
              Enterprise Engineering
            </span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed max-w-2xl mx-auto">
            From secure corporate landing portals and API configurations to full-scale SaaS multi-tenant platforms, we engineer clean code built to scale.
          </p>
        </div>

        {/* Services Grid (9 services) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {devServices.map((svc, i) => (
            <div key={i} className="glass-panel rounded-2xl p-8 border border-slate-200 dark:border-white/5 space-y-5 hover:border-cyber-accent/25 transition-all duration-300 group flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-white/5 border border-slate-200 dark:border-white/10 text-cyber-accent rounded-xl group-hover:bg-cyber-accent group-hover:text-white transition-all duration-300">
                    <svc.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-heading font-extrabold text-slate-900 dark:text-white">{svc.title}</h3>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">{svc.description}</p>
              </div>
              <div className="flex flex-wrap gap-1.5 pt-4">
                {svc.techs.map((tech) => (
                  <span key={tech} className="px-2 py-0.5 bg-white/5 border border-slate-200 dark:border-white/5 rounded text-[9px] font-bold text-slate-700 dark:text-slate-300">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Project Estimation Form */}
        <div className="max-w-2xl mx-auto">
          <div className="glass-panel p-10 rounded-3xl border border-slate-200 dark:border-white/10 space-y-8 relative overflow-hidden">
            <div className="aurora-bg aurora-purple -bottom-40 -left-40"></div>
            
            <div className="relative z-10 space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-heading font-extrabold text-slate-900 dark:text-white">Initialize Project Blueprint</h2>
                <p className="text-slate-600 dark:text-slate-400 text-xs">Tell us about your requirements to request a customized roadmap.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-600 dark:text-slate-400">Your Name</label>
                    <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" className="w-full glass-input" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-600 dark:text-slate-400">Email Address</label>
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@domain.com" className="w-full glass-input" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-600 dark:text-slate-400">Project Type</label>
                    <select value={projectType} onChange={(e) => setProjectType(e.target.value)} className="w-full glass-input bg-cyber-bg border border-slate-200 dark:border-white/10 rounded-xl">
                      <option value="landing">Business Website / Landing</option>
                      <option value="fullstack">MERN Web Application</option>
                      <option value="saas">SaaS Platform & API</option>
                      <option value="cms">WordPress / CMS build</option>
                      <option value="ecommerce">Shopify / E-Commerce</option>
                      <option value="mobile">Mobile Application</option>
                      <option value="ai">AI / LLM Integration</option>
                      <option value="dashboard">Custom Analytics Dashboard</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-600 dark:text-slate-400">Estimated Budget</label>
                    <select value={budget} onChange={(e) => setBudget(e.target.value)} className="w-full glass-input bg-cyber-bg border border-slate-200 dark:border-white/10 rounded-xl">
                      <option value="under-5k">Under $5,000</option>
                      <option value="5k-10k">$5,000 - $10,000</option>
                      <option value="10k-25k">$10,000 - $25,000</option>
                      <option value="25k-50k">$25,000 - $50,000</option>
                      <option value="50k-plus">$50,000+</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-600 dark:text-slate-400">Project Brief & Specifications</label>
                  <textarea rows={4} required value={details} onChange={(e) => setDetails(e.target.value)} placeholder="Describe key pages, core database models, custom API integrations, or delivery deadlines..." className="w-full glass-input resize-none" />
                </div>

                <button type="submit" disabled={status === 'loading'} className="w-full py-4 bg-gradient-to-r from-cyber-glow to-purple-500 text-white font-bold rounded-xl text-xs hover:brightness-110 shadow-glow disabled:opacity-50 transition-all flex items-center justify-center space-x-2">
                  <span>Send Project Brief</span>
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
    </div>
  );
};

export default WebDevelopment;
