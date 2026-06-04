import React from 'react';

export const CookiePolicy: React.FC = () => {
  return (
    <div className="relative pt-20 pb-24 cyber-grid min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-10 mt-12 text-slate-700 dark:text-slate-300">
        <h1 className="text-3xl font-heading font-extrabold text-slate-900 dark:text-white">Cookie Policy</h1>
        <p className="text-xs text-slate-500">Last updated: June 3, 2026</p>

        <div className="space-y-6 text-sm leading-relaxed">
          <p>
            SpectraOps uses cookies and similar session storage technologies to maintain secure user state, evaluate threat telemetry, and optimize user experience.
          </p>

          <h2 className="text-xl font-heading font-bold text-slate-900 dark:text-white mt-8">1. What are Cookies?</h2>
          <p>
            Cookies are minor configuration files stored on your local browser memory when visiting web platforms. They support site navigation, login integrity, and basic analytics.
          </p>

          <h2 className="text-xl font-heading font-bold text-slate-900 dark:text-white mt-8">2. How We Use Them</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li><strong>Strictly Necessary:</strong> Required for secure login, multi-factor verification state, and session tokens.</li>
            <li><strong>Performance & Analytics:</strong> Tracking threat counter views and web app telemetry.</li>
            <li><strong>Preferences:</strong> Saving user theme choices and workspace settings.</li>
          </ul>

          <h2 className="text-xl font-heading font-bold text-slate-900 dark:text-white mt-8">3. Controlling Your Settings</h2>
          <p>
            You can disable or customize cookie handling from your browser settings. Note that disabling necessary cookies may prevent administrative dashboard login and tools lab features from executing properly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicy;
