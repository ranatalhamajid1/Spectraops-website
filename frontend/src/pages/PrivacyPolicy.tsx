import React from 'react';

export const PrivacyPolicy: React.FC = () => {
  return (
    <div className="relative pt-20 pb-24 cyber-grid min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10 mt-12 text-slate-700 dark:text-slate-300">
        <h1 className="text-3xl font-heading font-extrabold text-slate-900 dark:text-white">Privacy Policy</h1>
        <p className="text-xs text-slate-500">Last updated: June 3, 2026</p>

        <div className="space-y-6 text-sm leading-relaxed">
          <p>
            At SpectraOps, we prioritize the protection and confidentiality of client and visitor data. This Privacy Policy details the types of information we collect, how it is processed, and your rights concerning your personal information.
          </p>

          <h2 className="text-xl font-heading font-bold text-slate-900 dark:text-white mt-8">1. Information We Collect</h2>
          <p>
            We collect information provided directly by you when filling out lead forms, requesting security audits, registering domain names, or applying for jobs. This may include:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Name, email address, phone number, and corporate details.</li>
            <li>Billing addresses, payment credentials, and tax identification numbers.</li>
            <li>System configurations, API structures, and asset metadata uploaded to the Tools Lab.</li>
          </ul>

          <h2 className="text-xl font-heading font-bold text-slate-900 dark:text-white mt-8">2. Use of Information</h2>
          <p>
            Your details are processed to execute contract obligations, secure corporate configurations, process payments via Stripe, register LLC/LTD corporate entities, and send cybersecurity advisories. We do not sell or trade your data to third parties.
          </p>

          <h2 className="text-xl font-heading font-bold text-slate-900 dark:text-white mt-8">3. Security Controls</h2>
          <p>
            All connection requests are secured using TLS encryption. Customer databases are protected with access control firewalls, role-based controls, and standard industry safeguards to prevent data disclosure or theft.
          </p>

          <h2 className="text-xl font-heading font-bold text-slate-900 dark:text-white mt-8">4. Contact Us</h2>
          <p>
            If you have questions regarding this policy or our data security implementations, contact our privacy team at <span className="text-cyber-accent">privacy@spectraops.pk</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
