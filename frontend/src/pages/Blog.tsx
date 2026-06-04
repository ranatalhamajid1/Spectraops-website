import React, { useState, useEffect } from 'react';
import { BookOpen, Search, ArrowRight, ShieldCheck, Mail, CheckCircle2, AlertCircle } from 'lucide-react';
import { makeApiRequest } from '../services/api';

interface Post {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  category: string;
  author: string;
  published_at: string;
}

export const Blog: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [email, setEmail] = useState('');
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [subscribeMsg, setSubscribeMsg] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await makeApiRequest('/blog', 'GET');
        if (res.success && Array.isArray(res.posts)) {
          setPosts(res.posts);
        } else {
          // Fallback static posts matching the upgraded categories
          setPosts([
            {
              id: 1,
              title: 'Exploiting LLM Agents via RAG Injection Pipelines',
              slug: 'exploiting-llm-agents-via-rag-injection',
              excerpt: 'Deep-dive security research mapping context injection models in vector search datasets, exposing bypasses of safety filters.',
              content: '',
              category: 'Research Hub',
              author: 'SpectraOps Research Labs',
              published_at: '2026-06-01'
            },
            {
              id: 2,
              title: 'Security Advisory: CVE-2026-9281 Active Directory Bypass',
              slug: 'security-advisory-cve-2026-9281-active-directory',
              excerpt: 'Critical security advisory concerning authentication bypass flaws inside enterprise directory services. Mitigation guidelines attached.',
              content: '',
              category: 'Security Advisories',
              author: 'Offensive Response Team',
              published_at: '2026-05-28'
            },
            {
              id: 3,
              title: 'Handbook: Achieving PCI-DSS v4.0 Logging Compliance',
              slug: 'achieving-pci-dss-v4-logging-compliance',
              excerpt: 'Comprehensive engineering whitepaper mapping syslog ingestion rules, audit paths, and retention models for compliance.',
              content: '',
              category: 'Whitepapers',
              author: 'Compliance Architects',
              published_at: '2026-05-22'
            },
            {
              id: 4,
              title: 'Tutorial: Programmatic Stripe Checkout & Webhooks Setup',
              slug: 'tutorial-programmatic-stripe-checkout-webhooks',
              excerpt: 'Step-by-step developer tutorial implementing robust webhook signature checks and database updates inside Express.js backend routers.',
              content: '',
              category: 'Tutorials',
              author: 'SaaS Engineering Team',
              published_at: '2026-05-15'
            },
            {
              id: 5,
              title: 'EU AI Act Enforcement Deadlines & Compliance Roadmaps',
              slug: 'eu-ai-act-enforcement-deadlines-compliance-roadmaps',
              excerpt: 'Industry news outline detailing risk categories, regulatory audits, and penalty matrix guidelines of the newly approved legislation.',
              content: '',
              category: 'Industry News',
              author: 'Corporate Governance Group',
              published_at: '2026-05-10'
            }
          ]);
        }
      } catch (err) {
        console.error('Failed to load posts', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribeStatus('loading');
    setSubscribeMsg('');

    try {
      const res = await makeApiRequest('/crm/leads', 'POST', {
        name: 'Newsletter Subscriber',
        email,
        subject: 'Newsletter Subscription',
        message: 'User subscribed to threat intelligence newsletter feed.',
        source: 'newsletter_signup'
      });
      if (res.success) {
        setSubscribeStatus('success');
        setSubscribeMsg('Thank you for subscribing to our threat intelligence and regulatory feeds.');
        setEmail('');
      } else {
        throw new Error(res.error || 'Failed to subscribe.');
      }
    } catch (err: unknown) {
      setSubscribeStatus('error');
      setSubscribeMsg(err instanceof Error ? err.message : 'An error occurred.');
    }
  };

  const categories = ['All', 'Research Hub', 'Security Advisories', 'Whitepapers', 'Tutorials', 'Industry News'];

  const filteredPosts = posts.filter((post) => {
    const matchesSearch = post.title.toLowerCase().includes(search.toLowerCase()) || 
                           post.excerpt.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || post.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="relative pt-20 pb-24 cyber-grid min-h-screen">
      <div className="aurora-bg aurora-blue top-40 right-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mt-12 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-white/5 border border-slate-200 dark:border-white/10 rounded-full text-xs text-cyber-accent font-semibold tracking-wide backdrop-blur-md">
            <BookOpen className="h-3.5 w-3.5 text-cyber-accent" />
            <span>SPECTRAOPS COMMUNICATIONS & RESEARCH</span>
          </div>
          <h1 className="text-4xl font-extrabold font-heading  text-slate-900 dark:text-white tracking-tight">
            Threat Intelligence &<br />
            <span className="bg-gradient-to-r from-cyber-accent to-cyber-glow bg-clip-text text-transparent">
              Corporate Advisories
            </span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm max-w-xl mx-auto">
            Deep-dives on vulnerability exploitation vectors, global tax compliance, and developer tutorials.
          </p>
        </div>

        {/* Filter & Search Controls */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5 glass-panel p-4 rounded-xl border border-slate-200 dark:border-white/5">
          {/* Categories */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                  selectedCategory === cat
                    ? 'bg-cyber-accent text-white shadow-glow'
                    : 'bg-white/5 text-slate-600 dark:text-slate-400 hover:text-white border border-slate-200 dark:border-white/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search articles..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-white/5 border border-slate-200 dark:border-white/10 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyber-accent transition-all"
            />
          </div>
        </div>

        {/* Posts Grid */}
        {loading ? (
          <div className="text-center py-20 text-slate-600 dark:text-slate-400 font-semibold text-sm">
            Retrieving articles...
          </div>
        ) : filteredPosts.length === 0 ? (
          <div className="text-center py-20 text-slate-500 text-sm">
            No articles found matching your search.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post) => (
              <article key={post.id} className="glass-panel rounded-2xl border border-slate-200 dark:border-white/5 overflow-hidden hover:border-cyber-accent/20 transition-all duration-300 flex flex-col justify-between group">
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between text-[10px] text-cyber-accent font-extrabold uppercase tracking-wider">
                    <span>{post.category}</span>
                    <span className="text-slate-500 font-normal">{post.published_at}</span>
                  </div>
                  <h3 className="text-base font-heading font-extrabold text-slate-900 dark:text-white group-hover:text-cyber-accent transition-all line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed line-clamp-3">
                    {post.excerpt}
                  </p>
                </div>
                <div className="p-6 pt-0 border-t border-slate-200 dark:border-white/5 flex items-center justify-between mt-auto">
                  <span className="text-[10px] text-slate-500 font-bold">By {post.author}</span>
                  <span className="inline-flex items-center space-x-1 text-xs text-cyber-accent font-bold group-hover:translate-x-1 transition-transform cursor-pointer">
                    <span>Read Article</span>
                    <ArrowRight className="h-3 w-3" />
                  </span>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* Newsletter Section */}
        <div className="glass-panel rounded-3xl p-8 md:p-12 border border-slate-200 dark:border-white/10 relative overflow-hidden">
          <div className="aurora-bg aurora-purple -bottom-20 -right-20"></div>
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center space-x-2 px-2.5 py-1 bg-white/5 border border-slate-200 dark:border-white/10 rounded-full text-[9px] text-cyber-glow font-extrabold tracking-widest uppercase">
                <ShieldCheck className="h-3.5 w-3.5 text-cyber-glow" />
                <span>THREAT INTELLIGENCE FEED</span>
              </div>
              <h2 className="text-2xl font-heading font-extrabold text-slate-900 dark:text-white">Subscribe to Security Advisories</h2>
              <p className="text-slate-600 dark:text-slate-400 text-xs max-w-lg leading-relaxed">
                Stay updated with technical reports on zero-day vulnerability threats, business compliance updates, and SaaS engineering roadmaps.
              </p>
            </div>
            <div className="lg:col-span-5">
              <form onSubmit={handleSubscribe} className="space-y-3">
                <div className="relative flex items-center">
                  <Mail className="absolute left-3.5 h-4 w-4 text-slate-500" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full pl-10 pr-32 py-3.5 bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyber-accent"
                  />
                  <button
                    type="submit"
                    disabled={subscribeStatus === 'loading'}
                    className="absolute right-1.5 px-5 py-2 bg-gradient-to-r from-cyber-accent to-cyber-glow text-white font-bold rounded-lg text-[10px] hover:brightness-115 disabled:opacity-50 transition-all"
                  >
                    {subscribeStatus === 'loading' ? 'Joining...' : 'Subscribe'}
                  </button>
                </div>

                {subscribeStatus === 'success' && (
                  <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-lg text-xs flex items-center space-x-2">
                    <CheckCircle2 className="h-4 w-4 shrink-0" />
                    <span>{subscribeMsg}</span>
                  </div>
                )}
                {subscribeStatus === 'error' && (
                  <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-lg text-xs flex items-center space-x-2">
                    <AlertCircle className="h-4 w-4 shrink-0" />
                    <span>{subscribeMsg}</span>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Blog;
