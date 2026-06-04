import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Hls from 'hls.js';
import { ArrowRight, X, ArrowUpRight } from 'lucide-react';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

// Loading Screen Component
interface LoadingScreenProps {
  onComplete: () => void;
}

const LoadingScreen: React.FC<LoadingScreenProps> = ({ onComplete }) => {
  const [count, setCount] = useState(0);
  const [wordIndex, setWordIndex] = useState(0);
  const words = ["Design", "Create", "Inspire"];

  useEffect(() => {
    let animationFrameId: number;
    const duration = 2700; // 2.7s
    const startTime = performance.now();

    const updateCounter = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentCount = Math.floor(progress * 100);

      setCount(currentCount);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(updateCounter);
      } else {
        setTimeout(() => {
          onComplete();
        }, 400);
      }
    };

    animationFrameId = requestAnimationFrame(updateCounter);

    // Words transition cycler
    const wordInterval = setInterval(() => {
      setWordIndex((prev) => (prev + 1) % words.length);
    }, 900);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearInterval(wordInterval);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[9999] bg-bg flex flex-col justify-between p-8 md:p-16 select-none">
      {/* Top Left Label */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="text-xs text-muted uppercase tracking-[0.3em] font-body"
      >
        Portfolio
      </motion.div>

      {/* Center Word Cycler */}
      <div className="flex justify-center items-center h-40">
        <AnimatePresence mode="wait">
          <motion.div
            key={wordIndex}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 0.8 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.45, ease: 'easeInOut' }}
            className="text-4xl md:text-6xl lg:text-7xl font-display italic text-text-primary/80"
          >
            {words[wordIndex]}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Display */}
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-end">
          <div className="text-xs text-muted uppercase tracking-[0.2em] font-body">
            Loading System
          </div>
          <div className="text-6xl md:text-8xl lg:text-9xl font-display text-text-primary tabular-nums leading-none">
            {String(count).padStart(3, "0")}
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-[3px] w-full bg-stroke/50 rounded-full overflow-hidden">
          <div 
            className="h-full accent-gradient transition-transform duration-75 ease-out origin-left"
            style={{ 
              transform: `scaleX(${count / 100})`,
              boxShadow: '0 0 8px rgba(137, 170, 204, 0.35)'
            }}
          />
        </div>
      </div>
    </div>
  );
};

// HLS Custom Video Player Hook/Component
interface VideoBgProps {
  src: string;
  flipped?: boolean;
}

const VideoBg: React.FC<VideoBgProps> = ({ src, flipped = false }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let hls: Hls | null = null;

    if (Hls.isSupported()) {
      hls = new Hls({
        maxMaxBufferLength: 10,
        enableWorker: true
      });
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        video.play().catch(err => console.log("Auto-play blocked:", err));
      });
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS (Safari/iOS)
      video.src = src;
      video.addEventListener('loadedmetadata', () => {
        video.play().catch(err => console.log("Auto-play blocked:", err));
      });
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [src]);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
      <video
        ref={videoRef}
        muted
        loop
        playsInline
        className={`absolute top-1/2 left-1/2 min-w-full min-h-full object-cover -translate-x-1/2 -translate-y-1/2 ${flipped ? 'scale-y-[-1]' : ''}`}
      />
      {/* Visual Overlay */}
      <div className={`absolute inset-0 ${flipped ? 'bg-black/60' : 'bg-black/20'}`} />
      {!flipped && <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-bg to-transparent" />}
    </div>
  );
};

