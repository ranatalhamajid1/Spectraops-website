import React from 'react';

export const TermsOfService: React.FC = () => {
  return (
    <div className="relative pt-20 pb-24 cyber-grid min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10 mt-12 text-slate-700 dark:text-slate-300">
        <h1 className="text-3xl font-heading font-extrabold text-slate-900 dark:text-white">Terms of Service</h1>
        <p className="text-xs text-slate-500">Last updated: June 3, 2026</p>

        <div className="space-y-6 text-sm leading-relaxed">
          <p>
            Welcome to SpectraOps. By accessing our platform, utilizing the Security Tools Lab, or purchasing business formation services, you agree to comply with the following Terms of Service.
          </p>

          <h2 className="text-xl font-heading font-bold text-slate-900 dark:text-white mt-8">1. Acceptable Use of Security Tools</h2>
          <p>
            You agree to use our threat simulation and validation modules only on systems and network endpoints you own or have explicit, documented authorization to test. Unauthorized penetration testing or scanning is strictly prohibited and violates local and federal computer security laws.
          </p>

          <h2 className="text-xl font-heading font-bold text-slate-900 dark:text-white mt-8">2. Corporate Filings</h2>
          <p>
            Filing processes for LLC or LTD entities are executed using state and government agencies. We rely on the absolute accuracy of the registration details you supply. SpectraOps is not liable for structural delays or penalties due to incorrect information.
          </p>

          <h2 className="text-xl font-heading font-bold text-slate-900 dark:text-white mt-8">3. Intellectual Property</h2>
          <p>
            All custom components, custom threat algorithms, and structural design configurations belong to SpectraOps. You may not distribute, duplicate, or reverse engineer any part of our platform without prior written consent.
          </p>

          <h2 className="text-xl font-heading font-bold text-slate-900 dark:text-white mt-8">4. Liability Limitation</h2>
          <p>
            SpectraOps is not liable for data breaches, system downtime, state registration rejections, or business operations impacts resulting from compliance, code, or tools lab configurations.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;
