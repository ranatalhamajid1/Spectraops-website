import React, { useState, useEffect } from 'react';
import { MapPin, Send, CheckCircle2, AlertCircle, Users } from 'lucide-react';
import { makeApiRequest } from '../services/api';

interface Job {
  id: number;
  title: string;
  department: string;
  location: string;
  type: string;
  description: string;
  requirements: string[];
}

export const Careers: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [selectedDept, setSelectedDept] = useState('All');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [portfolio, setPortfolio] = useState('');
  const [resumeUrl, setResumeUrl] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await makeApiRequest('/careers/jobs', 'GET');
        if (res.success && Array.isArray(res.data)) {
          setJobs(res.data);
        } else {
          // Preseed static job listings across requested departments
          setJobs([
            {
              id: 1,
              title: 'Senior Penetration Tester',
              department: 'Cybersecurity',
              location: 'Remote / London Office',
              type: 'Full-Time',
              description: 'Lead offensive engagements, infrastructure VAPT, and red team adversary simulations for financial and SaaS organizations.',
              requirements: [
                'OSCP, OSEP, OSCE, or equivalent certifications',
                '3+ years of professional penetration testing experience',
                'Strong coding capabilities in Python, Bash, or Go',
                'Deep understanding of Active Directory and cloud security frameworks'
              ]
            },
            {
              id: 2,
              title: 'Lead Fullstack SaaS Engineer',
              department: 'Development',
              location: 'Remote (US/EU)',
              type: 'Full-Time',
              description: 'Build, maintain, and optimize secure SaaS web dashboards, automated workflows, payment gateways, and custom backend modules.',
              requirements: [
                'Proficiency in React.js, TypeScript, and Node.js (Express)',
                'Solid grasp of SQL (SQLite/PostgreSQL) and database optimization',
                'Experience configuring AWS, Docker, and GitHub CI/CD pipelines',
                'Deep understanding of web security architectures (CORS, CSP, OWASP Top 10)'
              ]
            },
            {
              id: 3,
              title: 'Enterprise Account Executive',
              department: 'Sales',
              location: 'Islamabad Office / Hybrid',
              type: 'Full-Time',
              description: 'Own enterprise sales pipeline for security audits and business formation services. Secure contracts with scaling international organizations.',
              requirements: [
                '2+ years of B2B SaaS or technical agency sales experience',
                'Excellent written and spoken English communication skills',
                'Familiarity with cybersecurity terminology and corporate compliance structures',
                'Self-motivated pipeline builder comfortable with outbound sales targets'
              ]
            },
            {
              id: 4,
              title: 'Digital Marketing Strategist',
              department: 'Marketing',
              location: 'Remote',
              type: 'Full-Time',
              description: 'Formulate search engine optimization strategies, pay-per-click setups, social proof campaigns, and outbound lead generation pathways.',
              requirements: [
                'Proven track record scaling organic search keywords (SEO)',
                'Experience running high-converting ads on Google, LinkedIn, and Meta',
                'Strong copywriting and visual design direction capabilities',
                'Analytical mindset tracking conversion metrics and traffic dashboards'
              ]
            },
            {
              id: 5,
              title: 'Compliance Operations Associate',
              department: 'Operations',
              location: 'Islamabad Office',
              type: 'Full-Time',
              description: 'Verify, format, and audit state paperwork submissions, EIN registrations, BOI reports, and bank onboarding portfolios.',
              requirements: [
                'Knowledge of U.S. corporate structures (LLCs, LTDs) and filing procedures',
                'Attention to details preventing processing issues on government registries',
                'Experience working with corporate banking providers (Wise, Payoneer)',
                'Capable of multi-tasking across active customer orders pipelines'
              ]
            }
          ]);
        }
      } catch (err) {
        console.error('Failed to load job listings', err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  const handleApply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedJob) return;

    setStatus('loading');
    setMessage('');

    try {
      const res = await makeApiRequest('/careers/apply', 'POST', {
        job_id: selectedJob.id,
        name,
        email,
        portfolio_url: portfolio,
        resume_path: resumeUrl // aligned to backend column name
      });

      if (res.success) {
        setStatus('success');
        setMessage('Application submitted successfully. Our HR division will review your profile.');
        setName('');
        setEmail('');
        setPortfolio('');
        setResumeUrl('');
      } else {
        throw new Error(res.error || 'Submission failed');
      }
    } catch (err: unknown) {
      setStatus('error');
      setMessage(err instanceof Error ? err.message : 'An error occurred.');
    }
  };

  const depts = ['All', 'Cybersecurity', 'Development', 'Sales', 'Marketing', 'Operations'];

  const filteredJobs = jobs.filter(job => 
    selectedDept === 'All' || job.department === selectedDept
  );

  return (
    <div className="relative pt-20 pb-24 cyber-grid min-h-screen">
      <div className="aurora-bg aurora-blue top-40 left-0"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mt-12 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-white/5 border border-slate-200 dark:border-white/10 rounded-full text-xs text-cyber-accent font-semibold tracking-wide backdrop-blur-md">
            <Users className="h-3.5 w-3.5 text-cyber-accent animate-pulse" />
            <span>JOIN THE SPECTRAOPS TEAM</span>
          </div>
          <h1 className="text-4xl font-extrabold font-heading  text-slate-900 dark:text-white tracking-tight">
            Build the Future of<br />
            <span className="bg-gradient-to-r from-cyber-accent to-cyber-glow bg-clip-text text-transparent">
              Global Cybersecurity & Compliance
            </span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-xl mx-auto">
            Work with elite software engineers, security architects, and corporate compliance coordinators to build a global ecosystem.
          </p>
        </div>

        {/* Department Filters */}
        <div className="flex flex-wrap gap-2 justify-center max-w-2xl mx-auto">
          {depts.map((d) => (
            <button
              key={d}
              onClick={() => {
                setSelectedDept(d);
                setSelectedJob(null);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                selectedDept === d
                  ? 'bg-cyber-accent text-white border-cyber-accent shadow-glow'
                  : 'bg-white/5 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/5 hover:text-white'
              }`}
            >
              {d}
            </button>
          ))}
        </div>

        {/* Main Content split view */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Jobs List */}
          <div className={`space-y-4 ${selectedJob ? 'lg:col-span-6' : 'lg:col-span-12 max-w-4xl mx-auto w-full'}`}>
            <h2 className="text-lg font-heading font-extrabold text-slate-900 dark:text-white mb-6">Open Openings</h2>
            {loading ? (
              <div className="text-center py-10 text-slate-600 dark:text-slate-400 text-sm font-semibold">Updating job logs...</div>
            ) : filteredJobs.length === 0 ? (
              <div className="text-center py-10 text-slate-500 text-sm">No open positions found in this department.</div>
            ) : (
              filteredJobs.map((job) => (
                <div
                  key={job.id}
                  onClick={() => {
                    setSelectedJob(job);
                    setStatus('idle');
                    setMessage('');
                  }}
                  className={`glass-panel p-6 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    selectedJob?.id === job.id ? 'border-cyber-accent bg-white/10' : 'border-slate-200 dark:border-white/5 hover:border-slate-200 dark:border-white/10'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className="text-[9px] uppercase font-extrabold text-cyber-accent px-2 py-0.5 bg-cyber-accent/10 rounded-md">
                        {job.department}
                      </span>
                      <span className="text-[9px] uppercase font-extrabold text-slate-600 dark:text-slate-400 px-2 py-0.5 bg-white/5 rounded-md">
                        {job.type}
                      </span>
                    </div>
                    <h3 className="text-base font-heading font-extrabold text-slate-900 dark:text-white">{job.title}</h3>
                    <div className="flex items-center space-x-4 text-xs text-slate-500">
                      <span className="flex items-center"><MapPin className="h-3.5 w-3.5 mr-1" /> {job.location}</span>
                    </div>
                  </div>
                  <button className="px-4 py-2.5 bg-white/5 hover:bg-cyber-accent text-white font-bold rounded-xl text-xs transition-all shrink-0">
                    Apply Now
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Job Application Detail Form */}
          {selectedJob && (
            <div className="lg:col-span-6 glass-panel p-8 rounded-3xl border border-slate-200 dark:border-white/10 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-heading font-extrabold text-slate-900 dark:text-white">Apply for {selectedJob.title}</h2>
                <button
                  onClick={() => setSelectedJob(null)}
                  className="text-xs text-slate-500 hover:text-white"
                >
                  Close Details
                </button>
              </div>

              <div className="space-y-4 text-xs text-slate-700 dark:text-slate-300">
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{selectedJob.description}</p>
                <div className="space-y-2">
                  <h4 className="font-extrabold text-white uppercase tracking-wider text-[10px]">Requirements:</h4>
                  <ul className="list-disc pl-4 space-y-1">
                    {selectedJob.requirements.map((req, idx) => (
                      <li key={idx} className="text-slate-700 dark:text-slate-300">{req}</li>
                    ))}
                  </ul>
                </div>
              </div>

              <hr className="border-slate-200 dark:border-white/5" />

              <form onSubmit={handleApply} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-600 dark:text-slate-400">Full Name</label>
                    <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Jane Doe" className="w-full glass-input py-2 text-xs" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-600 dark:text-slate-400">Email Address</label>
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="jane@email.com" className="w-full glass-input py-2 text-xs" />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-600 dark:text-slate-400">Resume Link / Cloud PDF URL</label>
                  <input type="url" required value={resumeUrl} onChange={(e) => setResumeUrl(e.target.value)} placeholder="https://drive.google.com/.../resume.pdf" className="w-full glass-input py-2 text-xs" />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] uppercase tracking-wider font-extrabold text-slate-600 dark:text-slate-400">Portfolio / GitHub / LinkedIn URL</label>
                  <input type="url" value={portfolio} onChange={(e) => setPortfolio(e.target.value)} placeholder="https://github.com/username" className="w-full glass-input py-2 text-xs" />
                </div>

                <button type="submit" disabled={status === 'loading'} className="w-full py-3.5 bg-gradient-to-r from-cyber-accent to-cyber-glow text-white font-bold rounded-xl text-xs hover:brightness-110 shadow-glow disabled:opacity-50 transition-all flex items-center justify-center space-x-2">
                  <Send className="h-3.5 w-3.5" />
                  <span>{status === 'loading' ? 'Submitting Application...' : 'Send Profile Brief'}</span>
                </button>

                {status === 'success' && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs flex items-center space-x-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>{message}</span>
                  </div>
                )}
                {status === 'error' && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{message}</span>
                  </div>
                )}
              </form>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default Careers;
