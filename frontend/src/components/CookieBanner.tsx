import React, { useState, useEffect } from 'react';

export const CookieBanner: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isCustomizing, setIsCustomizing] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true,
    analytics: true,
    marketing: false,
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookie_consent');
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAcceptAll = () => {
    localStorage.setItem('cookie_consent', 'all');
    setIsVisible(false);
  };

  const handleRejectOptional = () => {
    localStorage.setItem('cookie_consent', 'essential');
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    localStorage.setItem('cookie_consent', JSON.stringify(preferences));
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div
      className="fixed bottom-6 left-6 right-6 md:left-6 md:right-auto md:max-w-md z-50 p-6 rounded-2xl glass-panel shadow-2xl transition-all duration-300 space-y-4 border"
      style={{
        backgroundColor: 'var(--bg-secondary)',
        borderColor: 'var(--color-border)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.3)',
      }}
    >
      <div className="flex items-center space-x-2">
        <span className="text-xl">🍪</span>
        <h3
          className="text-sm font-bold tracking-tight uppercase"
          style={{ color: 'var(--text-primary)' }}
        >
          We Value Your Privacy
        </h3>
      </div>

      {!isCustomizing ? (
        <>
          <p
            className="text-xs leading-relaxed"
            style={{ color: 'var(--text-secondary)' }}
          >
            We use cookies to enhance your browsing experience and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              onClick={handleAcceptAll}
              className="py-2.5 px-4 rounded-xl text-[10px] uppercase tracking-wider font-extrabold cursor-pointer transition-all duration-200"
              style={{
                backgroundColor: 'var(--brand-primary)',
                color: 'var(--black)',
              }}
            >
              Accept All
            </button>
            <button
              onClick={() => setIsCustomizing(true)}
              className="py-2.5 px-4 rounded-xl text-[10px] uppercase tracking-wider font-extrabold cursor-pointer transition-all duration-200 border"
              style={{
                borderColor: 'var(--color-border)',
                color: 'var(--text-primary)',
                backgroundColor: 'transparent',
              }}
            >
              Customize
            </button>
            <button
              onClick={handleRejectOptional}
              className="py-2.5 px-4 rounded-xl text-[10px] uppercase tracking-wider font-extrabold cursor-pointer transition-all duration-200 border"
              style={{
                borderColor: 'var(--color-border)',
                color: 'var(--text-secondary)',
                backgroundColor: 'transparent',
              }}
            >
              Reject Optional
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="space-y-3 py-2">
            {/* Essential */}
            <div className="flex items-start justify-between">
              <div>
                <label
                  className="text-xs font-bold uppercase tracking-wider block"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Essential Cookies
                </label>
                <span
                  className="text-[10px] block"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Required for core site functions, security, and session state.
                </span>
              </div>
              <input
                type="checkbox"
                disabled
                checked
                className="mt-1 accent-lime"
              />
            </div>

            {/* Analytics */}
            <div className="flex items-start justify-between">
              <div>
                <label
                  className="text-xs font-bold uppercase tracking-wider block"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Analytics Cookies
                </label>
                <span
                  className="text-[10px] block"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Allows us to analyze site traffic and optimize user experience.
                </span>
              </div>
              <input
                type="checkbox"
                checked={preferences.analytics}
                onChange={(e) =>
                  setPreferences({ ...preferences, analytics: e.target.checked })
                }
                className="mt-1 cursor-pointer"
                style={{ accentColor: 'var(--brand-primary)' }}
              />
            </div>

            {/* Marketing */}
            <div className="flex items-start justify-between">
              <div>
                <label
                  className="text-xs font-bold uppercase tracking-wider block"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Marketing Cookies
                </label>
                <span
                  className="text-[10px] block"
                  style={{ color: 'var(--text-muted)' }}
                >
                  Used to deliver personalized offers and security advisories.
                </span>
              </div>
              <input
                type="checkbox"
                checked={preferences.marketing}
                onChange={(e) =>
                  setPreferences({ ...preferences, marketing: e.target.checked })
                }
                className="mt-1 cursor-pointer"
                style={{ accentColor: 'var(--brand-primary)' }}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSavePreferences}
              className="py-2.5 px-4 flex-grow rounded-xl text-[10px] uppercase tracking-wider font-extrabold cursor-pointer transition-all duration-200"
              style={{
                backgroundColor: 'var(--brand-primary)',
                color: 'var(--black)',
              }}
            >
              Save Preferences
            </button>
            <button
              onClick={() => setIsCustomizing(false)}
              className="py-2.5 px-4 rounded-xl text-[10px] uppercase tracking-wider font-extrabold cursor-pointer transition-all duration-200 border"
              style={{
                borderColor: 'var(--color-border)',
                color: 'var(--text-primary)',
                backgroundColor: 'transparent',
              }}
            >
              Back
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CookieBanner;
