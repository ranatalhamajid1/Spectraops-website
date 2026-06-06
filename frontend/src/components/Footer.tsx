import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Send, CheckCircle2, AlertCircle } from 'lucide-react';
import { makeApiRequest } from '../services/api';

const LinkedinIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const InstagramIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);


export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus('loading');
    setMessage('');
    try {
      const res = await makeApiRequest('/notifications/subscribe', 'POST', { email });
      if (res.success) {
        setStatus('success');
        setMessage(res.message || 'Subscribed successfully!');
        setEmail('');
      } else { throw new Error(res.error || 'Failed'); }
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message || 'An error occurred.');
    }
  };

  return (
    <footer className="relative pt-12 pb-10 overflow-hidden z-10 border-t"
            style={{ backgroundColor: 'var(--bg-secondary)', borderTopColor: 'var(--color-border)' }}>

      {/* Marquee Banner */}
      <div className="w-full overflow-hidden border-b py-6 mb-16 animate-pulse-glow" style={{ borderColor: 'var(--color-border)', backgroundColor: 'var(--bg-primary)' }}>
        <div className="marquee-track">
          {[...Array(6)].map((_, i) => (
            <span key={i} className="marquee-text">
              LET'S WORK <span className="accent">TOGETHER</span> ✦ SPECTRAOPS ✦&nbsp;
            </span>
          ))}
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 relative">
        
        {/* Top section — Large CTA text */}
        <div className="mb-20">
          <h2 style={{
            fontSize: 'clamp(2.5rem, 4vw, 4rem)',
            fontWeight: 800,
            letterSpacing: '-0.04em',
            color: 'var(--text-primary)',
            lineHeight: 1,
            marginBottom: '2rem',
          }}>
            Ready to secure<br />your organization?
          </h2>
          <a href="/#contact" className="btn-lime">
            Start a Conversation
          </a>
        </div>

        {/* Divider */}
        <div className="section-divider mb-16" />

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">

          {/* Column 1 — Brand */}
          <div>
            <div className="flex items-center space-x-2.5 mb-6">
              <div className="w-7 h-7 rounded-lg overflow-hidden flex items-center justify-center">
                <img src="/logo.png" alt="SpectraOps" className="w-full h-full object-contain" />
              </div>
              <span style={{ color: 'var(--text-primary)', fontSize: '0.8125rem', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                SpectraOps
              </span>
            </div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', lineHeight: 1.7, maxWidth: '280px' }}>
              Enterprise cybersecurity, business formation, compliance, and development under one ecosystem.
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', lineHeight: 1.7, maxWidth: '280px', marginTop: '0.75rem' }}>
              <strong>Address:</strong> Multan / Islamabad, Pakistan
            </p>
            <div className="flex gap-4 mt-4">
              <a 
                href="https://www.linkedin.com/company/spectraops-official/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="transition-colors duration-200 hover:text-black dark:hover:text-white" 
                style={{ color: 'var(--text-muted)' }}
                title="LinkedIn"
              >
                <LinkedinIcon className="h-5 w-5" />
              </a>
              <a 
                href="https://www.instagram.com/officialspectraops" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="transition-colors duration-200 hover:text-black dark:hover:text-white" 
                style={{ color: 'var(--text-muted)' }}
                title="Instagram"
              >
                <InstagramIcon className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Column 2 — Divisions */}
          <div>
            <h4 style={{ color: 'var(--text-primary)', fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
              Divisions
            </h4>
            <ul className="space-y-3">
              {[
                { to: '/cybersecurity', label: 'Cybersecurity' },
                { to: '/business-formation', label: 'Business Setup' },
                { to: '/readytitles', label: 'ReadyTitles' },
                { to: '/ai-security', label: 'AI Security' },
                { to: '/web-development', label: 'Development' },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm transition-colors duration-200 hover:opacity-100"
                        style={{ color: 'var(--text-muted)', opacity: 0.8 }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Resources */}
          <div>
            <h4 style={{ color: 'var(--text-primary)', fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
              Resources
            </h4>
            <ul className="space-y-3">
              {[
                { to: '/tools-lab', label: 'Tools Lab' },
                { to: '/blog', label: 'Insights' },
                { to: '/careers', label: 'Careers' },
                { to: '/case-studies', label: 'Case Studies' },
              ].map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="text-sm transition-colors duration-200 hover:opacity-100"
                        style={{ color: 'var(--text-muted)', opacity: 0.8 }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — Newsletter */}
          <div>
            <h4 style={{ color: 'var(--text-primary)', fontSize: '0.6875rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1.5rem' }}>
              Newsletter
            </h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8125rem', lineHeight: 1.7, marginBottom: '1rem' }}>
              Threat intelligence alerts and compliance updates.
            </p>
            <form onSubmit={handleSubscribe} className="relative">
              <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                     placeholder="email@example.com" className="w-full glass-input pr-12" />
              <button type="submit" disabled={status === 'loading'}
                      className="absolute right-1.5 top-1.5 p-2 rounded-lg disabled:opacity-50 transition-all cursor-pointer"
                      style={{ backgroundColor: 'var(--brand-primary)', color: '#050505' }}
                      aria-label="Subscribe">
                <Send className="h-4 w-4" />
              </button>
            </form>
            {status === 'success' && (
              <div className="flex items-center gap-1.5 text-xs mt-3" style={{ color: '#22C55E' }}>
                <CheckCircle2 className="h-3.5 w-3.5" /><span>{message}</span>
              </div>
            )}
            {status === 'error' && (
              <div className="flex items-center gap-1.5 text-xs mt-3" style={{ color: '#EF4444' }}>
                <AlertCircle className="h-3.5 w-3.5" /><span>{message}</span>
              </div>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center border-t gap-4"
             style={{ borderTopColor: 'var(--color-border)' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.6875rem' }}>
            © {new Date().getFullYear()} SpectraOps Ltd. All rights reserved.
          </p>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.6875rem' }}>
            Website designed and managed by{' '}
            <a 
              href="https://talhamajid.me" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="font-semibold transition-opacity duration-200 hover:opacity-75" 
              style={{ color: 'var(--color-accent)' }}
            >
              Rana Talha Majid
            </a>
          </p>

          <div className="flex gap-6 mt-4 md:mt-0">
            {[
              { to: '/privacy', label: 'Privacy' },
              { to: '/terms', label: 'Terms' },
              { to: '/cookie-policy', label: 'Cookies' },
            ].map((l) => (
              <Link key={l.to} to={l.to} className="transition-colors duration-200"
                    style={{ color: 'var(--text-muted)', fontSize: '0.6875rem' }}>
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
