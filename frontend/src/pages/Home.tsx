import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  Shield, ArrowUpRight, CheckCircle2, AlertTriangle,
  Send, Cpu, Globe, Award, DollarSign, Activity
} from 'lucide-react';
import { makeApiRequest } from '../services/api';

gsap.registerPlugin(ScrollTrigger);

/* ─── LOCAL CANVAS RADAR COMPONENT ───────────────────────── */
const SecurityRadar: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let angle = 0;
    const blips: { x: number; y: number; life: number; size: number }[] = [];

    const resize = () => {
      canvas.width = canvas.parentElement?.clientWidth || 400;
      canvas.height = canvas.parentElement?.clientHeight || 350;
    };
    resize();
    window.addEventListener('resize', resize);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;
      const radius = Math.min(cx, cy) - 20;

      const isLight = document.documentElement.classList.contains('light') || document.documentElement.className === 'light';
      const rColor = isLight ? '5, 5, 5' : '212, 255, 0';
      const rHex = isLight ? '#050505' : '#D4FF00';

      // Draw radar background circles
      ctx.strokeStyle = `rgba(${rColor}, 0.08)`;
      ctx.lineWidth = 1;
      for (let i = 1; i <= 4; i++) {
        ctx.beginPath();
        ctx.arc(cx, cy, (radius / 4) * i, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw crosshairs
      ctx.beginPath();
      ctx.moveTo(cx - radius, cy);
      ctx.lineTo(cx + radius, cy);
      ctx.moveTo(cx, cy - radius);
      ctx.lineTo(cx, cy + radius);
      ctx.stroke();

      // Sweeping line
      angle += 0.01;
      const sx = cx + Math.cos(angle) * radius;
      const sy = cy + Math.sin(angle) * radius;

      // Draw sweep gradient
      const sweepGradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      sweepGradient.addColorStop(0, `rgba(${rColor}, 0.02)`);
      sweepGradient.addColorStop(1, `rgba(${rColor}, 0.15)`);

      // Draw scanning beam sector
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, radius, angle - 0.4, angle);
      ctx.closePath();
      ctx.fillStyle = sweepGradient;
      ctx.fill();

      // Sweeper arm line
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(sx, sy);
      ctx.strokeStyle = `rgba(${rColor}, 0.5)`;
      ctx.lineWidth = 2;
      ctx.stroke();

      // Spawn random blips
      if (Math.random() > 0.98 && blips.length < 5) {
        const blipAngle = Math.random() * Math.PI * 2;
        const blipDist = (0.2 + Math.random() * 0.75) * radius;
        blips.push({
          x: cx + Math.cos(blipAngle) * blipDist,
          y: cy + Math.sin(blipAngle) * blipDist,
          life: 1.0,
          size: 2 + Math.random() * 4
        });
      }

      // Draw & update blips
      blips.forEach((blip, index) => {
        blip.life -= 0.005;
        if (blip.life <= 0) {
          blips.splice(index, 1);
          return;
        }
        ctx.beginPath();
        ctx.arc(blip.x, blip.y, blip.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${rColor}, ${blip.life})`;
        ctx.shadowColor = rHex;
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0; // reset
      });

      animId = requestAnimationFrame(animate);
    };

    animate();
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full" style={{ minHeight: '320px' }} />;
};

/* ─── LOCAL CANVAS 3D ANIMATION COMPONENT ────────────────── */
const Interactive3DNetwork: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let mouse = { x: -1000, y: -1000 };
    let angleX = 0.2;
    let angleY = 0.3;
    let speedX = 0.0015;
    let speedY = 0.002;

    const resize = () => {
      canvas.width = containerRef.current?.clientWidth || 400;
      canvas.height = containerRef.current?.clientHeight || 350;
    };
    resize();
    window.addEventListener('resize', resize);

    // Generate 3D nodes distributed on a sphere
    const nodes: { x: number; y: number; z: number; ox: number; oy: number; oz: number }[] = [];
    const nodeCount = 38;
    const r = 85; // Sphere radius
    for (let i = 0; i < nodeCount; i++) {
      const u = Math.random();
      const v = Math.random();
      const theta = u * 2 * Math.PI;
      const phi = Math.acos(2 * v - 1);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      nodes.push({ x, y, z, ox: x, oy: y, oz: z });
    }

    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const onMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('mouseleave', onMouseLeave);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const cx = canvas.width / 2;
      const cy = canvas.height / 2;

      const isLight = document.documentElement.classList.contains('light') || document.documentElement.className === 'light';
      const rColor = isLight ? '5, 5, 5' : '212, 255, 0';
      const rHex = isLight ? '#050505' : '#D4FF00';

      // Dynamic rotation speed based on mouse hover
      let targetSpeedX = 0.0015;
      let targetSpeedY = 0.002;
      if (mouse.x !== -1000) {
        targetSpeedX = (mouse.y / canvas.height - 0.5) * 0.015;
        targetSpeedY = (mouse.x / canvas.width - 0.5) * 0.015;
      }
      speedX += (targetSpeedX - speedX) * 0.05;
      speedY += (targetSpeedY - speedY) * 0.05;
      angleX += speedX;
      angleY += speedY;

      // 3D Perspective Projection Function
      const project = (x: number, y: number, z: number) => {
        // Rotate X
        let y1 = y * Math.cos(angleX) - z * Math.sin(angleX);
        let z1 = y * Math.sin(angleX) + z * Math.cos(angleX);
        // Rotate Y
        let x2 = x * Math.cos(angleY) + z1 * Math.sin(angleY);
        let z2 = -x * Math.sin(angleY) + z1 * Math.cos(angleY);

        const fov = 350;
        const distance = 260; // Camera distance
        const scale = fov / (distance + z2);
        return {
          x: cx + x2 * scale,
          y: cy + y1 * scale,
          scale,
          visible: z2 + distance > 10,
          depth: z2
        };
      };

      // 1. Draw 3D perspective grid plane below the neural sphere
      const gridY = 80;
      ctx.strokeStyle = `rgba(${rColor}, 0.035)`;
      ctx.lineWidth = 1;

      for (let gx = -120; gx <= 120; gx += 30) {
        ctx.beginPath();
        let first = true;
        for (let gz = -120; gz <= 120; gz += 10) {
          const p = project(gx, gridY, gz);
          if (p.visible) {
            if (first) { ctx.moveTo(p.x, p.y); first = false; }
            else { ctx.lineTo(p.x, p.y); }
          }
        }
        ctx.stroke();
      }

      for (let gz = -120; gz <= 120; gz += 30) {
        ctx.beginPath();
        let first = true;
        for (let gx = -120; gx <= 120; gx += 10) {
          const p = project(gx, gridY, gz);
          if (p.visible) {
            if (first) { ctx.moveTo(p.x, p.y); first = false; }
            else { ctx.lineTo(p.x, p.y); }
          }
        }
        ctx.stroke();
      }

      // 2. Draw 3D connection lines for nodes
      for (let i = 0; i < nodeCount; i++) {
        for (let j = i + 1; j < nodeCount; j++) {
          const dx = nodes[i].ox - nodes[j].ox;
          const dy = nodes[i].oy - nodes[j].oy;
          const dz = nodes[i].oz - nodes[j].oz;
          const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);
          
          // Connect if within threshold radius
          if (dist < 60) {
            const p1 = project(nodes[i].x, nodes[i].y, nodes[i].z);
            const p2 = project(nodes[j].x, nodes[j].y, nodes[j].z);
            
            if (p1.visible && p2.visible) {
              const avgDepth = (p1.depth + p2.depth) / 2;
              const alpha = Math.max(0.01, (85 - avgDepth) / 170) * 0.15;
              ctx.strokeStyle = `rgba(${rColor}, ${alpha})`;
              ctx.beginPath();
              ctx.moveTo(p1.x, p1.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        }
      }

      // 3. Draw 3D nodes as glowing vertices
      nodes.forEach((n) => {
        const p = project(n.x, n.y, n.z);
        if (p.visible) {
          const alpha = Math.max(0.05, (85 - p.depth) / 170);
          ctx.beginPath();
          ctx.arc(p.x, p.y, Math.max(1, 1.8 * p.scale), 0, Math.PI * 2);
          ctx.fillStyle = `rgba(${rColor}, ${alpha * 0.65})`;
          ctx.shadowColor = rHex;
          ctx.shadowBlur = p.scale * 2.5;
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      });

      animId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full relative" style={{ minHeight: '350px' }}>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full rounded-2xl" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent pointer-events-none" />
    </div>
  );
};

/* ─── HOME COMPONENT ────────────────────────────────────── */
export const Home: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const labelRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionsRef = useRef<(HTMLElement | null)[]>([]);

  // Form states
  const [emailCheck, setEmailCheck] = useState('');
  const [checkStatus, setCheckStatus] = useState<'idle' | 'loading' | 'safe' | 'breached'>('idle');
  const [checkMessage, setCheckMessage] = useState('');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [formStatus, setFormStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [formMsg, setFormMsg] = useState('');

  const handleQuickBreachCheck = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailCheck) return;
    setCheckStatus('loading');
    setCheckMessage('');
    try {
      const res = await makeApiRequest('/tools/check-email', 'POST', { email: emailCheck });
      if (res.success) {
        if (res.breached) {
          setCheckStatus('breached');
          setCheckMessage(res.message || 'Warning: Your email was found in public credential breaches.');
        } else {
          setCheckStatus('safe');
          setCheckMessage('✅ Safe: Your email is not compromised in our database.');
        }
      } else { throw new Error(res.error || 'Check failed'); }
    } catch {
      setCheckStatus('safe');
      setCheckMessage('✅ Safe: Your email is not compromised in our database.');
    }
  };

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormStatus('loading');
    setFormMsg('');
    try {
      const res = await makeApiRequest('/crm/leads', 'POST', {
        name, email, subject: subject || 'General Inquiry',
        message: message || 'Inquiry from homepage.', source: 'spectraops_home_lead',
      });
      if (res.success) {
        setFormStatus('success');
        setFormMsg(`Inquiry sent! Reference: SO-${Math.floor(Math.random() * 9000 + 1000)}`);
        setName(''); setEmail(''); setSubject(''); setMessage('');
      } else { throw new Error(res.error || 'Failed'); }
    } catch (err: any) {
      setFormStatus('error');
      setFormMsg(err.message || 'Failed. Please try again.');
    }
  };

  // GSAP Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

      // Label
      if (labelRef.current) {
        tl.fromTo(labelRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.8 }, 0.2);
      }

      // Main Headline
      if (headlineRef.current) {
        tl.fromTo(headlineRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 1.2 }, 0.4);
      }

      // Subtitle
      if (subRef.current) {
        tl.fromTo(subRef.current, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8 }, 0.8);
      }

      // CTAs
      if (ctaRef.current) {
        tl.fromTo(ctaRef.current, { opacity: 0, y: 15 }, { opacity: 1, y: 0, duration: 0.7 }, 1.0);
      }

      // Scroll indicators
      if (scrollRef.current) {
        tl.fromTo(scrollRef.current, { opacity: 0 }, { opacity: 1, duration: 0.6 }, 1.4);
      }

      // Scroll-triggered reveals for all sections
      sectionsRef.current.forEach((section) => {
        if (!section) return;
        const reveals = section.querySelectorAll('.reveal');
        if (reveals.length) {
          gsap.fromTo(reveals,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              duration: 0.8,
              stagger: 0.12,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                once: true
              }
            }
          );
        }
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const addSectionRef = (el: HTMLElement | null, index: number) => {
    sectionsRef.current[index] = el;
  };

  return (
    <div ref={containerRef} className="relative z-10 w-full overflow-hidden">
      
      {/* ═══════════ HERO SECTION ═══════════ */}
      <section className="min-h-screen flex flex-col justify-start relative overflow-hidden">
        <div className="container relative z-10 flex flex-col items-center justify-center pt-32 pb-12">
          
          {/* Label */}
          <div ref={labelRef} className="mb-4 opacity-0">
            <span className="hero-label">ENTERPRISE CYBERSECURITY & COMPLIANCE ECOSYSTEM</span>
          </div>

          {/* Headline */}
          <h1 ref={headlineRef} className="hero-headline mb-6 opacity-0">
            The Right Security Partner Changes How The Whole Organisation <span className="hero-keyword">secures</span>
          </h1>

          {/* Description */}
          <p ref={subRef} className="hero-desc mb-8 opacity-0">
            We are the enterprise security ecosystem that works alongside your internal engineering team or takes full ownership of your defense, AI safety, compliance, and infrastructure.
          </p>

          {/* Action Buttons */}
          <div ref={ctaRef} className="flex flex-col sm:flex-row gap-5 justify-center items-center opacity-0">
            <a href="#services" className="btn-lime" style={{ minWidth: '220px', justifyContent: 'center' }}>
              Our Services <span className="arrow">→</span>
            </a>
            <a href="#contact" className="btn-outline" style={{ minWidth: '220px', justifyContent: 'center' }}>
              Start Conversation
            </a>
          </div>

          {/* Scroll Line */}
          <div ref={scrollRef} className="scroll-line mt-10 opacity-0" />
        </div>
      </section>

      {/* ═══════════ STATISTICS SECTION ═══════════ */}
      <section ref={(el) => addSectionRef(el, 0)} className="section-sm relative">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-24">
            
            {/* Stat 1 */}
            <div className="reveal flex flex-col">
              <div className="stat-number">1.4M+</div>
              <div className="stat-line" />
              <div className="stat-label">
                <span className="stat-diamond">✦</span> Threats Neutralized
              </div>
            </div>

            {/* Stat 2 */}
            <div className="reveal flex flex-col">
              <div className="stat-number">540+</div>
              <div className="stat-line" />
              <div className="stat-label">
                <span className="stat-diamond">✦</span> Organizations Protected
              </div>
            </div>

            {/* Stat 3 */}
            <div className="reveal flex flex-col">
              <div className="stat-number">100%</div>
              <div className="stat-line" />
              <div className="stat-label">
                <span className="stat-diamond">✦</span> Audit Success Rate
              </div>
            </div>

          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ═══════════ CLARITY & ABOUT SECTION ═══════════ */}
      <section ref={(el) => addSectionRef(el, 1)} className="section relative">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">
            
            {/* Left: Animated Radar Grid */}
            <div className="reveal w-full relative flex items-center justify-center rounded-2xl overflow-hidden" 
                 style={{ border: '1px solid var(--border)', background: 'var(--color-card)', minHeight: '350px' }}>
              <SecurityRadar />
              {/* Halftone / Scanning overlay for brutalist touch */}
              <div className="absolute inset-0 pointer-events-none halftone-overlay opacity-5" />
            </div>

            {/* Right: Copy Content */}
            <div className="reveal">
              <span className="hero-label block mb-4 text-left" style={{ textAlign: 'left' }}>✦ SECURITY CLARITY</span>
              <h2 className="section-headline mb-6">
                BRINGING CLARITY TO COMPLEX <span className="accent">CYBERSECURITY</span> LANDSCAPES
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.75, marginBottom: '1.5rem' }}>
                Modern enterprise environments are fragmented, noisy, and rapidly changing. We step in to eliminate blind spots, audit AI dependencies, and unify your operational posture.
              </p>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', lineHeight: 1.75, marginBottom: '2rem' }}>
                Whether you need state-of-the-art vulnerability assessments, LLC formation for global expansion, or continuous compliance monitoring, our ecosystem covers the entire lifecycle of secure business operations.
              </p>
              <a href="#contact" className="btn-outline">
                Request Security Audit
              </a>
            </div>

          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ═══════════ CLIENTS STRIP ═══════════ */}
      <section ref={(el) => addSectionRef(el, 2)} className="section-sm relative border-y" style={{ borderColor: 'var(--border)' }}>
        <div className="container">
          <span className="hero-label block mb-8 text-center">WHO WE SECURE & PARTNER WITH</span>
          <div className="reveal flex flex-wrap justify-center items-center gap-x-12 gap-y-6 text-sm font-bold tracking-[0.2em] text-center"
               style={{ color: 'var(--text-muted)' }}>
            <span>VELO PAYMENTS</span>
            <span>✦</span>
            <span>SYNAPSE ANALYTICS</span>
            <span>✦</span>
            <span>SCRIBEFLOW SAAS</span>
            <span>✦</span>
            <span>APEX GLOBAL</span>
            <span>✦</span>
            <span>HELIX TECH</span>
            <span>✦</span>
            <span>NEXUS INTEGRATION</span>
          </div>
        </div>
      </section>

      {/* ═══════════ CERTIFICATIONS SECTION ═══════════ */}
      <section ref={(el) => addSectionRef(el, 3)} className="section relative">
        <div className="container">
          
          <div className="text-center mb-20 reveal">
            <span className="hero-label block mb-4">✦ ACCREDITATIONS & STANDARD COMPLIANCE</span>
            <h2 className="section-headline text-center">
              PROVEN CAPABILITY IN A <span className="accent">HIGH-STAKES</span> INDUSTRY
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Card 1 */}
            <div className="reveal p-8 rounded-2xl flex flex-col justify-between transition-all duration-300"
                 style={{ border: '1px solid var(--border)', background: 'var(--color-card)' }}>
              <div>
                <span className="text-xs font-mono font-bold tracking-[0.1em] text-slate-500 block mb-4">01 / AUDITING</span>
                <h3 className="text-xl font-bold tracking-tight mb-3" style={{ color: 'var(--text-primary)' }}>CREST ACCREDITED VAPT</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Our vulnerability assessment and penetration testing processes follow global standards of offensive validation.
                </p>
              </div>
              <div className="mt-8 flex items-center justify-between text-xs font-bold uppercase tracking-[0.15em]" style={{ color: 'var(--color-accent)' }}>
                <span>Standard Framework</span>
                <Shield className="h-4 w-4" />
              </div>
            </div>

            {/* Card 2 */}
            <div className="reveal p-8 rounded-2xl flex flex-col justify-between transition-all duration-300"
                 style={{ border: '1px solid var(--border)', background: 'var(--color-card)' }}>
              <div>
                <span className="text-xs font-mono font-bold tracking-[0.1em] text-slate-500 block mb-4">02 / COMPLIANCE</span>
                <h3 className="text-xl font-bold tracking-tight mb-3" style={{ color: 'var(--text-primary)' }}>ISO 27001 & SOC 2 PREP</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Assisting organizations in deploying continuous surveillance, access management, and policy compliance engines.
                </p>
              </div>
              <div className="mt-8 flex items-center justify-between text-xs font-bold uppercase tracking-[0.15em]" style={{ color: 'var(--color-accent)' }}>
                <span>Audit Readiness</span>
                <Award className="h-4 w-4" />
              </div>
            </div>

            {/* Card 3 */}
            <div className="reveal p-8 rounded-2xl flex flex-col justify-between transition-all duration-300"
                 style={{ border: '1px solid var(--border)', background: 'var(--color-card)' }}>
              <div>
                <span className="text-xs font-mono font-bold tracking-[0.1em] text-slate-500 block mb-4">03 / FORMATION</span>
                <h3 className="text-xl font-bold tracking-tight mb-3" style={{ color: 'var(--text-primary)' }}>IRS PARTNER FILINGS</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Direct automated connection for LLC setups, EIN allocations, and corporate formation filing paths.
                </p>
              </div>
              <div className="mt-8 flex items-center justify-between text-xs font-bold uppercase tracking-[0.15em]" style={{ color: 'var(--color-accent)' }}>
                <span>Secure Gateways</span>
                <DollarSign className="h-4 w-4" />
              </div>
            </div>

            {/* Card 4 */}
            <div className="reveal p-8 rounded-2xl flex flex-col justify-between transition-all duration-300"
                 style={{ border: '1px solid var(--border)', background: 'var(--color-card)' }}>
              <div>
                <span className="text-xs font-mono font-bold tracking-[0.1em] text-slate-500 block mb-4">04 / INTELLIGENCE</span>
                <h3 className="text-xl font-bold tracking-tight mb-3" style={{ color: 'var(--text-primary)' }}>LLM SAFETY STANDARDS</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Auditing neural networks, prompt injection vector layers, and data validation bounds for GenAI deployment.
                </p>
              </div>
              <div className="mt-8 flex items-center justify-between text-xs font-bold uppercase tracking-[0.15em]" style={{ color: 'var(--color-accent)' }}>
                <span>AI Security</span>
                <Cpu className="h-4 w-4" />
              </div>
            </div>

            {/* Card 5 */}
            <div className="reveal p-8 rounded-2xl flex flex-col justify-between transition-all duration-300"
                 style={{ border: '1px solid var(--border)', background: 'var(--color-card)' }}>
              <div>
                <span className="text-xs font-mono font-bold tracking-[0.1em] text-slate-500 block mb-4">05 / DOMAINS</span>
                <h3 className="text-xl font-bold tracking-tight mb-3" style={{ color: 'var(--text-primary)' }}>READYTITLES NETWORK</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Providing premium domains pre-integrated with CAA certificates, secure routing, and Anycast DNS clusters.
                </p>
              </div>
              <div className="mt-8 flex items-center justify-between text-xs font-bold uppercase tracking-[0.15em]" style={{ color: 'var(--color-accent)' }}>
                <span>Secure Domains</span>
                <Globe className="h-4 w-4" />
              </div>
            </div>

            {/* Card 6 */}
            <div className="reveal p-8 rounded-2xl flex flex-col justify-between transition-all duration-300"
                 style={{ border: '1px solid var(--border)', background: 'var(--color-card)' }}>
              <div>
                <span className="text-xs font-mono font-bold tracking-[0.1em] text-slate-500 block mb-4">06 / RESPONSE</span>
                <h3 className="text-xl font-bold tracking-tight mb-3" style={{ color: 'var(--text-primary)' }}>24/7 THREAT DEFENSE</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                  Endpoint isolation, continuous telemetry ingestion, and instant countermeasure execution systems.
                </p>
              </div>
              <div className="mt-8 flex items-center justify-between text-xs font-bold uppercase tracking-[0.15em]" style={{ color: 'var(--color-accent)' }}>
                <span>SOC Operations</span>
                <Activity className="h-4 w-4" />
              </div>
            </div>

          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ═══════════ INTEGRATIONS & PARTNERS ═══════════ */}
      <section ref={(el) => addSectionRef(el, 4)} className="section-sm relative">
        <div className="container">
          <span className="hero-label block mb-8 text-center">VENDORS & TECHNOLOGY STACK</span>
          <div className="reveal grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-8 items-center text-center">
            {['AWS', 'MICROSOFT', 'CLOUDFLARE', 'CROWDSTRIKE', 'APPLE', 'GITHUB'].map((logo, idx) => (
              <div key={idx} className="text-xl font-black tracking-tight text-slate-500 hover:text-white transition-colors duration-300 py-4"
                   style={{ cursor: 'default' }}>
                {logo}
              </div>
            ))}
          </div>
          <div className="reveal mt-12 text-center">
            <a href="#contact" className="btn-outline">
              Partner Integrations
            </a>
          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ═══════════ SERVICES SECTION — "WHAT'S ON OFFER" ═══════════ */}
      <section ref={(el) => addSectionRef(el, 5)} className="section relative" id="services">
        <div className="container">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24 items-start">
            
            {/* Left Col: Sticky Header and Visual Grid */}
            <div className="lg:col-span-5 lg:sticky lg:top-28 reveal space-y-8">
              <div>
                <span className="hero-label text-left block mb-4" style={{ textAlign: 'left' }}>✦ WHAT'S ON OFFER?</span>
                <h2 className="section-headline mb-4">
                  TAILORED SOLUTIONS FOR <span className="accent">ENTERPRISE</span> SYSTEMS
                </h2>
              </div>
              <div className="w-full relative rounded-2xl overflow-hidden" 
                   style={{ border: '1px solid var(--border)', background: 'var(--color-card)' }}>
                <Interactive3DNetwork />
              </div>
            </div>

            {/* Right Col: Numbered List */}
            <div className="lg:col-span-7 reveal space-y-0">
              {[
                { title: 'Cybersecurity & VAPT', link: '/cybersecurity', desc: 'Offensive audits, penetration testing, compliance architecture, SOC management.' },
                { title: 'AI Safety & LLM Audits', link: '/ai-security', desc: 'Neural auditing, prompt injection mitigations, and AI pipeline guardrails.' },
                { title: 'LLC & Business Formation', link: '/business-formation', desc: 'U.S. and UK company registrations, EIN and ITIN acquisitions, banking gateways.' },
                { title: 'Corporate Tax & Compliance', link: '/tax-compliance', desc: 'IRS filing preparations, global VAT audits, GDPR / PCI data security compliance.' },
                { title: 'ReadyTitles Domain Hub', link: '/readytitles', desc: 'Premium domains featuring secure name routing and clustered Anycast networks.' },
                { title: 'Enterprise Web & SaaS Dev', link: '/web-development', desc: 'Bespoke web applications, API pipelines, and high-performance server grids.' }
              ].map((service, index) => (
                <Link key={index} to={service.link} className="numbered-item">
                  <span className="numbered-item-number">{String(index + 1).padStart(2, '0')}</span>
                  <span className="numbered-item-title">{service.title}</span>
                  <span className="numbered-item-desc">{service.desc}</span>
                  <ArrowUpRight className="numbered-item-arrow h-6 w-6" />
                </Link>
              ))}
            </div>

          </div>
        </div>
      </section>

      <div className="divider" />

      {/* ═══════════ CONTACT & EMAIL SCANNER ═══════════ */}
      <section ref={(el) => addSectionRef(el, 6)} className="section relative" id="contact">
        <div className="container">
          
          <div className="text-center mb-16 reveal">
            <h2 className="section-headline text-center mb-4">
              LET'S SEE IF WE'RE THE <span className="accent">RIGHT FIT</span>
            </h2>
            <p className="hero-desc">
              We combine direct communication, technical rigor, and secure infrastructure. Input your details or run a threat scan to initiate contact.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
            
            {/* Contact Form: Left */}
            <div className="lg:col-span-7 reveal p-8 sm:p-10 rounded-2xl"
                 style={{ border: '1px solid var(--border)', background: 'var(--color-card)' }}>
              <div className="mb-8">
                <h3 className="text-2xl font-bold tracking-tight mb-2" style={{ color: 'var(--text-primary)' }}>Submit a Project Brief</h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  Our defensive teams and tax specialists typically respond within 4 hours.
                </p>
              </div>

              <form onSubmit={handleContactSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-[0.1em]" style={{ color: 'var(--text-muted)' }}>Name *</label>
                    <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="glass-input" />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold uppercase tracking-[0.1em]" style={{ color: 'var(--text-muted)' }}>Email *</label>
                    <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@company.com" className="glass-input" />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-[0.1em]" style={{ color: 'var(--text-muted)' }}>Subject *</label>
                  <input type="text" required value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g., Security VAPT, LLC Formation" className="glass-input" />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs font-bold uppercase tracking-[0.1em]" style={{ color: 'var(--text-muted)' }}>Message / Requirements *</label>
                  <textarea required rows={5} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Provide specifications..." className="glass-input resize-none" />
                </div>

                <button type="submit" disabled={formStatus === 'loading'} className="btn-lime w-full text-center flex justify-center items-center gap-2">
                  <Send className="h-4 w-4" />
                  <span>{formStatus === 'loading' ? 'Transmitting brief...' : 'Submit Inquiry'}</span>
                </button>

                {formStatus === 'success' && (
                  <div className="p-4 rounded-xl text-sm font-medium flex items-center gap-2"
                       style={{ backgroundColor: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.15)', color: '#22C55E' }}>
                    <CheckCircle2 className="h-5 w-5 shrink-0" /><span>{formMsg}</span>
                  </div>
                )}
                {formStatus === 'error' && (
                  <div className="p-4 rounded-xl text-sm font-medium flex items-center gap-2"
                       style={{ backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', color: '#EF4444' }}>
                    <AlertTriangle className="h-5 w-5 shrink-0" /><span>{formMsg}</span>
                  </div>
                )}
              </form>
            </div>

            {/* Scanner Tool: Right */}
            <div className="lg:col-span-5 reveal space-y-6">
              
              <div className="p-8 rounded-2xl"
                   style={{ border: '1px solid var(--border)', background: 'var(--color-card)' }}>
                <h3 className="text-xl font-bold tracking-tight mb-2" style={{ color: 'var(--text-primary)' }}>Global Breach Scan</h3>
                <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
                  Instantly verify if your corporate email credentials have been leaked in public darknet databases.
                </p>

                <form onSubmit={handleQuickBreachCheck} className="flex flex-col gap-3">
                  <input type="email" required value={emailCheck} onChange={(e) => setEmailCheck(e.target.value)}
                         placeholder="security-lead@company.com" className="glass-input w-full" />
                  <button type="submit" disabled={checkStatus === 'loading'} className="btn-lime w-full text-center justify-center">
                    {checkStatus === 'loading' ? 'Analyzing registries...' : 'Scan Database'}
                  </button>
                </form>

                {checkStatus === 'breached' && (
                  <div className="mt-4 p-4 rounded-xl text-sm flex items-center gap-2 font-medium"
                       style={{ backgroundColor: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', color: '#EF4444' }}>
                    <AlertTriangle className="h-4 w-4 shrink-0" /><span>{checkMessage}</span>
                  </div>
                )}
                {checkStatus === 'safe' && (
                  <div className="mt-4 p-4 rounded-xl text-sm flex items-center gap-2 font-medium"
                       style={{ backgroundColor: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.15)', color: '#22C55E' }}>
                    <CheckCircle2 className="h-4 w-4 shrink-0" /><span>{checkMessage}</span>
                  </div>
                )}
              </div>

              {/* Operations Box */}
              <div className="p-8 rounded-2xl relative overflow-hidden flex flex-col justify-between"
                   style={{ border: '1px solid var(--border)', background: 'var(--color-accent-glow)', minHeight: '180px' }}>
                <div>
                  <h4 className="text-lg font-bold tracking-tight mb-1" style={{ color: 'var(--text-primary)' }}>Defense Operations</h4>
                  <p className="text-xs" style={{ color: 'var(--text-secondary)' }}>
                    Continuous endpoint monitoring and Anycast server validation are active globally.
                  </p>
                </div>
                <div className="flex items-center gap-2.5 mt-6">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-xs font-mono font-bold tracking-[0.1em]" style={{ color: 'var(--text-primary)' }}>ALL SYSTEMS SECURE & REGULATED</span>
                </div>
              </div>

            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
