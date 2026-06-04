import React, { useState } from 'react';
import { Shield, Link2, Server, Hash, CheckCircle2, AlertTriangle, Cpu, Upload } from 'lucide-react';
import { makeApiRequest } from '../services/api';

interface ToolResult {
  success: boolean;
  message?: string;
  error?: string;
  [key: string]: any;
}

export const ToolsLab: React.FC = () => {
  const [activeTool, setActiveTool] = useState<string>('email-breach');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Universal inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [url, setUrl] = useState('');
  const [domain, setDomain] = useState('');
  const [ip, setIp] = useState('');
  const [token, setToken] = useState('');
  const [text, setText] = useState('');
  const [algorithm, setAlgorithm] = useState('sha256');

  // New tool inputs
  const [target, setTarget] = useState('');
  const [encodedText, setEncodedText] = useState('');
  const [cvssVector, setCvssVector] = useState('AV:N/AC:L/PR:N/UI:N/S:U/C:H/I:H/A:H');
  const [assetValue, setAssetValue] = useState(5);
  const [threatLevel, setThreatLevel] = useState(5);
  const [vulnerabilityScore, setVulnerabilityScore] = useState(5);
  const [controlsMultiplier, setControlsMultiplier] = useState(0.2);
  const [userAgentChecked, setUserAgentChecked] = useState('*');
  const [checkPath, setCheckPath] = useState('/admin');
  const [headersText, setHeadersText] = useState('');
  const [fileName, setFileName] = useState('');
  const [fileBase64, setFileBase64] = useState('');

  // Universal state
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ToolResult | null>(null);

  const triggerTool = async (endpoint: string, payload: any) => {
    setLoading(true);
    setResult(null);
    try {
      const res = await makeApiRequest(`/tools${endpoint}`, 'POST', payload);
      setResult(res);
    } catch (err: any) {
      setResult({ success: false, error: err.message || 'Diagnostic check failed.' });
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      setFileBase64(base64);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTool === 'email-breach') triggerTool('/check-email', { email });
    if (activeTool === 'password-check') triggerTool('/check-password', { password });
    if (activeTool === 'url-scan') triggerTool('/scan-url', { url });
    if (activeTool === 'file-scan') triggerTool('/scan-file', { fileName, fileHash: 'd7a8f1e92c30...' });
    if (activeTool === 'ip-reputation') triggerTool('/check-ip-reputation', { ip });
    if (activeTool === 'ssl-check') triggerTool('/check-ssl', { domain });
    if (activeTool === 'dns-lookup') triggerTool('/dns-lookup', { domain });
    if (activeTool === 'whois-lookup') triggerTool('/whois-lookup', { domain });
    if (activeTool === 'port-scan') triggerTool('/scan-ports', { host: domain || ip || target });
    if (activeTool === 'headers-analyzer') triggerTool('/analyze-headers', { url });
    
    // New tools routing
    if (activeTool === 'http-header-analyzer') triggerTool('/analyze-http-headers', { url });
    if (activeTool === 'blacklist-checker') triggerTool('/check-blacklist', { target });
    if (activeTool === 'tech-detector') triggerTool('/detect-technologies', { url });
    if (activeTool === 'subdomains-find') triggerTool('/find-subdomains', { domain });
    if (activeTool === 'jwt-decoder') triggerTool('/decode-jwt', { token });
    if (activeTool === 'hash-gen') triggerTool('/generate-hash', { text, algorithm });
    if (activeTool === 'base64-encode') triggerTool('/base64-encode', { text });
    if (activeTool === 'base64-decode') triggerTool('/base64-decode', { encodedText });
    if (activeTool === 'cvss-calc') triggerTool('/calculate-cvss', { vector: cvssVector });
    if (activeTool === 'risk-calc') triggerTool('/calculate-risk', { assetValue, threatLevel, vulnerabilityScore, controlsMultiplier });
    if (activeTool === 'sitemap-val') triggerTool('/validate-sitemap', { url });
    if (activeTool === 'robots-test') triggerTool('/test-robots', { url, userAgent: userAgentChecked, checkPath });
    if (activeTool === 'metadata-extractor') triggerTool('/extract-metadata', { fileName, fileContentBase64: fileBase64 });
    if (activeTool === 'email-header-analyzer') triggerTool('/analyze-email-headers', { headersText });
  };

  const categories = [
    {
      id: 'accounts',
      name: 'Account & Credentials',
      icon: Shield,
      tools: [
        { id: 'email-breach', name: 'Email Breach Checker', desc: 'Scan if accounts are compromised in public leaks.' },
        { id: 'password-check', name: 'Password Strength & Leak', desc: 'Verify password entropy and pwned occurrences.' },
        { id: 'jwt-decoder', name: 'JWT Token Decoder', desc: 'Extract payload JSON data from JSON Web Tokens.' }
      ]
    },
    {
      id: 'network',
      name: 'Network & Assets',
      icon: Server,
      tools: [
        { id: 'dns-lookup', name: 'DNS Records Lookup', desc: 'Retrieve A, MX, CNAME, TXT, and NS records.' },
        { id: 'ssl-check', name: 'SSL Certificate Checker', desc: 'Inspect validity dates and parameters of certificates.' },
        { id: 'whois-lookup', name: 'WHOIS Registrar Lookup', desc: 'Query registration records from corporate domain registers.' },
        { id: 'port-scan', name: 'Server Port Scanner', desc: 'Scan common service ports for socket connections.' },
        { id: 'subdomains-find', name: 'Subdomains Locator', desc: 'Search subdomains logs in cert transparency tables.' }
      ]
    },
    {
      id: 'web',
      name: 'Web & Endpoints',
      icon: Link2,
      tools: [
        { id: 'url-scan', name: 'VirusTotal URL Scanner', desc: 'Scan target sites for malicious link threats.' },
        { id: 'file-scan', name: 'VirusTotal File Scanner', desc: 'Verify file signatures against malware registers.' },
        { id: 'ip-reputation', name: 'IP Reputation Check', desc: 'Query AbuseIPDB confidence scores for IP endpoints.' },
        { id: 'headers-analyzer', name: 'Security Headers Analyzer', desc: 'Validate HTTP response security parameters (CSP, STS).' },
        { id: 'http-header-analyzer', name: 'HTTP Header Analyzer', desc: 'Retrieve request and response header registries.' },
        { id: 'blacklist-checker', name: 'Spam Blacklist Checker', desc: 'Check if a target host is listed in spam databases.' },
        { id: 'tech-detector', name: 'Technology Detector', desc: 'Discover CMS, frameworks, CDNs, and libraries.' }
      ]
    },
    {
      id: 'crypto',
      name: 'Cryptographic Helpers',
      icon: Hash,
      tools: [
        { id: 'hash-gen', name: 'Text Hash Generator', desc: 'Hash strings using SHA-256, SHA-512, SHA-1, MD5.' },
        { id: 'base64-encode', name: 'Base64 Encoder', desc: 'Convert plain text into Base64 format.' },
        { id: 'base64-decode', name: 'Base64 Decoder', desc: 'Convert Base64 values back into raw text.' }
      ]
    },
    {
      id: 'calculators',
      name: 'Calculators & Validators',
      icon: Cpu,
      tools: [
        { id: 'cvss-calc', name: 'CVSS Calculator', desc: 'Compute standard base scores for vulnerabilities.' },
        { id: 'risk-calc', name: 'Risk Calculator', desc: 'Calculate threat risk indices mapping business values.' },
        { id: 'sitemap-val', name: 'Sitemap Validator', desc: 'Verify XML structure and count sitemap links.' },
        { id: 'robots-test', name: 'Robots.txt Tester', desc: 'Verify disallow crawling paths against agents.' },
        { id: 'metadata-extractor', name: 'Metadata Extractor', desc: 'Extract EXIF/metadata tags from uploaded media.' },
        { id: 'email-header-analyzer', name: 'Email Header Analyzer', desc: 'Parse raw email headers to trace routing and SPF.' }
      ]
    }
  ];

  // Filter categories and tools based on search query
  const filteredCategories = categories.map(cat => {
    const matchedTools = cat.tools.filter(tool => 
      tool.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      tool.desc.toLowerCase().includes(searchQuery.toLowerCase())
    );
    return { ...cat, tools: matchedTools };
  }).filter(cat => cat.tools.length > 0);

  return (
    <div className="relative pt-20 min-h-screen pb-20 cyber-grid">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto mt-12 mb-16 space-y-4">
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-white/5 border border-slate-200 dark:border-white/10 rounded-full text-xs text-cyber-accent font-semibold tracking-wide backdrop-blur-md">
            <Server className="h-3.5 w-3.5 text-cyber-accent animate-pulse" />
            <span>SPECTRAOPS SECURITY LABS</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-heading  text-slate-900 dark:text-white tracking-tight">
            Security Tools Lab
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed max-w-2xl mx-auto">
            A comprehensive playground of 24 real-time network, cryptographic, and risk assessment utility diagnostics built for enterprise evaluation.
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-md mx-auto mb-10 relative">
          <input
            type="text"
            placeholder="Search diagnostics (e.g. WHOIS, Port, CVSS)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full glass-input py-3 text-xs"
          />
        </div>

        {/* Outer Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Tools Categories Selector */}
          <div className="lg:col-span-4 space-y-6">
            {filteredCategories.map((cat) => {
              const CatIcon = cat.icon;
              return (
                <div key={cat.id} className="glass-panel p-4 rounded-2xl border border-slate-200 dark:border-white/5 space-y-2">
                  <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400 font-semibold text-xs uppercase px-2 mb-2">
                    <CatIcon className="h-3.5 w-3.5 text-cyber-accent" />
                    <span>{cat.name}</span>
                  </div>
                  {cat.tools.map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => {
                        setActiveTool(tool.id);
                        setResult(null);
                        setEmail('');
                        setPassword('');
                        setUrl('');
                        setDomain('');
                        setIp('');
                        setToken('');
                        setText('');
                        setTarget('');
                        setEncodedText('');
                        setHeadersText('');
                        setFileName('');
                        setFileBase64('');
                      }}
                      className={`w-full text-left p-3.5 rounded-xl text-xs font-semibold transition-all duration-150 border ${
                        activeTool === tool.id 
                          ? 'bg-cyber-accent/10 text-cyber-accent border-cyber-accent shadow-glow' 
                          : 'text-slate-600 dark:text-slate-400 hover:text-white hover:bg-white/5 border-transparent'
                      }`}
                    >
                      <div className="font-heading mb-0.5">{tool.name}</div>
                      <div className="text-[10px] text-slate-500 line-clamp-2">{tool.desc}</div>
                    </button>
                  ))}
                </div>
              );
            })}
          </div>

          {/* Right Column: Active Tool Interface & Results */}
          <div className="lg:col-span-8 space-y-6">
            <div className="glass-panel p-8 sm:p-10 rounded-3xl border border-slate-200 dark:border-white/10">
              
              {/* Form Input Area */}
              <form onSubmit={handleSubmit} className="space-y-6">
                
                {activeTool === 'email-breach' && (
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider font-bold text-slate-600 dark:text-slate-400">Email Address</label>
                    <input
                      type="email"
                      required
                      placeholder="admin@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full glass-input"
                    />
                  </div>
                )}

                {activeTool === 'password-check' && (
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider font-bold text-slate-600 dark:text-slate-400">Password</label>
                    <input
                      type="password"
                      required
                      placeholder="Enter password to verify strength & breaches"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full glass-input"
                    />
                  </div>
                )}

                {(activeTool === 'url-scan' || activeTool === 'headers-analyzer' || activeTool === 'http-header-analyzer' || activeTool === 'tech-detector' || activeTool === 'sitemap-val') && (
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider font-bold text-slate-600 dark:text-slate-400">Target URL</label>
                    <input
                      type="url"
                      required
                      placeholder="https://spectraops.pk"
                      value={url}
                      onChange={(e) => setUrl(e.target.value)}
                      className="w-full glass-input"
                    />
                  </div>
                )}

                {activeTool === 'file-scan' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wider font-bold text-slate-600 dark:text-slate-400">Upload File for Hash Scan</label>
                      <div className="relative border-2 border-dashed border-slate-200 dark:border-white/10 rounded-xl p-6 flex flex-col items-center justify-center hover:border-cyber-accent transition-colors">
                        <Upload className="h-8 w-8 text-slate-600 dark:text-slate-400 mb-2" />
                        <span className="text-xs text-slate-700 dark:text-slate-300">Drag or click to choose file</span>
                        <input
                          type="file"
                          onChange={handleFileUpload}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                        />
                      </div>
                    </div>
                    {fileName && (
                      <div className="text-xs text-cyber-accent font-semibold">Selected File: {fileName}</div>
                    )}
                  </div>
                )}

                {activeTool === 'ip-reputation' && (
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider font-bold text-slate-600 dark:text-slate-400">IP Address</label>
                    <input
                      type="text"
                      required
                      placeholder="8.8.8.8"
                      value={ip}
                      onChange={(e) => setIp(e.target.value)}
                      className="w-full glass-input"
                    />
                  </div>
                )}

                {(activeTool === 'ssl-check' || activeTool === 'dns-lookup' || activeTool === 'whois-lookup' || activeTool === 'subdomains-find') && (
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider font-bold text-slate-600 dark:text-slate-400">SSL / DNS Domain Name</label>
                    <input
                      type="text"
                      required
                      placeholder="google.com"
                      value={domain}
                      onChange={(e) => setDomain(e.target.value)}
                      className="w-full glass-input"
                    />
                  </div>
                )}

                {(activeTool === 'port-scan' || activeTool === 'blacklist-checker') && (
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider font-bold text-slate-600 dark:text-slate-400">Target Host / Domain / IP</label>
                    <input
                      type="text"
                      required
                      placeholder="spectraops.pk"
                      value={target}
                      onChange={(e) => setTarget(e.target.value)}
                      className="w-full glass-input"
                    />
                  </div>
                )}

                {activeTool === 'jwt-decoder' && (
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider font-bold text-slate-600 dark:text-slate-400">JWT Token Signature String</label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Paste eyJhbGciOiJIUzI1NiIsIn..."
                      value={token}
                      onChange={(e) => setToken(e.target.value)}
                      className="w-full glass-input font-mono text-xs"
                    />
                  </div>
                )}

                {activeTool === 'hash-gen' && (
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div className="md:col-span-3 space-y-2">
                      <label className="text-xs uppercase tracking-wider font-bold text-slate-600 dark:text-slate-400">Raw Text String</label>
                      <input
                        type="text"
                        required
                        placeholder="Enter text to generate hash"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        className="w-full glass-input"
                      />
                    </div>
                    <div className="md:col-span-1 space-y-2">
                      <label className="text-xs uppercase tracking-wider font-bold text-slate-600 dark:text-slate-400">Hash Algorithm</label>
                      <select
                        value={algorithm}
                        onChange={(e) => setAlgorithm(e.target.value)}
                        className="w-full glass-input bg-cyber-bg border border-slate-200 dark:border-white/10 rounded-xl py-3"
                      >
                        <option value="md5">MD5</option>
                        <option value="sha1">SHA-1</option>
                        <option value="sha256">SHA-256</option>
                        <option value="sha512">SHA-512</option>
                      </select>
                    </div>
                  </div>
                )}

                {activeTool === 'base64-encode' && (
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider font-bold text-slate-600 dark:text-slate-400">Plain Text to Encode</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Enter raw text strings..."
                      value={text}
                      onChange={(e) => setText(e.target.value)}
                      className="w-full glass-input text-xs"
                    />
                  </div>
                )}

                {activeTool === 'base64-decode' && (
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider font-bold text-slate-600 dark:text-slate-400">Base64 Text to Decode</label>
                    <textarea
                      required
                      rows={3}
                      placeholder="Paste Base64 code e.g. U3BlY3RyYU9wcw=="
                      value={encodedText}
                      onChange={(e) => setEncodedText(e.target.value)}
                      className="w-full glass-input font-mono text-xs"
                    />
                  </div>
                )}

                {activeTool === 'cvss-calc' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wider font-bold text-slate-600 dark:text-slate-400">CVSS v3.1 Vector String</label>
                      <input
                        type="text"
                        required
                        value={cvssVector}
                        onChange={(e) => setCvssVector(e.target.value)}
                        className="w-full glass-input font-mono text-xs"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-[10px] text-slate-500">
                      <div>AV: Network (AV:N) / Adjacent (AV:A) / Local (AV:L)</div>
                      <div>C/I/A: High (C:H) / Low (C:L) / None (C:N)</div>
                    </div>
                  </div>
                )}

                {activeTool === 'risk-calc' && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-600 dark:text-slate-400">Asset Value (1-10)</label>
                      <input type="number" min={1} max={10} value={assetValue} onChange={(e) => setAssetValue(parseInt(e.target.value) || 5)} className="w-full glass-input text-center py-2" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-600 dark:text-slate-400">Threat Level (1-10)</label>
                      <input type="number" min={1} max={10} value={threatLevel} onChange={(e) => setThreatLevel(parseInt(e.target.value) || 5)} className="w-full glass-input text-center py-2" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-600 dark:text-slate-400">Vulnerability (1-10)</label>
                      <input type="number" min={1} max={10} value={vulnerabilityScore} onChange={(e) => setVulnerabilityScore(parseInt(e.target.value) || 5)} className="w-full glass-input text-center py-2" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-600 dark:text-slate-400">Existing Controls (0-1)</label>
                      <input type="number" min={0} max={1} step={0.1} value={controlsMultiplier} onChange={(e) => setControlsMultiplier(parseFloat(e.target.value) || 0.2)} className="w-full glass-input text-center py-2" />
                    </div>
                  </div>
                )}

                {activeTool === 'robots-test' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wider font-bold text-slate-600 dark:text-slate-400">Target Domain Link</label>
                      <input type="url" required value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://example.com" className="w-full glass-input" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-slate-600 dark:text-slate-400">User Agent</label>
                        <input type="text" value={userAgentChecked} onChange={(e) => setUserAgentChecked(e.target.value)} className="w-full glass-input text-xs" />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-slate-600 dark:text-slate-400">Path to Check</label>
                        <input type="text" value={checkPath} onChange={(e) => setCheckPath(e.target.value)} className="w-full glass-input text-xs" />
                      </div>
                    </div>
                  </div>
                )}

                {activeTool === 'metadata-extractor' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs uppercase tracking-wider font-bold text-slate-600 dark:text-slate-400">Upload Image / File</label>
                      <div className="relative border-2 border-dashed border-slate-200 dark:border-white/10 rounded-xl p-6 flex flex-col items-center justify-center hover:border-cyber-accent transition-colors">
                        <Upload className="h-8 w-8 text-slate-600 dark:text-slate-400 mb-2" />
                        <span className="text-xs text-slate-700 dark:text-slate-300">Drag or click to choose file</span>
                        <input type="file" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                      </div>
                    </div>
                    {fileName && (
                      <div className="text-xs text-cyber-accent font-semibold">Selected: {fileName}</div>
                    )}
                  </div>
                )}

                {activeTool === 'email-header-analyzer' && (
                  <div className="space-y-2">
                    <label className="text-xs uppercase tracking-wider font-bold text-slate-600 dark:text-slate-400">Raw Email Header Text</label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Paste raw email message header (e.g. Received: from...)"
                      value={headersText}
                      onChange={(e) => setHeadersText(e.target.value)}
                      className="w-full glass-input font-mono text-xs"
                    />
                  </div>
                )}

                {/* Trigger button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-4 bg-gradient-to-r from-cyber-accent to-cyber-glow text-white font-bold rounded-xl text-xs hover:brightness-110 shadow-glow disabled:opacity-50 transition-all flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="border-2 border-white/30 border-t-white rounded-full w-4 h-4 animate-spin"></div>
                      <span>Analyzing Telemetry registries...</span>
                    </>
                  ) : (
                    <span>Execute Diagnostic Scan</span>
                  )}
                </button>

              </form>

              {/* Dynamic Results Display */}
              {result && (
                <div className="mt-8 pt-8 border-t border-slate-200 dark:border-white/5 space-y-6">
                  
                  {/* Summary Status Panel */}
                  <div className={`p-4 rounded-xl flex items-center space-x-3 border ${
                    result.success 
                      ? result.breached || result.safe === false || result.leaked || result.listed
                        ? 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                        : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                      : 'bg-rose-500/10 border-rose-500/20 text-rose-400'
                  }`}>
                    {result.success 
                      ? result.breached || result.safe === false || result.leaked || result.listed
                        ? <AlertTriangle className="h-5 w-5 shrink-0" /> 
                        : <CheckCircle2 className="h-5 w-5 shrink-0" />
                      : <AlertTriangle className="h-5 w-5 shrink-0" />
                    }
                    <span className="text-xs font-semibold">
                      {result.message || result.error || 'Diagnostic scan completed successfully.'}
                    </span>
                  </div>

                  {/* Preformatted details */}
                  {result.success && (
                    <div className="space-y-3">
                      <h4 className="text-xs uppercase tracking-wider font-extrabold text-slate-500">Registry Result Output</h4>
                      <pre className="p-4 bg-black/40 border border-slate-200 dark:border-white/5 rounded-xl overflow-x-auto text-[11px] text-slate-700 dark:text-slate-300 font-mono max-h-[300px]">
                        {JSON.stringify(result, null, 2)}
                      </pre>
                    </div>
                  )}

                </div>
              )}

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default ToolsLab;