export const Portfolio: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [roleIndex, setRoleIndex] = useState(0);
  const roles = ["Creative", "Fullstack", "Founder", "Scholar"];
  const [scrollY, setScrollY] = useState(0);
  const [activeSection, setActiveSection] = useState('home');

  // GSAP animations references
  const heroRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLHeadingElement>(null);
  const exploreContentRef = useRef<HTMLDivElement>(null);
  const exploreContainerRef = useRef<HTMLDivElement>(null);

  // Parallax Columns references
  const leftColRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);

  // Lightbox Modal state
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      // Determine active nav section based on scroll offset
      const sections = ['home', 'work', 'journal', 'explorations', 'stats'];
      for (const section of sections) {
        const el = document.getElementById(section);
        if (el) {
          const rect = el.getBoundingClientRect();
          if (rect.top <= 120 && rect.bottom >= 120) {
            setActiveSection(section);
            break;
          }
        }
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cycle roles every 2 seconds
  useEffect(() => {
    if (isLoading) return;
    const interval = setInterval(() => {
      setRoleIndex((prev) => (prev + 1) % roles.length);
    }, 2000);
    return () => clearInterval(interval);
  }, [isLoading, roles.length]);

  // GSAP entrance animation on load completion
  useEffect(() => {
    if (isLoading) return;

    // Reset scroll values
    window.scrollTo(0, 0);

    const ctx = gsap.context(() => {
      // 1. Entrance timeline
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(".blur-in", 
        { opacity: 0, y: 20, filter: "blur(10px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.0, stagger: 0.15, delay: 0.2 }
      );

      tl.fromTo(".name-reveal",
        { opacity: 0, y: 50 },
        { opacity: 1, y: 0, duration: 1.2 },
        "-=0.8"
      );

      // 2. Scroll Trigger Pinned Center for Explorations Section
      if (exploreContentRef.current && exploreContainerRef.current) {
        ScrollTrigger.create({
          trigger: exploreContainerRef.current,
          start: "top top",
          end: "bottom bottom",
          pin: exploreContentRef.current,
          pinSpacing: false,
          id: "explore-pin"
        });
      }

      // 3. Parallax column translations
      if (leftColRef.current) {
        gsap.fromTo(leftColRef.current,
          { y: 50 },
          {
            y: -120,
            scrollTrigger: {
              trigger: exploreContainerRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1
            }
          }
        );
      }

      if (rightColRef.current) {
        gsap.fromTo(rightColRef.current,
          { y: 220 },
          {
            y: -40,
            scrollTrigger: {
              trigger: exploreContainerRef.current,
              start: "top bottom",
              end: "bottom top",
              scrub: 1.2
            }
          }
        );
      }

      // Marquee loop animation
      gsap.to(".marquee-inner", {
        xPercent: -50,
        duration: 40,
        ease: "none",
        repeat: -1
      });
    });

    return () => {
      ctx.revert();
    };
  }, [isLoading]);

  // Smooth scroll handler
  const scrollToId = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const projectCards = [
    {
      title: "Automotive Motion",
      subtitle: "Motion & System Graphics",
      span: "md:col-span-7",
      aspect: "aspect-[4/3] md:aspect-[16/10]",
      img: "https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=1000&auto=format&fit=crop"
    },
    {
      title: "Urban Architecture",
      subtitle: "3D Design & Spatials",
      span: "md:col-span-5",
      aspect: "aspect-[4/3] md:aspect-[16/13]",
      img: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Human Perspective",
      subtitle: "Interactive Portrayals",
      span: "md:col-span-5",
      aspect: "aspect-[4/3] md:aspect-[16/13]",
      img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop"
    },
    {
      title: "Brand Identity",
      subtitle: "Bespoke System Identity",
      span: "md:col-span-7",
      aspect: "aspect-[4/3] md:aspect-[16/10]",
      img: "https://images.unsplash.com/photo-1626785774573-4b799315345d?q=80&w=1000&auto=format&fit=crop"
    }
  ];

  const journalEntries = [
    {
      title: "Nuance in interaction layouts",
      date: "May 2026",
      readTime: "4 min read",
      img: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=300&auto=format&fit=crop"
    },
    {
      title: "The architecture of digital motion systems",
      date: "Apr 2026",
      readTime: "7 min read",
      img: "https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=300&auto=format&fit=crop"
    },
    {
      title: "Typography and visual layouts in responsive views",
      date: "Mar 2026",
      readTime: "5 min read",
      img: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=300&auto=format&fit=crop"
    },
    {
      title: "Security & speed balances in web frameworks",
      date: "Feb 2026",
      readTime: "9 min read",
      img: "https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=300&auto=format&fit=crop"
    }
  ];

  const explorationCards = [
    { id: 1, title: "Abstract Motion Hub", img: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=600&auto=format&fit=crop", rotation: "-rotate-2" },
    { id: 2, title: "Generative Canvas", img: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=600&auto=format&fit=crop", rotation: "rotate-3" },
    { id: 3, title: "Spatial Mathematics", img: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=600&auto=format&fit=crop", rotation: "-rotate-3" },
    { id: 4, title: "Light Field Geometry", img: "https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=600&auto=format&fit=crop", rotation: "rotate-2" },
    { id: 5, title: "Aurora Flow Mechanics", img: "https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?q=80&w=600&auto=format&fit=crop", rotation: "-rotate-1" },
    { id: 6, title: "Interactive Particle Grid", img: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=600&auto=format&fit=crop", rotation: "rotate-4" }
  ];

  return (
    <div className="font-body bg-bg text-text-primary min-h-screen selection:bg-accent selection:text-bg overflow-x-hidden relative">
      <AnimatePresence>
        {isLoading && (
          <LoadingScreen onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      {!isLoading && (
        <>
          {/* NAVIGATION BAR */}
          <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pt-4 md:pt-6 px-4">
            <div 
              className={`inline-flex items-center rounded-full border border-white/10 bg-surface/85 backdrop-blur-md px-3 py-2 transition-all duration-300 ${
                scrollY > 100 ? 'shadow-lg shadow-black/35 scale-[1.03]' : ''
              }`}
            >
              {/* Logo Circle */}
              <div 
                onClick={() => scrollToId('home')}
                className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer relative group overflow-hidden"
              >
                {/* Accent Gradient Border ring */}
                <div className="absolute inset-0 rounded-full accent-gradient group-hover:rotate-180 transition-transform duration-700 ease-in-out" />
                <div className="absolute inset-[1.5px] rounded-full bg-bg flex items-center justify-center">
                  <span className="font-display italic text-[14px] text-text-primary">JA</span>
                </div>
              </div>

              {/* Divider */}
              <div className="hidden sm:block w-px h-5 bg-stroke/60 mx-3" />

              {/* Nav links */}
              <nav className="flex items-center gap-1">
                {['Home', 'Work', 'Journal', 'Explorations'].map((tab) => {
                  const target = tab.toLowerCase();
                  const isActive = activeSection === target;
                  return (
                    <button
                      key={tab}
                      onClick={() => scrollToId(target)}
                      className={`text-[11px] sm:text-xs tracking-wider uppercase font-semibold rounded-full px-3 py-2 transition-all duration-200 cursor-pointer ${
                        isActive 
                          ? 'text-text-primary bg-stroke/80' 
                          : 'text-muted hover:text-text-primary hover:bg-stroke/40'
                      }`}
                    >
                      {tab}
                    </button>
                  );
                })}
              </nav>

              {/* Divider */}
              <div className="w-px h-5 bg-stroke/60 mx-3" />

              {/* "Say hi" button */}
              <a 
                href="mailto:hello@michaelsmith.com" 
                className="relative text-[11px] sm:text-xs tracking-wider uppercase font-bold rounded-full transition-all duration-300 group cursor-pointer inline-flex items-center"
              >
                {/* Glow ring */}
                <span className="absolute -inset-[2px] rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                <span className="bg-surface border border-white/10 group-hover:border-transparent text-text-primary rounded-full px-4 py-2 flex items-center gap-1 backdrop-blur-md">
                  Say Hi <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </a>
            </div>
          </header>

          {/* HERO SECTION */}
          <section id="home" ref={heroRef} className="relative min-h-screen w-full flex flex-col justify-center items-center px-6 overflow-hidden">
            {/* Background Stream Video */}
            <VideoBg src="https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8" />

            {/* Central Content */}
            <div className="relative z-10 text-center max-w-4xl flex flex-col items-center select-none pt-20">
              <div className="blur-in text-[10px] md:text-xs text-muted uppercase tracking-[0.3em] mb-6 font-medium">
                COLLECTION &apos;26
              </div>

              <h1 ref={nameRef} className="name-reveal text-6xl md:text-8xl lg:text-9xl font-display italic leading-[0.95] tracking-tight text-text-primary mb-8">
                Michael Smith
              </h1>

              {/* Cycling Role line */}
              <div className="blur-in text-lg md:text-xl text-text-primary/95 font-body tracking-wide mb-8 min-h-[36px]">
                A{' '}
                <span 
                  key={roleIndex} 
                  className="font-display italic text-2xl md:text-3xl text-text-primary animate-role-fade-in inline-block border-b border-stroke pb-0.5 mx-1.5"
                >
                  {roles[roleIndex]}
                </span>{' '}
                lives in Chicago.
              </div>

              <p className="blur-in text-sm md:text-base text-muted max-w-md mb-12 font-light leading-relaxed">
                Designing seamless digital interactions by focusing on the unique nuances which bring systems to life.
              </p>

              {/* Action Buttons */}
              <div className="blur-in flex flex-wrap gap-4 justify-center items-center">
                {/* See works solid button */}
                <button 
                  onClick={() => scrollToId('work')}
                  className="relative rounded-full text-xs md:text-sm font-semibold px-8 py-4 bg-text-primary text-bg transition-all duration-300 hover:scale-105 group overflow-hidden cursor-pointer"
                >
                  <span className="absolute inset-0 accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                  <span className="relative z-10 group-hover:text-text-primary transition-colors duration-300">
                    See Works
                  </span>
                </button>

                {/* Reach out outlined button */}
                <a 
                  href="mailto:hello@michaelsmith.com"
                  className="relative rounded-full text-xs md:text-sm font-semibold px-8 py-4 border border-stroke bg-surface/35 text-text-primary hover:text-text-primary transition-all duration-300 hover:scale-105 group cursor-pointer inline-flex items-center justify-center"
                >
                  <span className="absolute -inset-[1.5px] rounded-full accent-gradient opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
                  <span className="relative z-10 bg-bg w-full h-full rounded-full flex items-center justify-center group-hover:bg-transparent duration-300">
                    Reach Out
                  </span>
                </a>
              </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 select-none">
              <span className="text-[9px] text-muted uppercase tracking-[0.25em] font-medium font-body">SCROLL</span>
              <div className="w-px h-10 bg-stroke/60 relative overflow-hidden rounded-full">
                <div className="absolute top-0 left-0 w-full h-1/2 bg-white/70 animate-scroll-down rounded-full" />
              </div>
            </div>
          </section>

          {/* SELECTED WORKS SECTION */}
          <section id="work" className="bg-bg py-24 md:py-32 relative border-t border-stroke/50">
            <div className="max-w-[1200px] mx-auto px-6 md:px-12 flex flex-col gap-12 md:gap-16">
              {/* Header block */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1] }}
                className="flex flex-col md:flex-row md:items-end justify-between gap-6"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-px bg-stroke" />
                    <span className="text-[10px] text-muted uppercase tracking-[0.3em] font-semibold">Selected Work</span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-display text-text-primary">
                    Featured <span className="italic">projects</span>
                  </h2>
                  <p className="text-sm text-muted max-w-sm font-light">
                    A selection of projects I&apos;ve worked on, from concept to launch.
                  </p>
                </div>

                {/* View All Desktop Button */}
                <button 
                  onClick={() => scrollToId('explorations')}
                  className="hidden md:inline-flex items-center gap-2 text-xs uppercase tracking-wider font-bold group cursor-pointer relative"
                >
                  <span className="absolute -bottom-1 left-0 w-0 h-px bg-text-primary group-hover:w-full transition-all duration-300" />
                  View all work <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 duration-300" />
                </button>
              </motion.div>

              {/* Bento Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-8">
                {projectCards.map((card, idx) => (
                  <motion.div
                    key={card.title}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.7, delay: idx * 0.1, ease: 'easeOut' }}
                    className={`${card.span} group relative bg-surface border border-stroke rounded-[32px] overflow-hidden cursor-pointer`}
                  >
                    <div className={`relative w-full ${card.aspect} overflow-hidden`}>
                      {/* Image */}
                      <img 
                        src={card.img} 
                        alt={card.title} 
                        className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out" 
                      />

                      {/* Halftone Overlay */}
                      <div className="absolute inset-0 halftone-overlay opacity-20 pointer-events-none mix-blend-multiply" />

                      {/* Dark overlay */}
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/40 transition-colors duration-300" />

                      {/* Bottom Info Bar inside Card */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8 bg-gradient-to-t from-black/80 to-transparent flex justify-between items-end transform translate-y-3 opacity-90 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                        <div className="flex flex-col gap-1">
                          <span className="text-[10px] text-white/60 uppercase tracking-widest font-mono">{card.subtitle}</span>
                          <span className="text-xl md:text-2xl font-display italic text-white">{card.title}</span>
                        </div>
                        <div className="w-9 h-9 rounded-full bg-white text-bg flex items-center justify-center scale-90 group-hover:scale-100 duration-300 shadow-md">
                          <ArrowUpRight className="w-4 h-4" />
                        </div>
                      </div>

                      {/* Hover view label */}
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 backdrop-blur-[2px]">
                        <span className="bg-white/95 text-bg px-5 py-2.5 rounded-full text-xs font-semibold shadow-xl border border-white/20 select-none uppercase tracking-wider">
                          View &mdash; <span className="font-display italic capitalize">{card.title}</span>
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* JOURNAL SECTION */}
          <section id="journal" className="bg-bg py-24 md:py-32 relative border-t border-stroke/50">
            <div className="max-w-[1200px] mx-auto px-6 md:px-12 flex flex-col gap-12 md:gap-16">
              {/* Header Block */}
              <motion.div 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="flex flex-col md:flex-row md:items-end justify-between gap-6"
              >
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-px bg-stroke" />
                    <span className="text-[10px] text-muted uppercase tracking-[0.3em] font-semibold">Insights & Thoughts</span>
                  </div>
                  <h2 className="text-4xl md:text-5xl font-display text-text-primary">
                    Recent <span className="italic">thoughts</span>
                  </h2>
                  <p className="text-sm text-muted max-w-sm font-light">
                    A log of articles written about engineering, systems design, and product design.
                  </p>
                </div>
              </motion.div>

              {/* Journal Entries List */}
              <div className="flex flex-col gap-4">
                {journalEntries.map((entry, idx) => (
                  <motion.div
                    key={entry.title}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-80px" }}
                    transition={{ duration: 0.6, delay: idx * 0.1 }}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 bg-surface/30 hover:bg-surface border border-stroke rounded-[32px] sm:rounded-full group transition-all duration-350 cursor-pointer"
                  >
                    <div className="flex items-center gap-4 md:gap-6">
                      {/* Image Thumbnail */}
                      <div className="w-14 h-14 md:w-16 md:h-16 rounded-full overflow-hidden shrink-0 border border-stroke bg-bg relative">
                        <img src={entry.img} alt={entry.title} className="w-full h-full object-cover group-hover:scale-110 duration-500" />
                        <div className="absolute inset-0 halftone-overlay opacity-15" />
                      </div>

                      {/* Title & Metadata */}
                      <div className="flex flex-col gap-1">
                        <h3 className="text-base md:text-lg font-medium text-text-primary group-hover:text-accent duration-200">
                          {entry.title}
                        </h3>
                        <div className="flex items-center gap-3 text-xs text-muted">
                          <span>{entry.date}</span>
                          <span className="w-1 h-1 rounded-full bg-stroke" />
                          <span>{entry.readTime}</span>
                        </div>
                      </div>
                    </div>

                    {/* Arrow Button */}
                    <div className="self-end sm:self-auto w-10 h-10 md:w-12 md:h-12 rounded-full border border-stroke flex items-center justify-center shrink-0 group-hover:bg-text-primary group-hover:text-bg group-hover:border-transparent transition-all duration-300">
                      <ArrowUpRight className="w-4.5 h-4.5 group-hover:rotate-45 duration-350" />
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </section>

          {/* EXPLORATIONS SECTION (PARALLAX GALLERY) */}
          <section id="explorations" ref={exploreContainerRef} className="bg-bg min-h-[220vh] relative border-t border-stroke/50">
            {/* Pinned left side layout */}
            <div ref={exploreContentRef} className="h-screen w-full flex flex-col md:flex-row justify-between items-center md:items-stretch px-6 md:px-16 py-16 md:py-24 z-10 pointer-events-none">
              
              {/* Left Pinned Description */}
              <div className="flex flex-col justify-center items-start gap-5 max-w-sm self-start md:self-auto pt-8 pointer-events-auto">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-px bg-stroke" />
                  <span className="text-[10px] text-muted uppercase tracking-[0.3em] font-semibold">Visual Experiments</span>
                </div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-display text-text-primary leading-tight">
                  Visual <span className="italic">playground</span>
                </h2>
                <p className="text-sm text-muted font-light leading-relaxed">
                  A personal canvas of concepts, layouts, shader systems, and responsive layouts.
                </p>

                {/* CTA Dribbble */}
                <a 
                  href="https://dribbble.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="mt-4 rounded-full text-xs font-semibold px-6 py-3 border border-stroke bg-surface hover:border-text-primary transition-colors cursor-pointer flex items-center gap-2"
                >
                  Follow on Dribbble <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              </div>

              {/* Right spacer for the parallax content */}
              <div className="hidden md:block w-[400px]" />
            </div>

            {/* Parallax scrolling column container */}
            <div className="absolute inset-y-0 right-0 left-0 md:left-auto md:w-[600px] lg:w-[700px] px-6 md:px-12 pt-20 pb-40 z-20 flex justify-center gap-6 md:gap-12 pointer-events-none">
              
              {/* Left Parallax Column */}
              <div ref={leftColRef} className="flex flex-col gap-12 md:gap-16 w-1/2 pointer-events-auto">
                {explorationCards.slice(0, 3).map((item) => (
                  <div 
                    key={item.id} 
                    onClick={() => setLightboxImg(item.img)}
                    className={`aspect-square w-full rounded-2xl md:rounded-[32px] overflow-hidden border border-stroke bg-surface/50 p-2 cursor-pointer shadow-xl hover:-translate-y-2 hover:scale-[1.02] duration-300 group ${item.rotation}`}
                  >
                    <div className="relative w-full h-full rounded-xl md:rounded-[24px] overflow-hidden">
                      <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 duration-500" />
                      <div className="absolute inset-0 halftone-overlay opacity-15 pointer-events-none" />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/40 duration-300" />
                      <div className="absolute bottom-4 left-4 right-4 bg-surface/90 backdrop-blur-md border border-white/5 rounded-xl p-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-300">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-muted block mb-0.5">Click to view</span>
                        <span className="text-xs font-semibold text-text-primary block truncate">{item.title}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Right Parallax Column */}
              <div ref={rightColRef} className="flex flex-col gap-12 md:gap-16 w-1/2 pointer-events-auto mt-20">
                {explorationCards.slice(3, 6).map((item) => (
                  <div 
                    key={item.id} 
                    onClick={() => setLightboxImg(item.img)}
                    className={`aspect-square w-full rounded-2xl md:rounded-[32px] overflow-hidden border border-stroke bg-surface/50 p-2 cursor-pointer shadow-xl hover:-translate-y-2 hover:scale-[1.02] duration-300 group ${item.rotation}`}
                  >
                    <div className="relative w-full h-full rounded-xl md:rounded-[24px] overflow-hidden">
                      <img src={item.img} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 duration-500" />
                      <div className="absolute inset-0 halftone-overlay opacity-15 pointer-events-none" />
                      <div className="absolute inset-0 bg-black/10 group-hover:bg-black/40 duration-300" />
                      <div className="absolute bottom-4 left-4 right-4 bg-surface/90 backdrop-blur-md border border-white/5 rounded-xl p-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-300">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-muted block mb-0.5">Click to view</span>
                        <span className="text-xs font-semibold text-text-primary block truncate">{item.title}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </section>

          {/* STATS SECTION */}
          <section id="stats" className="bg-bg py-24 md:py-32 relative border-t border-stroke/50">
            <div className="max-w-[1200px] mx-auto px-6 md:px-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-stroke">
                
                {/* Stat item 1 */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="flex flex-col items-center pt-8 md:pt-0"
                >
                  <div className="text-5xl md:text-6xl font-display text-text-primary mb-2">20+</div>
                  <div className="text-xs uppercase tracking-widest text-muted font-semibold">Years Experience</div>
                </motion.div>

                {/* Stat item 2 */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="flex flex-col items-center pt-8 md:pt-0"
                >
                  <div className="text-5xl md:text-6xl font-display text-text-primary mb-2">95+</div>
                  <div className="text-xs uppercase tracking-widest text-muted font-semibold">Projects Completed</div>
                </motion.div>

                {/* Stat item 3 */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="flex flex-col items-center pt-8 md:pt-0"
                >
                  <div className="text-5xl md:text-6xl font-display text-text-primary mb-2">200%</div>
                  <div className="text-xs uppercase tracking-widest text-muted font-semibold">Client Satisfaction</div>
                </motion.div>

              </div>
            </div>
          </section>

          {/* CONTACT & FOOTER */}
          <footer className="bg-bg relative pt-24 pb-12 overflow-hidden border-t border-stroke/50">
            {/* Background flipped video */}
            <VideoBg src="https://stream.mux.com/Aa02T7oM1wH5Mk5EEVDYhbZ1ChcdhRsS2m1NYyx4Ua1g.m3u8" flipped={true} />

            {/* Loop Marquee Ticker */}
            <div className="relative z-10 w-full overflow-hidden py-6 border-y border-stroke bg-bg/40 backdrop-blur-sm select-none">
              <div className="marquee-inner flex whitespace-nowrap gap-8 uppercase font-display text-3xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white/5">
                {Array.from({ length: 15 }).map((_, i) => (
                  <span key={i}>BUILDING THE FUTURE • </span>
                ))}
              </div>
            </div>

            {/* CTA & Email Block */}
            <div className="relative z-10 max-w-4xl mx-auto px-6 text-center py-20 flex flex-col items-center gap-6">
              <span className="text-[10px] text-muted uppercase tracking-[0.3em] font-semibold">Get in touch</span>
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-display text-text-primary leading-tight">
                Let&apos;s build <span className="italic">something great</span>
              </h2>
              
              {/* Mailto button with gradient ring */}
              <a 
                href="mailto:hello@michaelsmith.com"
                className="mt-6 relative rounded-full px-8 py-4 font-bold text-xs uppercase tracking-wider group cursor-pointer inline-flex items-center justify-center overflow-hidden"
              >
                <span className="absolute -inset-[2px] rounded-full accent-gradient opacity-80 group-hover:opacity-100 transition-opacity duration-300 -z-10 animate-gradient-shift" />
                <span className="bg-surface border border-white/10 text-text-primary group-hover:border-transparent rounded-full px-8 py-4 flex items-center gap-2 duration-300">
                  hello@michaelsmith.com <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 duration-300" />
                </span>
              </a>
            </div>

            {/* Footer Bottom Bar */}
            <div className="relative z-10 max-w-[1200px] mx-auto px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6 pt-12 border-t border-stroke/30 text-xs text-muted">
              {/* Available badge */}
              <div className="flex items-center gap-2 bg-surface/80 border border-stroke px-4 py-2 rounded-full backdrop-blur-md">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>Available for client work</span>
              </div>

              {/* Social links */}
              <div className="flex items-center gap-5">
                {['Twitter', 'LinkedIn', 'Dribbble', 'GitHub'].map((social) => (
                  <a 
                    key={social}
                    href={`https://${social.toLowerCase()}.com`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="hover:text-text-primary transition-colors font-medium cursor-pointer"
                  >
                    {social}
                  </a>
                ))}
              </div>

              {/* Copyright */}
              <p>&copy; {new Date().getFullYear()} Michael Smith. All rights reserved.</p>
            </div>
          </footer>

          {/* LIGHTBOX MODAL */}
          <AnimatePresence>
            {lightboxImg && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setLightboxImg(null)}
                className="fixed inset-0 z-[10000] bg-black/90 backdrop-blur-md flex items-center justify-center p-6 cursor-pointer"
              >
                <button 
                  onClick={() => setLightboxImg(null)}
                  className="absolute top-6 right-6 w-10 h-10 rounded-full bg-surface border border-stroke text-text-primary flex items-center justify-center hover:bg-stroke hover:scale-105 duration-350 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
                <motion.div 
                  initial={{ scale: 0.9, y: 15 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 15 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 220 }}
                  className="max-w-[90vw] max-h-[85vh] rounded-2xl overflow-hidden border border-stroke relative p-1 bg-surface"
                >
                  <img src={lightboxImg} alt="Visual Playground High-Res" className="max-w-full max-h-[80vh] rounded-xl object-contain" />
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </div>
  );
};

export default Portfolio;
