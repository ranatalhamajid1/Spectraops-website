import React, { useEffect, useRef } from 'react';

export const CosmicBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let particles: { x: number; y: number; vy: number; vx: number; s: number; o: number; life: number; max: number }[] = [];
    let mouseX = 0.5;
    let mouseY = 0.5;

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };

    const createP = () => ({
      x: Math.random() * canvas.width,
      y: canvas.height + 10,
      vy: -(0.15 + Math.random() * 0.35),
      vx: (Math.random() - 0.5) * 0.2,
      s: 0.8 + Math.random() * 1.2,
      o: 0,
      life: 0,
      max: 400 + Math.random() * 500,
    });

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (particles.length < 40 && Math.random() > 0.94) particles.push(createP());
      particles = particles.filter((p) => p.life < p.max);

      particles.forEach((p) => {
        p.x += p.vx; p.y += p.vy; p.life++;
        const prog = p.life / p.max;
        p.o = prog < 0.1 ? prog / 0.1 : prog > 0.8 ? (1 - prog) / 0.2 : 1;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.s, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(212, 255, 0, ${p.o * 0.25})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(animate);
    };

    const onMouse = (e: MouseEvent) => {
      mouseX = e.clientX / window.innerWidth;
      mouseY = e.clientY / window.innerHeight;
      const glow = document.getElementById('hero-glow');
      if (glow) {
        const x = (mouseX - 0.5) * 60;
        const y = (mouseY - 0.5) * 60;
        glow.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
      }
    };

    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouse);
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouse);
    };
  }, []);

  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden z-0" style={{ background: 'var(--black)' }}>
      {/* Canvas particles */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ opacity: 0.7 }} />

      {/* MASSIVE lime glow — 1200px — Blackbird exact */}
      <div
        id="hero-glow"
        className="absolute animate-pulse-glow"
        style={{
          top: '25%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '1200px', height: '1200px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(212, 255, 0, 0.15) 0%, rgba(200, 240, 0, 0.06) 35%, rgba(180, 220, 0, 0.02) 55%, transparent 70%)',
          filter: 'blur(40px)',
          transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      />

      {/* Secondary warm glow offset */}
      <div className="absolute" style={{
        top: '60%', right: '-5%',
        width: '600px', height: '600px', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(212, 255, 0, 0.04) 0%, transparent 70%)',
        filter: 'blur(80px)',
      }} />

      {/* Soft vignette */}
      <div className="absolute inset-0" style={{
        background: 'radial-gradient(ellipse at center, transparent 40%, rgba(5, 5, 5, 0.6) 100%)',
      }} />

      {/* Film grain overlay */}
      <div className="film-grain" />
    </div>
  );
};

export default CosmicBackground;
