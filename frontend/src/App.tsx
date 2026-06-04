import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import { Home } from './pages/Home';
import { Cybersecurity } from './pages/Cybersecurity';
import { Compliance } from './pages/Compliance';
import { WebDevelopment } from './pages/WebDevelopment';
import { AiSecurity } from './pages/AiSecurity';
import { ReadyTitles } from './pages/ReadyTitles';
import { BusinessFormation } from './pages/BusinessFormation';
import { ToolsLab } from './pages/ToolsLab';
import { Blog } from './pages/Blog';
import { Careers } from './pages/Careers';
import { CaseStudies } from './pages/CaseStudies';
import { Team } from './pages/Team';
import { AdminDashboard } from './pages/AdminDashboard';
import { PrivacyPolicy } from './pages/PrivacyPolicy';
import { TermsOfService } from './pages/TermsOfService';
import { CookiePolicy } from './pages/CookiePolicy';
import { Mainframe } from './pages/Mainframe';
import { TaxCompliance } from './pages/TaxCompliance';
import { EcommerceCompliance } from './pages/EcommerceCompliance';
import { CosmicBackground } from './components/CosmicBackground';
import { ScrollToTop } from './components/ScrollToTop';

interface LayoutProps {
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  children: React.ReactNode;
}

const MainLayout: React.FC<LayoutProps> = ({ theme, setTheme, children }) => {
  const location = useLocation();
  const isNoNavbar = location.pathname === '/mainframe';

  return (
    <div className="min-h-screen text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-300 relative">
      <CosmicBackground />
      {!isNoNavbar && <Navbar theme={theme} setTheme={setTheme} />}
      <main className="flex-grow relative z-10">
        {children}
      </main>
      {!isNoNavbar && <Footer />}
    </div>
  );
};

const App: React.FC = () => {
  const [theme, setTheme] = useState<'dark' | 'light'>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'dark' | 'light' | null;
    const initialTheme = savedTheme || 'light';
    setTheme(initialTheme);
    document.documentElement.className = initialTheme;
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <MainLayout theme={theme} setTheme={setTheme}>
        <Routes>
          {/* SpectraOps home page is now served at the root / */}
          <Route path="/" element={<Home />} />
          <Route path="/spectraops" element={<Home />} />
          
          {/* Mainframe creative agency landing page is kept at /mainframe */}
          <Route path="/mainframe" element={<Mainframe />} />
          
          <Route path="/cybersecurity" element={<Cybersecurity />} />
          <Route path="/compliance" element={<Compliance />} />
          <Route path="/web-development" element={<WebDevelopment />} />
          <Route path="/ai-security" element={<AiSecurity />} />
          <Route path="/readytitles" element={<ReadyTitles />} />
          <Route path="/business-formation" element={<BusinessFormation />} />
          <Route path="/tax-compliance" element={<TaxCompliance />} />
          <Route path="/ecommerce-compliance" element={<EcommerceCompliance />} />
          <Route path="/tools-lab" element={<ToolsLab />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/careers" element={<Careers />} />
          <Route path="/case-studies" element={<CaseStudies />} />
          <Route path="/team" element={<Team />} />
          
          {/* Admin Console Mapping */}
          <Route path="/admin-login" element={<AdminDashboard />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin" element={<Navigate to="/admin-login" replace />} />

          {/* Legal / Policy docs */}
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />

          {/* Catch-all redirection */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </MainLayout>
    </Router>
  );
};

export default App;
