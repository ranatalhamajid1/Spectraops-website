import React, { useState, useEffect } from 'react';
import { Shield, Lock, Database, CheckCircle, AlertTriangle, LogOut, ArrowRight, User, Settings, CreditCard, Landmark, Activity, FileText, Users, MessageSquare } from 'lucide-react';
import { makeApiRequest } from '../services/api';

interface Lead {
  id: number;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  source: string;
  status: string;
  notes?: string;
  created_at: string;
}

interface Order {
  id: number;
  client_id?: number;
  client_name?: string;
  client_email?: string;
  order_type: string;
  status: string;
  amount: number;
  payment_status: string;
  details_json?: string;
  created_at: string;
}

interface JobApplication {
  id: number;
  job_title: string;
  name: string;
  email: string;
  resume_url: string;
  portfolio_url?: string;
  status: string;
  created_at: string;
}

interface Inquiry {
  id: number;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  subject: string;
  message: string;
  service_type?: string;
  created_at: string;
}

export const AdminDashboard: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [requireMfa, setRequireMfa] = useState(false);
  const [tempToken, setTempToken] = useState('');
  const [token, setToken] = useState<string | null>(localStorage.getItem('admin_token'));
  const [userRole, setUserRole] = useState<string>('super_admin');
  const [currentUser, setCurrentUser] = useState<string>('Rana Talha Majid');

  // Auth inputs
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mfaCode, setMfaCode] = useState('');
  const [authError, setAuthError] = useState('');
  const [mfaError, setMfaError] = useState('');

  // Dashboard views
  const [activeTab, setActiveTab] = useState<'overview' | 'crm' | 'inquiries' | 'orders' | 'applications' | 'analytics' | 'settings'>('overview');
  const [leads, setLeads] = useState<Lead[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [dashboardLoading, setDashboardLoading] = useState(false);

  // CRM client note modal/form inputs
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [leadNotes, setLeadNotes] = useState('');
  const [leadStatus, setLeadStatus] = useState('');

  // Settings values
  const [smtpHost, setSmtpHost] = useState('smtp.spectraops.pk');
  const [smtpPort, setSmtpPort] = useState('587');
  const [smtpUser, setSmtpUser] = useState('spectraopsofficial@gmail.com');
  const [apiKeyVirusTotal, setApiKeyVirusTotal] = useState('');
  const [apiKeyAbuseIPDB, setApiKeyAbuseIPDB] = useState('');
  const [mfaEnabledFlag, setMfaEnabledFlag] = useState(false);
  const [settingsStatus, setSettingsStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [settingsMessage, setSettingsMessage] = useState('');

  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
      fetchSessionDetails();
      fetchDashboardData();
    }
  }, [token]);

  const fetchSessionDetails = async () => {
    try {
      const res = await makeApiRequest('/auth/check', 'GET');
      if (res.success && res.authenticated) {
        setUserRole(res.role || 'super_admin');
        setCurrentUser(res.user || 'Rana Talha Majid');
      }
    } catch {
      // Mock session check fallback
      setUserRole('super_admin');
      setCurrentUser('Rana Talha Majid');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await makeApiRequest('/auth/login', 'POST', { username, password });
      if (res.success) {
        if (res.mfaRequired || res.mfa_required) {
          setTempToken(res.tempToken || '');
          setRequireMfa(true);
        } else {
          localStorage.setItem('admin_token', res.accessToken);
          setToken(res.accessToken);
          setUserRole(res.user?.role || 'super_admin');
          setCurrentUser(res.user?.fullName || username);
          setIsLoggedIn(true);
        }
      } else {
        setAuthError(res.error || 'Invalid credentials');
      }
    } catch (err: any) {
      setAuthError(err.message || 'Network error or invalid credentials');
    }
  };

  const handleMfaVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setMfaError('');
    try {
      const res = await makeApiRequest('/auth/verify-mfa', 'POST', { tempToken, mfaToken: mfaCode });
      if (res.success) {
        localStorage.setItem('admin_token', res.accessToken);
        setToken(res.accessToken);
        setUserRole(res.user?.role || 'super_admin');
        setCurrentUser(res.user?.fullName || username);
        setIsLoggedIn(true);
        setRequireMfa(false);
      } else {
        setMfaError(res.error || 'Invalid MFA code');
      }
    } catch (err) {
      setMfaError('Failed to verify code');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setToken(null);
    setIsLoggedIn(false);
    setLeads([]);
    setOrders([]);
    setApplications([]);
    setInquiries([]);
  };

  const fetchSettingsData = async () => {
    try {
      const res = await makeApiRequest('/settings', 'GET');
      if (res.success && res.settings) {
        const s = res.settings;
        setSmtpHost(s.smtp?.host || '');
        setSmtpPort(String(s.smtp?.port || '587'));
        setSmtpUser(s.smtp?.user || 'spectraopsofficial@gmail.com');
        setApiKeyVirusTotal(s.apis?.virustotalApiKey || '');
        setApiKeyAbuseIPDB(s.apis?.abuseipdbApiKey || '');
        setMfaEnabledFlag(s.apis?.mfaEnabled || false);
      }
    } catch (err) {
      console.error('Failed to fetch settings:', err);
    }
  };

  const fetchDashboardData = async () => {
    setDashboardLoading(true);
    try {
      // Fetch Leads
      const leadsRes = await makeApiRequest('/crm/leads', 'GET');
      if (leadsRes.success) {
        setLeads(leadsRes.leads || leadsRes.data || []);
      }

      // Fetch Orders
      const ordersRes = await makeApiRequest('/crm/orders', 'GET');
      if (ordersRes.success) {
        setOrders(ordersRes.orders || []);
      }

      // Fetch Applications
      const appsRes = await makeApiRequest('/careers/admin/applications', 'GET');
      if (appsRes.success) {
        setApplications(appsRes.data || []);
      }

      // Fetch Inquiries / Queries
      const inquiriesRes = await makeApiRequest('/admin/messages', 'GET');
      if (inquiriesRes.success) {
        setInquiries(inquiriesRes.contacts || []);
      }

      // Fetch Settings if super_admin
      if (userRole === 'super_admin' || userRole === 'super-admin') {
        await fetchSettingsData();
      }
    } catch (err) {
      console.error('Failed to load dashboard logs', err);
    } finally {
      setDashboardLoading(false);
    }
  };

  const handleUpdateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead) return;
    try {
      const res = await makeApiRequest(`/crm/leads/${selectedLead.id}`, 'PUT', {
        status: leadStatus,
        notes: leadNotes
      });
      if (res.success) {
        setSelectedLead(null);
        fetchDashboardData();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update lead');
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSettingsStatus('saving');
    setSettingsMessage('');
    try {
      const body = {
        branding: {
          siteName: 'SpectraOps Ltd',
          tagline: 'Secure. Scale. Succeed.'
        },
        apis: {
          hibpEnabled: false,
          virustotalEnabled: !!apiKeyVirusTotal,
          abuseipdbEnabled: !!apiKeyAbuseIPDB,
          virustotalApiKey: apiKeyVirusTotal,
          abuseipdbApiKey: apiKeyAbuseIPDB,
          mfaEnabled: mfaEnabledFlag
        },
        smtp: {
          host: smtpHost,
          port: parseInt(smtpPort) || 587,
          secure: false,
          user: smtpUser
        },
        payments: {
          stripePublicKey: '',
          paypalClientId: ''
        }
      };
      const res = await makeApiRequest('/settings', 'PUT', body);
      if (res.success) {
        setSettingsStatus('success');
        setSettingsMessage('Site configuration updated successfully');
      } else {
        throw new Error(res.error || 'Failed to save settings');
      }
    } catch (err: any) {
      setSettingsStatus('error');
      setSettingsMessage(err.message || 'Failed to update settings');
    }
  };

  const handleUpdateOrderStatus = async (id: number, status: string, paymentStatus: string) => {
    try {
      const res = await makeApiRequest(`/crm/orders/${id}`, 'PUT', { status, paymentStatus });
      if (res.success) {
        fetchDashboardData();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update order status');
    }
  };

  const handleUpdateAppStatus = async (id: number, status: string) => {
    try {
      const res = await makeApiRequest(`/careers/admin/applications/${id}/status`, 'PUT', { status });
      if (res.success) {
        fetchDashboardData();
      }
    } catch (err: any) {
      alert(err.message || 'Failed to update application');
    }
  };

  // Calculations for overview stats
  const totalRevenue = orders.reduce((sum, o) => sum + (o.payment_status === 'paid' ? o.amount : 0), 0);
  const orderStats = {
    llc: orders.filter(o => o.order_type === 'llc').length,
    ltd: orders.filter(o => o.order_type === 'ltd').length,
    itin: orders.filter(o => o.order_type === 'itin').length,
    pending: orders.filter(o => o.status === 'pending').length,
    completed: orders.filter(o => o.status === 'completed').length,
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen cyber-grid flex items-center justify-center px-4 py-12 relative">
        <div className="aurora-bg aurora-blue top-20 right-20"></div>
        <div className="aurora-bg aurora-purple bottom-20 left-20"></div>

        <div className="max-w-md w-full glass-panel p-8 rounded-3xl border border-white/10 relative z-10 space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 rounded-2xl bg-cyber-accent/10 border border-cyber-accent/20">
              <Shield className="h-6 w-6 text-cyber-accent animate-pulse" />
            </div>
            <h1 className="text-2xl font-heading font-extrabold text-white">SpectraOps Gateway</h1>
            <p className="text-slate-400 text-[9px] uppercase tracking-widest font-black">Authorized Administrative Operations Only</p>
          </div>

          {!requireMfa ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400">Username</label>
                <div className="relative">
                  <User className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="admin, support, hr, finance, content"
                    className="w-full pl-10 pr-4 py-3 glass-input text-xs"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-500" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••••••"
                    className="w-full pl-10 pr-4 py-3 glass-input text-xs"
                  />
                </div>
              </div>

              {authError && (
                <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs font-semibold flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-cyber-accent to-cyber-glow text-white font-bold rounded-xl text-xs hover:brightness-110 shadow-glow transition-all flex items-center justify-center space-x-2"
              >
                <span>Authenticate Credentials</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleMfaVerify} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400">Authenticator MFA Code</label>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value)}
                  placeholder="000000"
                  className="w-full py-3.5 glass-input text-center text-sm font-mono tracking-widest"
                />
              </div>

              {mfaError && (
                <div className="p-3.5 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs font-semibold flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  <span>{mfaError}</span>
                </div>
              )}

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-cyber-glow to-cyber-accent text-white font-bold rounded-xl text-xs hover:brightness-110 shadow-glow transition-all flex items-center justify-center space-x-2"
              >
                <span>Verify Token Code</span>
                <CheckCircle className="h-3.5 w-3.5" />
              </button>
            </form>
          )
}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen cyber-grid pt-24 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 glass-panel p-6 rounded-2xl border border-white/5">
          <div className="space-y-1">
            <h1 className="text-xl font-heading font-extrabold text-white flex items-center gap-2">
              <Database className="h-5 w-5 text-cyber-accent" />
              <span>SpectraOps Terminal</span>
              <span className="text-[9px] uppercase tracking-widest bg-cyber-accent/15 text-cyber-accent px-2 py-0.5 rounded border border-cyber-accent/20">
                {userRole}
              </span>
            </h1>
            <p className="text-xs text-slate-500">Welcome back, <strong className="text-slate-300">{currentUser}</strong>. Accessing terminal logs.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={fetchDashboardData}
              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-semibold text-slate-300 transition-all"
            >
              Sync Dashboard
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Lock Terminal</span>
            </button>
          </div>
        </div>

        {/* Sidebar Nav + Content Split Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Side Navbar */}
          <div className="lg:col-span-3 glass-panel p-4 rounded-2xl border border-white/5 space-y-2">
            {[
              { id: 'overview', label: 'Dashboard Overview', icon: Activity, roles: ['super_admin', 'admin', 'support', 'hr', 'finance', 'content_manager'] },
              { id: 'crm', label: 'CRM Leads Pipeline', icon: Users, roles: ['super_admin', 'admin', 'support', 'sales'] },
              { id: 'inquiries', label: 'Inquiries / Queries', icon: MessageSquare, roles: ['super_admin', 'admin', 'support', 'sales'] },
              { id: 'orders', label: 'Service Orders', icon: CreditCard, roles: ['super_admin', 'admin', 'support', 'finance'] },
              { id: 'applications', label: 'Job Applications', icon: FileText, roles: ['super_admin', 'admin', 'hr'] },
              { id: 'analytics', label: 'Real-Time Analytics', icon: Landmark, roles: ['super_admin', 'admin'] },
              { id: 'settings', label: 'Terminal Settings', icon: Settings, roles: ['super_admin', 'admin'] }
            ].map((tab) => {
              const TabIcon = tab.icon;
              const hasAccess = tab.roles.includes(userRole);
              if (!hasAccess) return null;

              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`w-full text-left p-3.5 rounded-xl text-xs font-bold transition-all flex items-center gap-3 border ${
                    activeTab === tab.id
                      ? 'bg-cyber-accent/15 border-cyber-accent text-cyber-accent shadow-glow'
                      : 'border-transparent text-slate-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <TabIcon className="h-4 w-4 shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Main workspace container */}
          <div className="lg:col-span-9 space-y-6">
            
            {dashboardLoading && (
              <div className="p-12 text-center text-slate-400 font-semibold text-xs animate-pulse">
                Synchronizing terminal registries...
              </div>
            )}

            {!dashboardLoading && activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Stats Matrix */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-2">
                    <span className="text-[10px] uppercase font-bold text-slate-500 tracking-wider">Accumulated Revenue</span>
                    <div className="text-3xl font-extrabold font-heading text-white">${totalRevenue.toLocaleString()}</div>
                    <p className="text-[9px] text-emerald-400 font-bold">100% Cleared via Stripe/Wise</p>
                  </div>
                  <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-2">
                    <span className="text-[10px] uppercase font-bold text-cyber-accent tracking-wider">CRM Pipeline Size</span>
                    <div className="text-3xl font-extrabold font-heading text-cyber-accent">{leads.length}</div>
                    <p className="text-[9px] text-slate-500">Total registered client leads</p>
                  </div>
                  <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-2">
                    <span className="text-[10px] uppercase font-bold text-cyber-glow tracking-wider">Service Orders Logged</span>
                    <div className="text-3xl font-extrabold font-heading text-cyber-glow">{orders.length}</div>
                    <p className="text-[9px] text-slate-500">{orderStats.pending} pending, {orderStats.completed} completed</p>
                  </div>
                </div>

                {/* Sub-matrices splits */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* Order breakdown */}
                  <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
                    <h3 className="text-sm font-heading font-extrabold text-white">Orders Breakdown</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-xs text-slate-400">
                        <span>U.S. LLC Formations ($199)</span>
                        <span className="font-extrabold text-white">{orderStats.llc}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs text-slate-400">
                        <span>UK LTD Formations ($99)</span>
                        <span className="font-extrabold text-white">{orderStats.ltd}</span>
                      </div>
                      <div className="flex justify-between items-center text-xs text-slate-400">
                        <span>IRS ITIN Applications ($199)</span>
                        <span className="font-extrabold text-white">{orderStats.itin}</span>
                      </div>
                    </div>
                  </div>

                  {/* Operational Telemetries */}
                  <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
                    <h3 className="text-sm font-heading font-extrabold text-white">Security Lab Diagnostics</h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center text-xs text-slate-400">
                        <span>Active WAF Rules</span>
                        <span className="font-mono font-bold text-emerald-400">12 Enabled</span>
                      </div>
                      <div className="flex justify-between items-center text-xs text-slate-400">
                        <span>Diagnostic Tool Logs</span>
                        <span className="font-mono text-white">3,248 resolved checks</span>
                      </div>
                      <div className="flex justify-between items-center text-xs text-slate-400">
                        <span>AbuseIPDB Sync Rate</span>
                        <span className="font-mono text-cyber-accent">Uptime: OK</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!dashboardLoading && activeTab === 'crm' && (
              <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
                <div className="p-6 border-b border-white/5 bg-white/5 flex justify-between items-center">
                  <h3 className="text-sm font-heading font-extrabold text-white">CRM Leads Pipeline</h3>
                  <span className="text-[10px] bg-cyber-accent/15 text-cyber-accent px-2 py-0.5 rounded border border-cyber-accent/20 font-mono">
                    {leads.length} Records
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-white/5 text-[9px] uppercase font-bold text-slate-500 tracking-wider">
                        <th className="p-4">Contact Profile</th>
                        <th className="p-4">Source Division</th>
                        <th className="p-4">Notes / Specifications</th>
                        <th className="p-4">Pipeline Status</th>
                        <th className="p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {leads.map((lead) => (
                        <tr key={lead.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-4">
                            <div className="font-extrabold text-white">{lead.name}</div>
                            <div className="text-slate-500 text-[10px]">{lead.email}</div>
                            {lead.phone && <div className="text-[10px] text-slate-400">{lead.phone}</div>}
                          </td>
                          <td className="p-4 font-bold text-cyber-accent uppercase text-[10px]">{lead.source}</td>
                          <td className="p-4 max-w-xs">
                            <p className="text-slate-400 line-clamp-2">{lead.notes || 'No notes added.'}</p>
                          </td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold capitalize border ${
                              lead.status === 'new' 
                                ? 'bg-cyber-accent/10 border-cyber-accent/30 text-cyber-accent'
                                : lead.status === 'contacted'
                                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                            }`}>
                              {lead.status}
                            </span>
                          </td>
                          <td className="p-4">
                            <button
                              onClick={() => {
                                setSelectedLead(lead);
                                setLeadNotes(lead.notes || '');
                                setLeadStatus(lead.status);
                              }}
                              className="px-3 py-1.5 bg-white/5 border border-white/5 rounded-lg text-[10px] font-bold text-slate-300 hover:bg-white/10 transition-colors"
                            >
                              Update Lead
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Lead Update Note Modal / Card Overlay */}
            {!dashboardLoading && selectedLead && (
              <div className="glass-panel p-6 rounded-2xl border border-cyber-accent/30 space-y-4">
                <h3 className="text-sm font-heading font-extrabold text-white">Update Lead: {selectedLead.name}</h3>
                <form onSubmit={handleUpdateLead} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[9px] uppercase font-bold text-slate-500">Pipeline Status</label>
                      <select
                        value={leadStatus}
                        onChange={(e) => setLeadStatus(e.target.value)}
                        className="w-full glass-input bg-cyber-bg border border-white/10 rounded-lg text-xs"
                      >
                        <option value="new">New / Uncontacted</option>
                        <option value="contacted">Contacted / In Progress</option>
                        <option value="converted">Converted Client</option>
                        <option value="lost">Archived / Closed</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[9px] uppercase font-bold text-slate-500">Follow-up Notes</label>
                    <textarea
                      rows={3}
                      value={leadNotes}
                      onChange={(e) => setLeadNotes(e.target.value)}
                      placeholder="Add conversation notes, call schedules, or tax amendment checklists..."
                      className="w-full glass-input resize-none text-xs"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" className="px-4 py-2 bg-cyber-accent text-cyber-bg font-extrabold rounded-lg text-xs hover:brightness-110 shadow-glow">
                      Save Changes
                    </button>
                    <button type="button" onClick={() => setSelectedLead(null)} className="px-4 py-2 bg-white/5 border border-white/5 rounded-lg text-xs font-bold text-slate-400 hover:text-white">
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {!dashboardLoading && activeTab === 'orders' && (
              <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
                <div className="p-6 border-b border-white/5 bg-white/5 flex justify-between items-center">
                  <h3 className="text-sm font-heading font-extrabold text-white">Corporate Orders Tracking</h3>
                  <span className="text-[10px] bg-cyber-glow/15 text-cyber-glow px-2 py-0.5 rounded border border-cyber-glow/20 font-mono">
                    {orders.length} Logged Orders
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-white/5 text-[9px] uppercase font-bold text-slate-500 tracking-wider">
                        <th className="p-4">Order ID</th>
                        <th className="p-4">Client Name</th>
                        <th className="p-4">Entity Type</th>
                        <th className="p-4">Amount</th>
                        <th className="p-4">Billing Status</th>
                        <th className="p-4">Process Status</th>
                        <th className="p-4">Filing Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {orders.map((o) => (
                        <tr key={o.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-4 font-mono font-bold text-white">#SO-{o.id}</td>
                          <td className="p-4">
                            <div className="font-bold text-white">{o.client_name || 'Corporate Entity'}</div>
                            <div className="text-[10px] text-slate-500">{o.client_email}</div>
                          </td>
                          <td className="p-4 uppercase font-bold text-cyber-accent text-[10px]">{o.order_type}</td>
                          <td className="p-4 font-bold text-white">${o.amount}</td>
                          <td className="p-4">
                            <select
                              value={o.payment_status}
                              onChange={(e) => handleUpdateOrderStatus(o.id, o.status, e.target.value)}
                              className="bg-black/40 border border-white/10 rounded px-2 py-1 text-[10px] text-white"
                            >
                              <option value="unpaid">Unpaid</option>
                              <option value="paid">Paid</option>
                              <option value="refunded">Refunded</option>
                            </select>
                          </td>
                          <td className="p-4">
                            <select
                              value={o.status}
                              onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value, o.payment_status)}
                              className="bg-black/40 border border-white/10 rounded px-2 py-1 text-[10px] text-white"
                            >
                              <option value="pending">Pending Review</option>
                              <option value="processing">Processing Forms</option>
                              <option value="filed">Filed State</option>
                              <option value="completed">Completed / Active</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                          <td className="p-4 text-[10px] text-slate-500">{o.created_at}</td>
                        </tr>
                      ))}
                      {orders.length === 0 && (
                        <tr>
                          <td colSpan={7} className="p-8 text-center text-slate-500">No active corporate orders currently logged.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {!dashboardLoading && activeTab === 'inquiries' && (
              <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
                <div className="p-6 border-b border-white/5 bg-white/5 flex justify-between items-center">
                  <h3 className="text-sm font-heading font-extrabold text-white">Inquiries & Queries</h3>
                  <span className="text-[10px] bg-cyber-accent/15 text-cyber-accent px-2 py-0.5 rounded border border-cyber-accent/20 font-mono">
                    {inquiries.length} Messages
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-white/5 text-[9px] uppercase font-bold text-slate-500 tracking-wider">
                        <th className="p-4">Sender</th>
                        <th className="p-4">Subject</th>
                        <th className="p-4">Message</th>
                        <th className="p-4">Received At</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {inquiries.map((inq) => (
                        <tr key={inq.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-4">
                            <div className="font-extrabold text-white">{inq.name}</div>
                            <div className="text-slate-500 text-[10px]">{inq.email}</div>
                            {inq.phone && <div className="text-[10px] text-slate-400">{inq.phone}</div>}
                            {inq.company && <div className="text-[10px] text-slate-400">{inq.company}</div>}
                          </td>
                          <td className="p-4 font-bold text-cyber-accent uppercase text-[10px]">{inq.subject}</td>
                          <td className="p-4 max-w-md">
                            <p className="text-slate-300 whitespace-pre-wrap">{inq.message}</p>
                          </td>
                          <td className="p-4 text-[10px] text-slate-500">{inq.created_at}</td>
                        </tr>
                      ))}
                      {inquiries.length === 0 && (
                        <tr>
                          <td colSpan={4} className="p-8 text-center text-slate-500">No inquiry submissions found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {!dashboardLoading && activeTab === 'applications' && (
              <div className="glass-panel rounded-2xl border border-white/5 overflow-hidden">
                <div className="p-6 border-b border-white/5 bg-white/5 flex justify-between items-center">
                  <h3 className="text-sm font-heading font-extrabold text-white">Recruitment Applications</h3>
                  <span className="text-[10px] bg-cyber-accent/15 text-cyber-accent px-2 py-0.5 rounded border border-cyber-accent/20 font-mono">
                    {applications.length} Applicants
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-white/5 text-[9px] uppercase font-bold text-slate-500 tracking-wider">
                        <th className="p-4">Applicant</th>
                        <th className="p-4">Target Position</th>
                        <th className="p-4">Portfolio Link</th>
                        <th className="p-4">Resume Path</th>
                        <th className="p-4">HR Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {applications.map((app) => (
                        <tr key={app.id} className="hover:bg-white/5 transition-colors">
                          <td className="p-4">
                            <div className="font-extrabold text-white">{app.name}</div>
                            <div className="text-slate-500 text-[10px]">{app.email}</div>
                          </td>
                          <td className="p-4 font-bold text-slate-300">{app.job_title}</td>
                          <td className="p-4">
                            {app.portfolio_url ? (
                              <a href={app.portfolio_url} target="_blank" rel="noreferrer" className="text-cyber-accent hover:underline text-[10px] font-bold">
                                View Portfolio Link
                              </a>
                            ) : <span className="text-slate-500">None provided</span>}
                          </td>
                          <td className="p-4">
                            <a href={app.resume_url} target="_blank" rel="noreferrer" className="text-cyber-glow hover:underline text-[10px] font-bold">
                              Download PDF Resume
                            </a>
                          </td>
                          <td className="p-4">
                            <select
                              value={app.status}
                              onChange={(e) => handleUpdateAppStatus(app.id, e.target.value)}
                              className="bg-black/40 border border-white/10 rounded px-2 py-1 text-[10px] text-white"
                            >
                              <option value="applied">Applied / New</option>
                              <option value="reviewing">HR Review</option>
                              <option value="interviewed">Interview Scheduled</option>
                              <option value="offered">Offered</option>
                              <option value="rejected">Rejected / Archived</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                      {applications.length === 0 && (
                        <tr>
                          <td colSpan={5} className="p-8 text-center text-slate-500">No career application submissions logged.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {!dashboardLoading && activeTab === 'analytics' && (
              <div className="space-y-6">
                <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
                  <h3 className="text-sm font-heading font-extrabold text-white">Ecosystem Traffic Metrics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-center">
                      <div className="text-[10px] uppercase font-bold text-slate-500">Conversion Rate</div>
                      <div className="text-2xl font-black text-white">4.85%</div>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-center">
                      <div className="text-[10px] uppercase font-bold text-slate-500">API Latency</div>
                      <div className="text-2xl font-black text-cyber-accent">1.2 seconds</div>
                    </div>
                    <div className="bg-white/5 p-4 rounded-xl border border-white/5 text-center">
                      <div className="text-[10px] uppercase font-bold text-slate-500">SMTP Relay rate</div>
                      <div className="text-2xl font-black text-cyber-glow">99.98%</div>
                    </div>
                  </div>
                </div>

                <div className="glass-panel p-6 rounded-2xl border border-white/5 space-y-4">
                  <h3 className="text-sm font-heading font-extrabold text-white">Real-Time Threat Scan Loads</h3>
                  <div className="h-44 bg-black/40 border border-white/5 rounded-xl flex items-end justify-between p-4 font-mono text-[9px] text-slate-500">
                    <div className="h-full flex flex-col justify-between">
                      <span>100</span>
                      <span>50</span>
                      <span>0</span>
                    </div>
                    {/* Simulated bar chart */}
                    {[20, 45, 10, 60, 30, 80, 55, 90, 75, 40, 25, 70].map((val, idx) => (
                      <div key={idx} className="flex flex-col items-center gap-1 w-6">
                        <div className="w-full bg-cyber-accent/60 rounded" style={{ height: `${val * 1.2}px` }}></div>
                        <span>hr {idx}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {!dashboardLoading && activeTab === 'settings' && (
              <form onSubmit={handleSaveSettings} className="glass-panel p-8 rounded-3xl border border-white/10 space-y-6">
                <h3 className="text-sm font-heading font-extrabold text-white">Terminal Settings</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400">SMTP Gateway Relay</label>
                      <input type="text" value={smtpHost} onChange={(e) => setSmtpHost(e.target.value)} className="w-full glass-input py-2 text-xs" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400">SMTP Port</label>
                      <input type="text" value={smtpPort} onChange={(e) => setSmtpPort(e.target.value)} className="w-full glass-input py-2 text-xs" />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400">SMTP Sender User</label>
                    <input type="email" value={smtpUser} onChange={(e) => setSmtpUser(e.target.value)} className="w-full glass-input py-2 text-xs" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400">VirusTotal API Registry Key</label>
                      <input type="password" value={apiKeyVirusTotal} onChange={(e) => setApiKeyVirusTotal(e.target.value)} className="w-full glass-input py-2 text-xs font-mono" />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-slate-400">AbuseIPDB Registry Key</label>
                      <input type="password" value={apiKeyAbuseIPDB} onChange={(e) => setApiKeyAbuseIPDB(e.target.value)} className="w-full glass-input py-2 text-xs font-mono" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-xl">
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-white">Enforce Multi-Factor Authentication</div>
                      <p className="text-[10px] text-slate-500">Require all administrator logins to verify Google Authenticator TOTP tokens.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setMfaEnabledFlag(!mfaEnabledFlag)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border cursor-pointer ${
                        mfaEnabledFlag ? 'bg-cyber-accent text-cyber-bg border-cyber-accent shadow-glow' : 'bg-white/5 text-slate-400 border-white/5'
                      }`}
                    >
                      {mfaEnabledFlag ? 'MFA ACTIVE' : 'MFA DISABLED'}
                    </button>
                  </div>

                  {settingsStatus === 'success' && (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 rounded-xl text-xs flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 shrink-0" />
                      <span>{settingsMessage}</span>
                    </div>
                  )}
                  {settingsStatus === 'error' && (
                    <div className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs flex items-center space-x-2">
                      <AlertTriangle className="h-4 w-4 shrink-0" />
                      <span>{settingsMessage}</span>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={settingsStatus === 'saving'}
                    className="w-full py-3.5 bg-gradient-to-r from-cyber-accent to-cyber-glow text-white font-bold rounded-xl text-xs hover:brightness-110 shadow-glow disabled:opacity-50 transition-all flex items-center justify-center space-x-2 cursor-pointer"
                  >
                    <span>{settingsStatus === 'saving' ? 'Committing Changes...' : 'Save Configuration Settings'}</span>
                  </button>
                </div>
              </form>
            )}

          </div>

        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
