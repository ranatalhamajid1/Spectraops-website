import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, Sun, Moon, Settings } from 'lucide-react';
import { getToken } from '../services/api';

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


interface NavbarProps {
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ theme, setTheme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const isLoggedIn = !!getToken();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsOpen(false);
    document.body.style.overflow = '';
  }, [location]);

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.className = next;
    localStorage.setItem('theme', next);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    document.body.style.overflow = !isOpen ? 'hidden' : '';
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/cybersecurity', label: 'Security' },
    { path: '/business-formation', label: 'Formation' },
    { path: '/readytitles', label: 'Domains' },
    { path: '/ai-security', label: 'AI Security' },
    { path: '/web-development', label: 'Development' },
    { path: '/tools-lab', label: 'Tools' },
    { path: '/blog', label: 'Insights' },
    { path: '/careers', label: 'Careers' },
    { path: '/case-studies', label: 'Case Studies' },
    { path: '/team', label: 'Team' },
  ];

  return (
    <>
      {/* ── Minimal Top Bar ── */}
      <nav
        className="fixed top-0 left-0 w-full z-50 transition-all duration-500"
        style={{
          padding: scrolled ? '1rem 0' : '1.5rem 0',
          backgroundColor: scrolled
            ? theme === 'dark' ? 'rgba(5,5,5,0.8)' : 'rgba(250,250,250,0.8)'
            : 'transparent',
          backdropFilter: scrolled ? 'blur(20px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(20px)' : 'none',
        }}
      >
        <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-8 h-8 rounded-lg overflow-hidden flex items-center justify-center transition-transform group-hover:scale-105 duration-300">
              <img src="/logo.png" alt="SpectraOps" className="w-full h-full object-contain" />
            </div>
            <span
              className="text-base font-bold tracking-tight uppercase"
              style={{ color: 'var(--text-primary)', letterSpacing: '0.05em', fontSize: '0.8125rem' }}
            >
              SpectraOps
            </span>
          </Link>

          {/* Center indicator */}
          <div className="hidden md:flex items-center gap-2">
            <svg width="14" height="16" viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 9.00377C12.3179 10.5718 9.40009 13.6627 7.99633 17.5C6.59256 13.6627 3.68213 10.5718 0 9.00377C3.68213 7.42816 6.59256 4.33725 7.99633 0.5C9.40009 4.33725 12.3179 7.42816 16 9.00377Z" fill="#D4F700"/>
            </svg>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.6875rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              {location.pathname === '/' ? 'Welcome' : location.pathname.replace('/', '').replace(/-/g, ' ')}
            </span>
          </div>

          {/* Menu Button */}
          <button onClick={toggleMenu} className="menu-btn cursor-pointer">
            <span>{isOpen ? 'Close' : 'Menu'}</span>
            <div className="flex flex-col gap-[3px]">
              <div
                className="w-4 h-[2px] transition-all duration-300"
                style={{
                  backgroundColor: 'currentColor',
                  transform: isOpen ? 'rotate(45deg) translateY(2.5px)' : 'none',
                }}
              />
              <div
                className="w-4 h-[2px] transition-all duration-300"
                style={{
                  backgroundColor: 'currentColor',
                  transform: isOpen ? 'rotate(-45deg) translateY(-2.5px)' : 'none',
                }}
              />
            </div>
          </button>
        </div>
      </nav>

      {/* ── Full-Screen Menu Overlay ── */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-700 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{
          backgroundColor: theme === 'dark' ? '#050505' : '#FAFAFA',
        }}
      >
        <div className="h-full overflow-y-auto pt-28 pb-12">
          <div className="max-w-[1400px] mx-auto px-6 sm:px-8 lg:px-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

              {/* Left — Contact Info */}
              <div className="lg:col-span-3 order-2 lg:order-1">
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-[0.15em] mb-3"
                        style={{ color: 'var(--brand-primary)' }}>
                      Contact
                    </h3>
                    <div className="space-y-2">
                      <a href="mailto:spectraopsofficial@gmail.com" className="block text-sm transition-colors hover:text-white"
                         style={{ color: 'var(--text-muted)' }}>
                        spectraopsofficial@gmail.com
                      </a>
                      <p className="text-xs" style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                        <strong>Address:</strong> Multan / Islamabad, Pakistan
                      </p>
                      <div className="flex gap-4 pt-3">
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
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={toggleTheme}
                      className="p-2 rounded-full transition-all cursor-pointer"
                      style={{
                        border: '1px solid var(--color-border)',
                        color: 'var(--text-muted)',
                      }}
                      aria-label="Toggle theme"
                    >
                      {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                    </button>

                    {isLoggedIn ? (
                      <Link to="/admin/dashboard" className="btn-cinema btn-cinema-outline text-xs"
                            style={{ padding: '0.5rem 1rem' }}>
                        <Settings className="h-3.5 w-3.5" />
                        <span>Console</span>
                      </Link>
                    ) : (
                      <Link to="/admin-login" className="btn-cinema btn-cinema-primary text-xs"
                            style={{ padding: '0.5rem 1rem' }}>
                        <Shield className="h-3.5 w-3.5" />
                        <span>Login</span>
                      </Link>
                    )}
                  </div>
                </div>
              </div>

              {/* Right — Navigation Links */}
              <div className="lg:col-span-9 order-1 lg:order-2">
                <h2 className="text-[10px] font-bold uppercase tracking-[0.2em] mb-6"
                    style={{ color: 'var(--text-muted)' }}>
                  Navigation
                </h2>
                <div className="space-y-0">
                  {navLinks.map((link, i) => {
                    const isActive = location.pathname === link.path;
                    return (
                      <Link
                        key={link.path}
                        to={link.path}
                        className={`flex items-center justify-between py-4 border-b transition-all duration-500 group ${
                          isOpen ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                        }`}
                        style={{
                          borderBottomColor: 'var(--color-border)',
                          transitionDelay: `${i * 40 + 100}ms`,
                        }}
                      >
                        <div className="flex items-center gap-5">
                          <span className="text-xs font-mono" style={{ color: 'var(--text-muted)', width: '2rem' }}>
                            {String(i + 1).padStart(2, '0')}
                          </span>
                          <span
                            className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight transition-colors duration-300"
                            style={{
                              color: isActive ? 'var(--brand-primary)' : 'var(--text-primary)',
                              letterSpacing: '-0.03em',
                            }}
                          >
                            {link.label}
                          </span>
                        </div>
                        {/* Arrow */}
                        <svg
                          className="w-5 h-5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
                          style={{ color: 'var(--brand-primary)' }}
                          viewBox="0 0 65 62" fill="none" xmlns="http://www.w3.org/2000/svg"
                        >
                          <path d="M6 3.5H61V58.5" stroke="currentColor" strokeWidth="5" strokeMiterlimit="10"/>
                          <path d="M61 3.5L2.94 58.5" stroke="currentColor" strokeWidth="5" strokeMiterlimit="10"/>
                        </svg>
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
