import React from 'react';
import { Shield } from 'lucide-react';

const Linkedin: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

interface TeamMember {
  name: string;
  role: string;
  image: string;
  linkedin: string;
}

export const Team: React.FC = () => {
  const ceo: TeamMember = {
    name: 'Zohaib Ahmad Tariq',
    role: 'Chief Executive Officer',
    image: '/team/CEO.jpg',
    linkedin: 'https://linkedin.com/in/zohaib-ahmad-tariq'
  };

  const cLevel: TeamMember[] = [
    {
      name: 'Ali Haider',
      role: 'Chief Operating Officer',
      image: '/team/ali-haider.jpg',
      linkedin: 'https://www.linkedin.com/in/ali-haider-96394b2b3'
    },
    {
      name: 'Rana Talha Majid',
      role: 'Chief Technology Officer',
      image: '/team/talha.jpg',
      linkedin: 'https://www.linkedin.com/in/rana-muhammad-talha-majid-25233228b'
    },
    {
      name: 'Abdullah',
      role: 'Chief Financial Officer',
      image: '/team/abdullah.jpg',
      linkedin: 'https://www.linkedin.com/in/abdullah-jamil-798105351?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app'
    }
  ];

  const seniorLeadership: TeamMember[] = [
    {
      name: 'Jamshaid Fareed',
      role: 'Chief Information Security Officer',
      image: '/team/jamshed.jpg',
      linkedin: 'https://www.linkedin.com/in/jamshaid-fareed-95706a317?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app'
    },
    {
      name: 'Rao Asad',
      role: 'Chief Marketing Officer',
      image: '/team/rao-asad.jpg',
      linkedin: 'https://www.linkedin.com/in/rao-asad-665605226?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app'
    },
    {
      name: 'Muhammad Ammar',
      role: 'Country Head',
      image: '/team/ammar.jpg',
      linkedin: 'https://www.linkedin.com/in/muhammad-ammmar'
    }
  ];

  return (
    <div className="relative pt-28 pb-24 cyber-grid min-h-screen">
      {/* Background radial glow */}
      <div className="aurora-bg aurora-blue top-40 left-0"></div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10 space-y-20">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mt-12 space-y-6">
          <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 bg-white/5 border border-slate-200 dark:border-white/10 rounded-full text-xs font-semibold tracking-wide backdrop-blur-md">
            <Shield className="h-3.5 w-3.5" style={{ color: 'var(--color-accent)' }} />
            <span style={{ color: 'var(--text-secondary)' }}>THE BRAINS BEHIND SPECTRAOPS</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-none uppercase italic">
            MEET THE <span className="bg-gradient-to-r from-cyber-accent to-cyber-glow bg-clip-text text-transparent" style={{ backgroundImage: 'linear-gradient(135deg, var(--color-accent), var(--color-accent))' }}>EXPERTS</span> SECURING YOUR FUTURE
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed italic">
            Protecting organizations with offensive security, compliance strategy, corporate formation, and AI safety audits globally.
          </p>
        </div>

        {/* Executive Level (CEO) */}
        <div className="space-y-6 text-center">
          <h2 className="text-xs font-bold tracking-[0.2em] text-slate-500 uppercase">Executive Leadership</h2>
          <div className="max-w-xs mx-auto">
            <div className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-white/5 relative overflow-hidden group hover:border-slate-300 dark:hover:border-white/15">
              <div className="w-full aspect-[4/5] overflow-hidden rounded-xl mb-6 relative bg-slate-900/10">
                <img 
                  src={ceo.image} 
                  alt={ceo.name} 
                  className="w-full h-full object-cover filter grayscale contrast-110 group-hover:grayscale-0 transition-all duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                  <a 
                    href={ceo.linkedin} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="p-3 rounded-full hover:scale-110 transition-transform duration-300 shadow-glow"
                    style={{ backgroundColor: 'var(--color-accent)', color: '#050505' }}
                    title={`View ${ceo.name}'s LinkedIn Profile`}
                  >
                    <Linkedin className="h-5 w-5" />
                  </a>
                </div>
              </div>
              <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white mb-1">{ceo.name}</h3>
              <p className="text-xs font-mono font-bold tracking-wider uppercase" style={{ color: 'var(--color-accent)' }}>
                {ceo.role}
              </p>
            </div>
          </div>
        </div>

        {/* C-Level */}
        <div className="space-y-8">
          <h2 className="text-xs font-bold tracking-[0.2em] text-slate-500 uppercase text-center">C-Level Administration</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {cLevel.map((member) => (
              <div key={member.name} className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-white/5 relative overflow-hidden group hover:border-slate-300 dark:hover:border-white/15">
                <div className="w-full aspect-[4/5] overflow-hidden rounded-xl mb-6 relative bg-slate-900/10">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover filter grayscale contrast-110 group-hover:grayscale-0 transition-all duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                    <a 
                      href={member.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="p-3 rounded-full hover:scale-110 transition-transform duration-300 shadow-glow"
                      style={{ backgroundColor: 'var(--color-accent)', color: '#050505' }}
                      title={`View ${member.name}'s LinkedIn Profile`}
                    >
                      <Linkedin className="h-5 w-5" />
                    </a>
                  </div>
                </div>
                <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white mb-1">{member.name}</h3>
                <p className="text-xs font-mono font-bold tracking-wider uppercase" style={{ color: 'var(--color-accent)' }}>
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Senior Leadership */}
        <div className="space-y-8">
          <h2 className="text-xs font-bold tracking-[0.2em] text-slate-500 uppercase text-center">Senior Leadership</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {seniorLeadership.map((member) => (
              <div key={member.name} className="glass-panel p-6 rounded-2xl border border-slate-200 dark:border-white/5 relative overflow-hidden group hover:border-slate-300 dark:hover:border-white/15">
                <div className="w-full aspect-[4/5] overflow-hidden rounded-xl mb-6 relative bg-slate-900/10">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover filter grayscale contrast-110 group-hover:grayscale-0 transition-all duration-500" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                    <a 
                      href={member.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="p-3 rounded-full hover:scale-110 transition-transform duration-300 shadow-glow"
                      style={{ backgroundColor: 'var(--color-accent)', color: '#050505' }}
                      title={`View ${member.name}'s LinkedIn Profile`}
                    >
                      <Linkedin className="h-5 w-5" />
                    </a>
                  </div>
                </div>
                <h3 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white mb-1">{member.name}</h3>
                <p className="text-xs font-mono font-bold tracking-wider uppercase" style={{ color: 'var(--color-accent)' }}>
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Team;
