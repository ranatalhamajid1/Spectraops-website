import React, { useEffect, useRef } from 'react';

declare global {
  interface Window {
    turnstile?: {
      render: (
        container: string | HTMLElement,
        options: {
          sitekey: string;
          callback: (token: string) => void;
          'error-callback'?: () => void;
          'expired-callback'?: () => void;
          theme?: 'light' | 'dark' | 'auto';
        }
      ) => string;
      reset: (widgetId?: string) => void;
    };
  }
}

interface TurnstileWidgetProps {
  onVerify: (token: string | null) => void;
  theme?: 'light' | 'dark' | 'auto';
}

export const TurnstileWidget: React.FC<TurnstileWidgetProps> = ({
  onVerify,
  theme = 'auto',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    let active = true;

    const initializeTurnstile = () => {
      if (!active) return;

      if (window.turnstile && containerRef.current) {
        if (widgetIdRef.current) {
          try {
            window.turnstile.reset(widgetIdRef.current);
          } catch (e) {
            console.error('Error resetting Turnstile:', e);
          }
        }

        const siteKey = (import.meta as any).env?.VITE_TURNSTILE_SITEKEY || '0x4AAAAAAADfvFiAFXfuF1gcZ';

        try {
          const id = window.turnstile.render(containerRef.current, {
            sitekey: siteKey,
            theme,
            callback: (token: string) => {
              if (active) onVerify(token);
            },
            'error-callback': () => {
              if (active) onVerify(null);
            },
            'expired-callback': () => {
              if (active) onVerify(null);
            },
          });
          widgetIdRef.current = id;
        } catch (err) {
          console.error('Error rendering Cloudflare Turnstile:', err);
        }
      } else {
        setTimeout(initializeTurnstile, 500);
      }
    };

    initializeTurnstile();

    return () => {
      active = false;
    };
  }, [onVerify, theme]);

  return (
    <div className="flex justify-center my-3">
      <div ref={containerRef} className="cf-turnstile"></div>
    </div>
  );
};

export default TurnstileWidget;
