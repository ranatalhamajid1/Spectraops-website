import React, { useState } from 'react';
import { Cpu, Shield, AlertTriangle, CheckCircle2, ArrowRight, AlertCircle, ShieldAlert, FileText, Code } from 'lucide-react';
import { makeApiRequest } from '../services/api';
import { TurnstileWidget } from '../components/TurnstileWidget';

const aiServices = [
  {
    icon: Shield,
    title: 'LLM Security Audits',
    color: 'cyan-400',
    description: 'Systematic review of your Large Language Model configurations, API scopes, context window access parameters, and corporate database access channels.',
    features: ['Context window overflow testing', 'Sensitive data retrieval audits', 'API authorization validations']
  },
  {
    icon: ShieldAlert,
    title: 'AI Red Teaming',
    color: 'rose-500',
    description: 'Simulate advanced adversary tactics targeting artificial intelligence models. Perform automated jailbreaking, logic bypasses, and behavioral policy overrides.',
    features: ['Automated model jailbreak testing', 'Toxicity threshold testing', 'Safety policy compliance override tests']
  },
  {
    icon: AlertTriangle,
    title: 'Prompt Injection Testing',
    color: 'amber-500',
    description: 'Validate model endpoints against direct (user-side prompt attacks) and indirect (data-source, website, or document embedded payloads) injections.',
    features: ['Indirect injection payload audits', 'System instruction leakage defense checks', 'Retrieval-Augmented Generation (RAG) security checks']
  },
  {
    icon: FileText,
    title: 'AI Compliance Reviews',
    color: 'teal-500',
    description: 'Verify system readiness against emerging global legislative standards including the EU AI Act, ISO 42001, and NIST AI Risk Management Framework.',
    features: ['ISO/IEC 42001 compliance reviews', 'EU AI Act risk categorization checks', 'NIST AI RMF control assessments']
  },
  {
    icon: Code,
    title: 'AI Threat Modeling',
    color: 'purple-500',
    description: 'Map internal data pipelines, model configurations, weights storage, training repositories, and agent orchestrators to surface structural exposures.',
    features: ['Data pipeline ingestion auditing', 'Agent tool validation checking', 'Training source poisoning reviews']
  }
];

export const AiSecurity: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [modelType, setModelType] = useState('openai');
  const [description, setDescription] = useState('');
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
        service_type: 'ai_security',
        message: `Model Architecture: ${modelType}. Overview: ${description}`,
        source: 'ai_security_page',
        turnstileToken,
      });

      if (res.success) {
        setStatus('success');
        setMessage('Your AI Security audit request was submitted successfully. Our AI safety engineers will reach out shortly.');
        setName('');
        setEmail('');
        setDescription('');
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
      <div className="aurora-bg aurora-purple top-40 left-10"></div>
      <div className="aurora-bg aurora-blue bottom-40 right-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-24">
        
        {/* Hero */}
        <div className="text-center max-w-3xl mx-auto mt-12 space-y-5">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-white/5 border border-slate-200 dark:border-white/10 rounded-full text-xs text-cyber-accent font-semibold tracking-wide backdrop-blur-md">
            <Cpu className="h-3.5 w-3.5 text-cyber-accent" />
            <span>AI SAFETY & LLM SECURITY LABS</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold font-heading  text-slate-900 dark:text-white tracking-tight leading-tight">
            Securing the Future of<br />
            <span className="bg-gradient-to-r from-cyber-accent to-purple-500 bg-clip-text text-transparent">
              Generative AI Systems
            </span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed max-w-2xl mx-auto">
            Audit LLM orchestrations, stress-test AI agent execution boundaries, defend RAG pipelines against indirect prompt injections, and ensure global AI compliance.
          </p>
        </div>

        {/* Services Grid (5 services) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {aiServices.map((svc, i) => (
            <div key={i} className="glass-panel rounded-2xl p-8 border border-slate-200 dark:border-white/5 space-y-5 hover:border-cyber-accent/25 transition-all duration-300 group flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="p-3 bg-white/5 border border-slate-200 dark:border-white/10 text-cyber-accent rounded-xl group-hover:bg-cyber-accent group-hover:text-white transition-all duration-300">
                    <svc.icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-base font-heading font-extrabold text-slate-900 dark:text-white">{svc.title}</h3>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">{svc.description}</p>
                <ul className="space-y-2 pt-2">
                  {svc.features.map((feat) => (
                    <li key={feat} className="flex items-center text-[11px] text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="h-3.5 w-3.5 text-cyber-accent mr-2 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* AI Consultation Form */}
        <div className="max-w-2xl mx-auto">
          <div className="glass-panel p-10 rounded-3xl border border-slate-200 dark:border-white/10 space-y-8 relative overflow-hidden">
            <div className="aurora-bg aurora-purple -bottom-40 -left-40"></div>
            
            <div className="relative z-10 space-y-6">
              <div className="text-center space-y-2">
                <h2 className="text-2xl font-heading font-extrabold text-slate-900 dark:text-white">Initialize AI Security Audit</h2>
                <p className="text-slate-600 dark:text-slate-400 text-xs">Outline your model deployment and vector pipelines to request a safety plan.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-600 dark:text-slate-400">Full Name</label>
                    <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" className="w-full glass-input" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-600 dark:text-slate-400">Corporate Email</label>
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@enterprise.com" className="w-full glass-input" />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-600 dark:text-slate-400">Model Deployment Architecture</label>
                  <select value={modelType} onChange={(e) => setModelType(e.target.value)} className="w-full glass-input bg-cyber-bg border border-slate-200 dark:border-white/10 rounded-xl">
                    <option value="openai">Public APIs (OpenAI GPT-4, Claude 3.5)</option>
                    <option value="local_models">Self-hosted Open weights (Llama 3, Mistral, Qwen)</option>
                    <option value="rag_pipeline">RAG / Vector Database Pipelines (Pinecone, Milvus, Chroma)</option>
                    <option value="agents">Agentic framework orchestrator (LangChain, AutoGen, CrewAI)</option>
                    <option value="custom_pipeline">Proprietary neural architectures & pipelines</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-600 dark:text-slate-400">Model Pipelines & Tool Capabilities Overview</label>
                  <textarea rows={4} required value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Specify if LLM runs tools, accesses internal databases, connects to the web, or receives user-uploaded files..." className="w-full glass-input resize-none" />
                </div>

                <TurnstileWidget onVerify={setTurnstileToken} />

                <button type="submit" disabled={status === 'loading'} className="w-full py-4 bg-gradient-to-r from-purple-500 to-cyber-accent text-white font-bold rounded-xl text-xs hover:brightness-110 shadow-glow disabled:opacity-50 transition-all flex items-center justify-center space-x-2">
                  <span>Submit Audit Request</span>
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

export default AiSecurity;
