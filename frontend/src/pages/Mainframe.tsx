import React, { useState, useEffect, useRef } from 'react';

// Custom Typewriter Hook
const useTypewriter = (text: string, speed = 38, startDelay = 600) => {
  const [displayed, setDisplayed] = useState('');
  const [done, setDone] = useState(false);

  useEffect(() => {
    let index = 0;
    let intervalId: any;

    const delayId = setTimeout(() => {
      intervalId = setInterval(() => {
        if (index < text.length) {
          setDisplayed((prev) => prev + text.charAt(index));
          index++;
        } else {
          setDone(true);
          clearInterval(intervalId);
        }
      }, speed);
    }, startDelay);

    return () => {
      clearTimeout(delayId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [text, speed, startDelay]);

  return { displayed, done };
};

export const Mainframe: React.FC = () => {
  // Mobile Nav Overlay State
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Typewriter
  const { displayed, done } = useTypewriter(
    'Glad you stopped in. Good taste tends to find us. Now, what are we building?',
    38,
    600
  );

  // Animation for action buttons after 400ms page load
  const [showPills, setShowPills] = useState(false);
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPills(true);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  // Mouse-scrub video logic
  const videoRef = useRef<HTMLVideoElement>(null);
  const prevX = useRef<number | null>(null);
  const targetTime = useRef<number>(0);
  const isSeeking = useRef<boolean>(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const video = videoRef.current;
      if (!video || isNaN(video.duration)) return;

      const currentX = e.clientX;
      if (prevX.current === null) {
        prevX.current = currentX;
        return;
      }

      const delta = currentX - prevX.current;
      prevX.current = currentX;

      const SENSITIVITY = 0.8;
      const timeOffset = (delta / window.innerWidth) * SENSITIVITY * video.duration;
      
      let nextTime = targetTime.current + timeOffset;
      // Clamp between 0 and duration
      if (nextTime < 0) nextTime = 0;
      if (nextTime > video.duration) nextTime = video.duration;
      
      targetTime.current = nextTime;

      // Seek if not currently busy seeking
      if (!isSeeking.current) {
        isSeeking.current = true;
        video.currentTime = nextTime;
      }
    };

    const handleSeeked = () => {
      const video = videoRef.current;
      if (!video) return;

      // Check if targetTime has drifted from current seek position, if so queue seek
      if (Math.abs(video.currentTime - targetTime.current) > 0.05) {
        video.currentTime = targetTime.current;
      } else {
        isSeeking.current = false;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.addEventListener('seeked', handleSeeked);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (videoElement) {
        videoElement.removeEventListener('seeked', handleSeeked);
      }
    };
  }, []);

  // Copy Email Clipboard
  const [copied, setCopied] = useState(false);
  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText('hello@mainframe.co');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy to clipboard', err);
    }
  };

  return (
    <div className="relative min-h-screen w-full select-none overflow-hidden" style={{ fontFamily: 'var(--font-body)' }}>
      {/* Background Video */}
      <video
        ref={videoRef}
        src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260530_042513_df96a13b-6155-4f6e-8b93-c9dee66fba08.mp4"
        muted
        playsInline
        preload="auto"
        className="fixed inset-0 w-full h-full object-cover z-0 pointer-events-none"
        style={{ objectPosition: '70% center' }}
      />

      {/* FIXED NAVBAR */}
      <nav className="fixed top-0 left-0 w-full z-20 flex justify-between items-center px-5 sm:px-8 py-4 sm:py-5 bg-transparent">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <span
            className="text-[21px] sm:text-[26px] font-bold tracking-tight text-black select-none"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Mainframe®
          </span>
          <span className="text-[25px] sm:text-[30px] text-black select-none -tracking-widest">
            ✳︎
          </span>
        </div>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center text-[23px] text-black space-x-1.5">
          <a href="#labs" className="hover:opacity-60 transition-opacity">Labs</a>
          <span>,</span>
          <a href="#studio" className="hover:opacity-60 transition-opacity">Studio</a>
          <span>,</span>
          <a href="#openings" className="hover:opacity-60 transition-opacity">Openings</a>
          <span>,</span>
          <a href="#shop" className="hover:opacity-60 transition-opacity">Shop</a>
        </div>

        {/* Desktop CTA */}
        <div className="hidden md:block">
          <a
            href="mailto:hello@mainframe.co"
            className="text-[23px] text-black underline underline-offset-2 hover:opacity-60 transition-opacity"
          >
            Get in touch
          </a>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="flex flex-col justify-center items-center gap-[5px] z-30 md:hidden"
          aria-label="Toggle menu"
        >
          <span
            className={`w-6 h-[2px] bg-black transition-all duration-300 ${
              isMenuOpen ? 'rotate-45 translate-y-[7px]' : ''
            }`}
          />
          <span
            className={`w-6 h-[2px] bg-black transition-all duration-300 ${
              isMenuOpen ? 'opacity-0' : ''
            }`}
          />
          <span
            className={`w-6 h-[2px] bg-black transition-all duration-300 ${
              isMenuOpen ? '-rotate-45 -translate-y-[7px]' : ''
            }`}
          />
        </button>
      </nav>

      {/* Mobile Drawer Overlay */}
      <div
        className={`fixed inset-0 bg-white/95 backdrop-blur-sm z-10 flex flex-col justify-center px-8 gap-8 transition-opacity duration-300 md:hidden ${
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <a href="#labs" onClick={() => setIsMenuOpen(false)} className="text-[32px] font-medium text-black">Labs</a>
        <a href="#studio" onClick={() => setIsMenuOpen(false)} className="text-[32px] font-medium text-black">Studio</a>
        <a href="#openings" onClick={() => setIsMenuOpen(false)} className="text-[32px] font-medium text-black">Openings</a>
        <a href="#shop" onClick={() => setIsMenuOpen(false)} className="text-[32px] font-medium text-black">Shop</a>
        <a
          href="mailto:hello@mainframe.co"
          onClick={() => setIsMenuOpen(false)}
          className="text-[32px] font-medium text-black underline"
        >
          Get in touch
        </a>
      </div>

      {/* HERO SECTION */}
      <section className="relative z-10 h-screen w-full flex flex-col justify-end pb-12 md:justify-center md:pb-0 px-5 sm:px-8 md:px-10">
        <div className="max-w-xl text-left select-none">
          {/* Blurred intro label */}
          <div
            className="pointer-events-none select-none mb-5 sm:mb-6 leading-tight text-black"
            style={{
              fontSize: 'clamp(18px, 4vw, 26px)',
              lineHeight: 1.3,
              fontWeight: 400,
              filter: 'blur(4px)',
            }}
          >
            Hey there, meet A.R.I.A,
            <br />
            Mainframe's Adaptive Response Interface Agent
          </div>

          {/* Typewriter Text */}
          <p
            className="text-black mb-5 sm:mb-6 font-normal min-h-[54px] relative"
            style={{
              fontSize: 'clamp(18px, 4vw, 26px)',
              lineHeight: 1.35,
            }}
          >
            {displayed}
            {!done && (
              <span className="inline-block w-[2px] h-[1.1em] bg-black align-middle ml-[2px] animate-blink" />
            )}
          </p>

          {/* Action pill buttons container */}
          <div
            className="flex flex-wrap gap-y-1 transition-all duration-500 transform"
            style={{
              opacity: showPills ? 1 : 0,
              transform: showPills ? 'translateY(0)' : 'translateY(8px)',
            }}
          >
            {/* White buttons */}
            <button className="inline-flex items-center justify-center bg-white text-black border border-black/10 rounded-full text-[13px] sm:text-[15px] px-4 sm:px-5 py-[0.3em] mx-[0.2em] mb-[0.4em] whitespace-nowrap hover:bg-black hover:text-white transition-colors duration-200 cursor-pointer">
              Pitch us an idea
            </button>
            <button className="inline-flex items-center justify-center bg-white text-black border border-black/10 rounded-full text-[13px] sm:text-[15px] px-4 sm:px-5 py-[0.3em] mx-[0.2em] mb-[0.4em] whitespace-nowrap hover:bg-black hover:text-white transition-colors duration-200 cursor-pointer">
              Come work here
            </button>
            <button className="inline-flex items-center justify-center bg-white text-black border border-black/10 rounded-full text-[13px] sm:text-[15px] px-4 sm:px-5 py-[0.3em] mx-[0.2em] mb-[0.4em] whitespace-nowrap hover:bg-black hover:text-white transition-colors duration-200 cursor-pointer">
              Send a brief hello
            </button>
            <button className="inline-flex items-center justify-center bg-white text-black border border-black/10 rounded-full text-[13px] sm:text-[15px] px-4 sm:px-5 py-[0.3em] mx-[0.2em] mb-[0.4em] whitespace-nowrap hover:bg-black hover:text-white transition-colors duration-200 cursor-pointer">
              See how we operate
            </button>

            {/* Outline copy-email button */}
            <button
              onClick={handleCopyEmail}
              className="inline-flex items-center justify-center text-white bg-transparent border border-white rounded-full text-[13px] sm:text-[15px] px-4 sm:px-5 py-[0.3em] mx-[0.2em] mb-[0.4em] whitespace-nowrap hover:bg-white hover:text-black transition-colors duration-200 cursor-pointer gap-2 sm:gap-3"
            >
              <span>
                Reach us:{' '}
                <span className="underline underline-offset-1">
                  hello@mainframe.co
                </span>
              </span>
              {copied ? (
                <span className="text-[10px] text-emerald-400 font-bold uppercase animate-pulse">
                  Copied
                </span>
              ) : (
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="inline-block"
                >
                  <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                  <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Mainframe;
