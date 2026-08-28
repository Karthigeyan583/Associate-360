import React, { useState, useEffect, useCallback } from 'react';
import { 
  BarChart3, TrendingUp, Download, Filter, Search, RefreshCw, 
  Layers, ShieldCheck, DollarSign, Calendar, Users, ArrowUpRight, 
  ArrowDownRight, CheckCircle2, AlertTriangle, Clock, Sliders, 
  FileSpreadsheet, PieChart, Sparkles, ChevronRight
} from 'lucide-react';
import { apiService } from '../services/api';

export default function ReportsModule({ onSelectAssociate }) {
  const [activeTab, setActiveTab] = useState('charts'); // 'charts' | 'catalogue' | 'custom'
  
  // Analytics State
  const [analytics, setAnalytics] = useState(null);
  const [loadingAnalytics, setLoadingAnalytics] = useState(true);

  // Catalogue State
  const [selectedReport, setSelectedReport] = useState('commercial');
  const [catalogueData, setCatalogueData] = useState(null);
  const [loadingCatalogue, setLoadingCatalogue] = useState(false);
  const [catalogueSearch, setCatalogueSearch] = useState('');

  // Custom Report Builder State
  const [customColumns, setCustomColumns] = useState(['ba_id', 'name', 'client', 'role', 'client_rate', 'ba_rate', 'margin_pct', 'readiness', 'overall_compliance']);
  const [customFilterClient, setCustomFilterClient] = useState('');
  const [customFilterReadiness, setCustomFilterReadiness] = useState('');
  const [customFilterEmpType, setCustomFilterEmpType] = useState('');
  const [customReportData, setCustomReportData] = useState(null);
  const [loadingCustom, setLoadingCustom] = useState(false);

  // 10 Reports Definitions (Product Bible Section 12)
  const standardReports = [
    { id: 'commercial', name: 'Commercial & Margin Spreads', icon: DollarSign, badge: 'Financials', desc: 'Client bill rates, BA pay rates, gross margins and rate difference ranking' },
    { id: 'active_ba', name: 'Active Placements & Deployment', icon: Users, badge: 'Operational', desc: 'Current active consultants, assigned clients, end dates, and readiness' },
    { id: 'agreement_expiry', name: 'Agreement Expiry Risk', icon: AlertTriangle, badge: 'Risk', desc: 'Countdown timeline, 7d/14d/30d critical expirations, and urgency levels' },
    { id: 'extension_tracker', name: 'Extension Pipeline Tracker', icon: Clock, badge: 'Lifecycle', desc: 'Sequence tracking, negotiation statuses, and assigned account owners' },
    { id: 'compliance', name: 'Dutch Labour Compliance Register', icon: ShieldCheck, badge: 'Audit', desc: 'VOG screening, background check, HSM visa status, and SNA/NEN 4400-1 audit' },
    { id: 'ba_master', name: 'BA Master Demographics', icon: Layers, badge: 'Master Data', desc: 'Comprehensive consultant profile data, working countries, sources, and contacts' },
    { id: 'joining', name: 'Upcoming Joining Pipeline', icon: ArrowUpRight, badge: 'Onboarding', desc: 'New consultant start dates, onboarding readiness status, and owners' },
    { id: 'exit', name: 'Offboarding & Exit Audit', icon: ArrowDownRight, badge: 'Offboarding', desc: 'Historical departures, offboarding reasons, and last recorded assignments' },
    { id: 'agreement_history', name: 'Sequential Agreement Audit', icon: Calendar, badge: 'Historical', desc: 'Chain of sequential contract amendments (1st, 2nd, 3rd extensions)' },
    { id: 'audit_trail', name: 'System Activity & Change Log', icon: FileSpreadsheet, badge: 'Governance', desc: 'Traceable log of rate modifications, compliance updates, and user actors' }
  ];

  // Available Fields for Custom Builder
  const AVAILABLE_FIELDS = [
    { id: 'ba_id', label: 'BA ID', category: 'Identity' },
    { id: 'name', label: 'Full Name', category: 'Identity' },
    { id: 'email', label: 'Email Address', category: 'Identity' },
    { id: 'phone', label: 'Phone Number', category: 'Identity' },
    { id: 'role', label: 'Primary Role', category: 'Identity' },
    { id: 'owner', label: 'Account Owner', category: 'Identity' },
    { id: 'client', label: 'Assigned Client', category: 'Placement' },
    { id: 'employment_type', label: 'Employment Type', category: 'Placement' },
    { id: 'status', label: 'Employment Status', category: 'Placement' },
    { id: 'readiness', label: 'Readiness Status', category: 'Placement' },
    { id: 'working_country', label: 'Working Country', category: 'Placement' },
    { id: 'client_rate', label: 'Client Bill Rate', category: 'Commercials' },
    { id: 'ba_rate', label: 'BA Pay Rate', category: 'Commercials' },
    { id: 'difference', label: 'Rate Spread (€)', category: 'Commercials' },
    { id: 'margin_pct', label: 'Gross Margin %', category: 'Commercials' },
    { id: 'agreement_end', label: 'Agreement End Date', category: 'Lifecycle' },
    { id: 'days_remaining', label: 'Days Remaining', category: 'Lifecycle' },
    { id: 'joining_date', label: 'Joining Date', category: 'Lifecycle' },
    { id: 'vog', label: 'VOG Status', category: 'Compliance' },
    { id: 'bgc', label: 'BGC Status', category: 'Compliance' },
    { id: 'visa', label: 'Visa Type', category: 'Compliance' },
    { id: 'sna', label: 'SNA Standard', category: 'Compliance' },
    { id: 'overall_compliance', label: 'Overall Compliance', category: 'Compliance' },
  ];

  // Fetch Analytics
  const fetchAnalytics = useCallback(async () => {
    setLoadingAnalytics(true);
    try {
      const data = await apiService.getReportsAnalytics();
      setAnalytics(data);
    } catch (err) {
      console.error('Error fetching analytics:', err);
    } finally {
      setLoadingAnalytics(false);
    }
  }, []);

  // Fetch Predefined Catalogue Report
  const fetchCatalogue = useCallback(async () => {
    setLoadingCatalogue(true);
    try {
      const params = {};
      if (catalogueSearch) params.search = catalogueSearch;
      const data = await apiService.getReportsCatalogue(selectedReport, params);
      setCatalogueData(data);
    } catch (err) {
      console.error('Error fetching catalogue report:', err);
    } finally {
      setLoadingCatalogue(false);
    }
  }, [selectedReport, catalogueSearch]);

  // Generate Custom Report
  const handleGenerateCustom = useCallback(async () => {
    setLoadingCustom(true);
    try {
      const payload = {
        columns: customColumns,
        client_id: customFilterClient || undefined,
        readiness: customFilterReadiness || undefined,
        employment_type: customFilterEmpType || undefined
      };
      const data = await apiService.generateCustomReport(payload);
      setCustomReportData(data);
    } catch (err) {
      console.error('Error generating custom report:', err);
    } finally {
      setLoadingCustom(false);
    }
  }, [customColumns, customFilterClient, customFilterReadiness, customFilterEmpType]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  useEffect(() => {
    if (activeTab === 'catalogue') {
      fetchCatalogue();
    }
  }, [activeTab, fetchCatalogue]);

  useEffect(() => {
    if (activeTab === 'custom') {
      handleGenerateCustom();
    }
  }, [activeTab, handleGenerateCustom]);

  const toggleCustomColumn = (colId) => {
    if (customColumns.includes(colId)) {
      if (customColumns.length > 1) {
        setCustomColumns(customColumns.filter(c => c !== colId));
      }
    } else {
      setCustomColumns([...customColumns, colId]);
    }
  };

  const handleExportCSV = (repType) => {
    const url = apiService.getExportCsvUrl(repType || selectedReport);
    window.open(url, '_blank');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Header & Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff'
            }}>
              <BarChart3 size={20} />
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800 }}>
              Reports & Analytics Center
            </h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Granular commercial metrics, 12-month contract risk forecast, standard enterprise reports, and custom CSV exports.
          </p>
        </div>

        {/* Tab Controls & Global Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-full)',
            padding: '3px',
            display: 'inline-flex',
            gap: '3px'
          }}>
            <button
              onClick={() => setActiveTab('charts')}
              style={{
                background: activeTab === 'charts' ? 'var(--accent-primary)' : 'transparent',
                color: activeTab === 'charts' ? '#fff' : 'var(--text-secondary)',
                border: 'none',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                fontWeight: 600,
                fontSize: '0.8125rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <TrendingUp size={14} />
              <span>Visual Analytics</span>
            </button>

            <button
              onClick={() => setActiveTab('catalogue')}
              style={{
                background: activeTab === 'catalogue' ? 'var(--accent-primary)' : 'transparent',
                color: activeTab === 'catalogue' ? '#fff' : 'var(--text-secondary)',
                border: 'none',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                fontWeight: 600,
                fontSize: '0.8125rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <FileSpreadsheet size={14} />
              <span>Standard Reports (10)</span>
            </button>

            <button
              onClick={() => setActiveTab('custom')}
              style={{
                background: activeTab === 'custom' ? 'var(--accent-primary)' : 'transparent',
                color: activeTab === 'custom' ? '#fff' : 'var(--text-secondary)',
                border: 'none',
                padding: '6px 14px',
                borderRadius: 'var(--radius-full)',
                fontWeight: 600,
                fontSize: '0.8125rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Sliders size={14} />
              <span>Custom Builder</span>
            </button>
          </div>

          <button
            onClick={() => handleExportCSV(activeTab === 'catalogue' ? selectedReport : 'active_ba')}
            className="btn btn-primary"
            style={{ fontSize: '0.8125rem' }}
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* ================= TAB 1: VISUAL ANALYTICS & CHARTS ================= */}
      {activeTab === 'charts' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Executive Granular KPIs */}
          {analytics && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
              
              <div className="glass-card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Monthly Gross Revenue
                    </div>
                    <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
                      €{analytics.summary.monthly_gross_revenue?.toLocaleString()}
                    </div>
                  </div>
                  <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#818cf8' }}>
                    <DollarSign size={20} />
                  </div>
                </div>
                <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '10px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <ArrowUpRight size={14} />
                  <span>Annualized: <strong>€{analytics.summary.annualized_run_rate?.toLocaleString()}</strong></span>
                </div>
              </div>

              <div className="glass-card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Monthly Net Profit Margin
                    </div>
                    <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>
                      €{analytics.summary.monthly_net_margin?.toLocaleString()}
                    </div>
                  </div>
                  <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                    <TrendingUp size={20} />
                  </div>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '10px' }}>
                  Weighted Margin Spread: <strong style={{ color: '#10b981' }}>{analytics.summary.overall_margin_pct}%</strong>
                </div>
              </div>

              <div className="glass-card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Active Headcount
                    </div>
                    <div style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
                      {analytics.summary.active_headcount} <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>/ {analytics.summary.total_headcount} Total</span>
                    </div>
                  </div>
                  <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: 'rgba(6, 182, 212, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#06b6d4' }}>
                    <Users size={20} />
                  </div>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '10px' }}>
                  100% Active Placement Utilization
                </div>
              </div>

              <div className="glass-card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                      Compliance Health
                    </div>
                    <div style={{ fontSize: '1.65rem', fontWeight: 800, color: '#38bdf8', marginTop: '4px' }}>
                      {analytics.compliance_metrics?.overall_compliant_pct}%
                    </div>
                  </div>
                  <div style={{ width: '38px', height: '38px', borderRadius: '8px', background: 'rgba(56, 189, 248, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8' }}>
                    <ShieldCheck size={20} />
                  </div>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '10px' }}>
                  VOG: <strong>{analytics.compliance_metrics?.vog_fulfillment_pct}%</strong> • SNA: <strong>{analytics.compliance_metrics?.sna_standard_pct}%</strong>
                </div>
              </div>

            </div>
          )}

          {/* Section 11 Charts Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
            
            {/* Chart 1: Revenue vs Cost (12-Month Commercial Run-rate Trend) */}
            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Revenue vs BA Cost (12-Month Commercial Trend)</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Gross bill rate vs consultant cost spread (€)</p>
                </div>
                <span className="badge badge-info" style={{ fontSize: '0.6875rem' }}>Commercial Run-Rate</span>
              </div>

              {analytics && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {analytics.commercial_trend_12m?.slice(-6).map((item) => (
                    <div key={item.month} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                        <span style={{ fontWeight: 600 }}>{item.month}</span>
                        <span style={{ color: 'var(--text-secondary)' }}>
                          Rev: <strong style={{ color: 'var(--text-primary)' }}>€{item.revenue.toLocaleString()}</strong> | Profit: <strong style={{ color: '#10b981' }}>€{item.profit.toLocaleString()} ({item.margin_pct}%)</strong>
                        </span>
                      </div>

                      <div style={{ display: 'flex', height: '8px', borderRadius: '4px', overflow: 'hidden', background: 'var(--bg-elevated)' }}>
                        <div style={{ width: `${(item.cost / item.revenue) * 100}%`, background: '#6366f1' }} title={`Cost: €${item.cost}`} />
                        <div style={{ width: `${(item.profit / item.revenue) * 100}%`, background: '#10b981' }} title={`Profit: €${item.profit}`} />
                      </div>
                    </div>
                  ))}
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '14px', fontSize: '0.6875rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <div style={{ width: '8px', height: '8px', background: '#6366f1', borderRadius: '2px' }} />
                      <span>BA Cost</span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                      <div style={{ width: '8px', height: '8px', background: '#10b981', borderRadius: '2px' }} />
                      <span>Net Spread</span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Chart 2: Active BAs by Client Concentration */}
            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Active BAs by Client & Margin Ranking</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Client headcount distribution and average margin %</p>
                </div>
                <span className="badge badge-neutral" style={{ fontSize: '0.6875rem' }}>Client Concentration</span>
              </div>

              {analytics && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {analytics.client_ranking?.map((client) => {
                    const maxCount = Math.max(...analytics.client_ranking.map(c => c.count), 1);
                    const pct = (client.count / maxCount) * 100;
                    return (
                      <div key={client.id} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem' }}>
                          <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{client.name}</span>
                          <span>
                            <strong>{client.count} BAs</strong> • <span style={{ color: '#10b981' }}>{client.avg_margin}% Avg Margin</span>
                          </span>
                        </div>
                        <div style={{ height: '7px', width: '100%', background: 'var(--bg-elevated)', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ width: `${pct}%`, height: '100%', background: 'linear-gradient(90deg, #6366f1 0%, #06b6d4 100%)', borderRadius: '4px' }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Chart 3: Agreement Expiry Risk Timeline (12 Months Projection) */}
            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Agreement Expiry Forecast (Next 12 Months)</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Contract end dates mapped across calendar timeline</p>
                </div>
                <span className="badge badge-warning" style={{ fontSize: '0.6875rem' }}>Risk Forecast</span>
              </div>

              {analytics && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px', alignItems: 'end', height: '140px', paddingTop: '20px' }}>
                  {analytics.expiry_projection_12m?.slice(0, 6).map((m) => {
                    const heightPct = m.expiring_count > 0 ? Math.min(m.expiring_count * 35, 100) : 10;
                    return (
                      <div key={m.month} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end', gap: '6px' }}>
                        <span style={{ fontSize: '0.7rem', fontWeight: 700, color: m.expiring_count > 0 ? '#f59e0b' : 'var(--text-muted)' }}>
                          {m.expiring_count}
                        </span>
                        <div style={{
                          width: '100%',
                          height: `${heightPct}%`,
                          background: m.expiring_count > 0 ? 'linear-gradient(180deg, #f59e0b 0%, rgba(245, 158, 11, 0.3) 100%)' : 'var(--bg-elevated)',
                          borderRadius: '4px 4px 0 0',
                          transition: 'all 0.2s ease'
                        }} />
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textAlign: 'center', whiteSpace: 'nowrap' }}>
                          {m.month.split(' ')[0]}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Chart 4: Expiry Risk Severity Buckets */}
            <div className="glass-card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Agreement Expiry Risk Buckets</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Active agreements classified by urgency days</p>
                </div>
                <span className="badge badge-danger" style={{ fontSize: '0.6875rem' }}>Urgency Matrix</span>
              </div>

              {analytics && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                  {analytics.expiry_risk_buckets?.map((bucket) => {
                    const isCrit = bucket.key === '7d' || bucket.key === '14d';
                    return (
                      <div
                        key={bucket.key}
                        style={{
                          background: isCrit && bucket.count > 0 ? 'rgba(244, 63, 94, 0.1)' : 'var(--bg-elevated)',
                          border: `1px solid ${isCrit && bucket.count > 0 ? 'rgba(244, 63, 94, 0.3)' : 'var(--border-subtle)'}`,
                          borderRadius: 'var(--radius-md)',
                          padding: '12px',
                          textAlign: 'center'
                        }}
                      >
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                          {bucket.bucket}
                        </div>
                        <div style={{ fontSize: '1.3rem', fontWeight: 800, color: isCrit && bucket.count > 0 ? '#f43f5e' : 'var(--text-primary)', marginTop: '2px' }}>
                          {bucket.count}
                        </div>
                        <div style={{ fontSize: '0.65rem', color: isCrit && bucket.count > 0 ? '#fb7185' : 'var(--text-muted)', textTransform: 'uppercase' }}>
                          {bucket.severity}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* ================= TAB 2: 10 STANDARD ENTERPRISE REPORTS ================= */}
      {activeTab === 'catalogue' && (
        <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '20px', alignItems: 'flex-start' }}>
          
          {/* Left Report Menu */}
          <div className="glass-card" style={{ padding: '12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div style={{ padding: '8px 10px', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Standard Enterprise Reports
            </div>

            {standardReports.map((rep) => {
              const Icon = rep.icon;
              const isSelected = selectedReport === rep.id;
              return (
                <button
                  key={rep.id}
                  onClick={() => setSelectedReport(rep.id)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    background: isSelected ? 'var(--accent-primary-light)' : 'transparent',
                    border: isSelected ? '1px solid var(--accent-primary)' : '1px solid transparent',
                    color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    textAlign: 'left',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
                    <Icon size={16} style={{ color: isSelected ? 'var(--accent-primary)' : 'inherit', flexShrink: 0 }} />
                    <span style={{ fontSize: '0.8125rem', fontWeight: isSelected ? 700 : 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {rep.name}
                    </span>
                  </div>
                  <span className="badge" style={{ fontSize: '0.625rem', padding: '1px 6px', background: 'var(--bg-elevated)' }}>
                    {rep.badge}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right Report Content & Table */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            {/* Table Header Filter & Search */}
            <div className="glass-card" style={{ padding: '16px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h2 style={{ fontSize: '1.15rem', fontWeight: 800 }}>
                  {standardReports.find(r => r.id === selectedReport)?.name}
                </h2>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {standardReports.find(r => r.id === selectedReport)?.desc}
                </p>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ position: 'relative' }}>
                  <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    placeholder="Search in report..."
                    value={catalogueSearch}
                    onChange={(e) => setCatalogueSearch(e.target.value)}
                    className="form-input"
                    style={{ paddingLeft: '32px', fontSize: '0.8125rem', padding: '6px 10px 6px 32px', width: '200px' }}
                  />
                </div>

                <button
                  onClick={() => handleExportCSV(selectedReport)}
                  className="btn btn-secondary btn-sm"
                >
                  <Download size={13} />
                  <span>CSV</span>
                </button>
              </div>
            </div>

            {/* Live Report Table */}
            <div className="table-container">
              <table className="custom-table">
                <thead>
                  {selectedReport === 'commercial' && (
                    <tr>
                      <th>BA ID</th>
                      <th>Consultant</th>
                      <th>Client</th>
                      <th>Client Rate</th>
                      <th>BA Pay Rate</th>
                      <th>Difference / Spread</th>
                      <th>Gross Margin %</th>
                    </tr>
                  )}
                  {selectedReport === 'active_ba' && (
                    <tr>
                      <th>BA ID</th>
                      <th>Consultant</th>
                      <th>Client</th>
                      <th>Role</th>
                      <th>Agreement End</th>
                      <th>Days Remaining</th>
                      <th>Margin %</th>
                      <th>Readiness</th>
                      <th>Compliance</th>
                    </tr>
                  )}
                  {selectedReport === 'agreement_expiry' && (
                    <tr>
                      <th>BA ID</th>
                      <th>Consultant</th>
                      <th>Client</th>
                      <th>Agreement #</th>
                      <th>End Date</th>
                      <th>Days Remaining</th>
                      <th>Extension Status</th>
                      <th>Urgency</th>
                    </tr>
                  )}
                  {selectedReport === 'compliance' && (
                    <tr>
                      <th>BA ID</th>
                      <th>Consultant</th>
                      <th>BGC Status</th>
                      <th>VOG Screening</th>
                      <th>Visa Status</th>
                      <th>SNA / NEN 4400-1</th>
                      <th>Overall Health</th>
                      <th>Last Verified</th>
                    </tr>
                  )}
                  {selectedReport === 'ba_master' && (
                    <tr>
                      <th>BA ID</th>
                      <th>Name</th>
                      <th>Client</th>
                      <th>Role</th>
                      <th>Employment Type</th>
                      <th>Country</th>
                      <th>Joining Date</th>
                      <th>Owner</th>
                    </tr>
                  )}
                  {selectedReport === 'extension_tracker' && (
                    <tr>
                      <th>BA ID</th>
                      <th>Consultant</th>
                      <th>Client</th>
                      <th>Agreement #</th>
                      <th>Seq</th>
                      <th>End Date</th>
                      <th>Extension Status</th>
                      <th>Owner</th>
                    </tr>
                  )}
                  {selectedReport === 'joining' && (
                    <tr>
                      <th>BA ID</th>
                      <th>Consultant</th>
                      <th>Client</th>
                      <th>Joining Date</th>
                      <th>Readiness</th>
                      <th>Source</th>
                      <th>Owner</th>
                    </tr>
                  )}
                  {selectedReport === 'exit' && (
                    <tr>
                      <th>BA ID</th>
                      <th>Consultant</th>
                      <th>Exit Date</th>
                      <th>Exit Reason</th>
                      <th>Country</th>
                    </tr>
                  )}
                  {selectedReport === 'agreement_history' && (
                    <tr>
                      <th>BA ID</th>
                      <th>Consultant</th>
                      <th>Agreement #</th>
                      <th>Seq</th>
                      <th>From Date</th>
                      <th>To Date</th>
                      <th>Client Rate</th>
                      <th>BA Rate</th>
                      <th>Status</th>
                    </tr>
                  )}
                  {selectedReport === 'audit_trail' && (
                    <tr>
                      <th>Timestamp</th>
                      <th>Action</th>
                      <th>Associate</th>
                      <th>Description</th>
                      <th>Actor</th>
                    </tr>
                  )}
                </thead>
                <tbody>
                  {loadingCatalogue ? (
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                        Loading report data...
                      </td>
                    </tr>
                  ) : catalogueData?.rows?.length === 0 ? (
                    <tr>
                      <td colSpan={8} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                        No records match the current filters.
                      </td>
                    </tr>
                  ) : (
                    catalogueData?.rows?.map((row, idx) => (
                      <tr 
                        key={idx} 
                        style={{ cursor: 'pointer' }}
                        onClick={() => row.id && onSelectAssociate(row.id)}
                        title="Click to view full 360° Profile"
                      >
                        {selectedReport === 'commercial' && (
                          <>
                            <td><code>{row.ba_id}</code></td>
                            <td style={{ fontWeight: 600 }}>{row.name}</td>
                            <td>{row.client}</td>
                            <td style={{ fontWeight: 600 }}>{row.client_rate}</td>
                            <td>{row.ba_rate}</td>
                            <td style={{ color: '#10b981', fontWeight: 600 }}>{row.difference}</td>
                            <td>
                              <span className="badge badge-success">{row.margin_percentage}</span>
                            </td>
                          </>
                        )}
                        {selectedReport === 'active_ba' && (
                          <>
                            <td><code>{row.ba_id}</code></td>
                            <td style={{ fontWeight: 600 }}>{row.name}</td>
                            <td>{row.client}</td>
                            <td>{row.role}</td>
                            <td>{row.agreement_end}</td>
                            <td><strong>{row.days_remaining}d</strong></td>
                            <td style={{ color: '#10b981', fontWeight: 600 }}>{row.margin_pct}</td>
                            <td>
                              <span className={`badge badge-${row.readiness === 'READY' ? 'ready' : (row.readiness === 'ACTION_REQUIRED' ? 'action' : 'not-ready')}`}>
                                {row.readiness}
                              </span>
                            </td>
                            <td>
                              <span className={`badge ${row.compliance === 'COMPLIANT' ? 'badge-success' : 'badge-danger'}`}>
                                {row.compliance}
                              </span>
                            </td>
                          </>
                        )}
                        {selectedReport === 'agreement_expiry' && (
                          <>
                            <td><code>{row.ba_id}</code></td>
                            <td style={{ fontWeight: 600 }}>{row.name}</td>
                            <td>{row.client}</td>
                            <td><code>{row.agreement_number}</code></td>
                            <td>{row.end_date}</td>
                            <td style={{ fontWeight: 800, color: row.urgency === 'CRITICAL' ? '#f43f5e' : '#f59e0b' }}>
                              {row.days_remaining} days
                            </td>
                            <td><span className="badge badge-info">{row.extension_status}</span></td>
                            <td>
                              <span className={`badge badge-${row.urgency === 'CRITICAL' ? 'danger' : (row.urgency === 'HIGH' ? 'warning' : 'neutral')}`}>
                                {row.urgency}
                              </span>
                            </td>
                          </>
                        )}
                        {selectedReport === 'compliance' && (
                          <>
                            <td><code>{row.ba_id}</code></td>
                            <td style={{ fontWeight: 600 }}>{row.name}</td>
                            <td>{row.bgc_status}</td>
                            <td>{row.vog_status}</td>
                            <td>{row.visa_status}</td>
                            <td>{row.sna_status}</td>
                            <td>
                              <span className={`badge ${row.overall_status === 'COMPLIANT' ? 'badge-success' : 'badge-danger'}`}>
                                {row.overall_status}
                              </span>
                            </td>
                            <td style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{row.last_verified}</td>
                          </>
                        )}
                        {selectedReport === 'ba_master' && (
                          <>
                            <td><code>{row.ba_id}</code></td>
                            <td style={{ fontWeight: 600 }}>{row.name}</td>
                            <td>{row.client}</td>
                            <td>{row.role}</td>
                            <td>{row.employment_type}</td>
                            <td>{row.country}</td>
                            <td>{row.joining_date}</td>
                            <td>{row.owner}</td>
                          </>
                        )}
                        {selectedReport === 'extension_tracker' && (
                          <>
                            <td><code>{row.ba_id}</code></td>
                            <td style={{ fontWeight: 600 }}>{row.name}</td>
                            <td>{row.client}</td>
                            <td><code>{row.agreement_number}</code></td>
                            <td>#{row.sequence}</td>
                            <td>{row.end_date}</td>
                            <td><span className="badge badge-info">{row.extension_status}</span></td>
                            <td>{row.owner}</td>
                          </>
                        )}
                        {selectedReport === 'joining' && (
                          <>
                            <td><code>{row.ba_id}</code></td>
                            <td style={{ fontWeight: 600 }}>{row.name}</td>
                            <td>{row.client}</td>
                            <td style={{ fontWeight: 600 }}>{row.joining_date}</td>
                            <td><span className={`badge badge-${row.readiness === 'READY' ? 'ready' : 'action'}`}>{row.readiness}</span></td>
                            <td>{row.source}</td>
                            <td>{row.owner}</td>
                          </>
                        )}
                        {selectedReport === 'exit' && (
                          <>
                            <td><code>{row.ba_id}</code></td>
                            <td style={{ fontWeight: 600 }}>{row.name}</td>
                            <td>{row.exit_date}</td>
                            <td>{row.exit_reason}</td>
                            <td>{row.country}</td>
                          </>
                        )}
                        {selectedReport === 'agreement_history' && (
                          <>
                            <td><code>{row.ba_id}</code></td>
                            <td style={{ fontWeight: 600 }}>{row.name}</td>
                            <td><code>{row.agreement_number}</code></td>
                            <td>#{row.sequence}</td>
                            <td>{row.from_date}</td>
                            <td>{row.to_date}</td>
                            <td>{row.client_rate}</td>
                            <td>{row.ba_rate}</td>
                            <td><span className="badge badge-neutral">{row.status}</span></td>
                          </>
                        )}
                        {selectedReport === 'audit_trail' && (
                          <>
                            <td style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{row.timestamp}</td>
                            <td><span className="badge badge-info">{row.action_type}</span></td>
                            <td style={{ fontWeight: 600 }}>{row.associate}</td>
                            <td>{row.description}</td>
                            <td style={{ fontWeight: 600, color: 'var(--accent-primary)' }}>{row.actor}</td>
                          </>
                        )}
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

          </div>

        </div>
      )}

      {/* ================= TAB 3: CUSTOM REPORT BUILDER ================= */}
      {activeTab === 'custom' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Builder Controls Card */}
          <div className="glass-card" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Custom Report Column & Filter Builder</h2>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                  Select the exact data attributes you want to analyze and export.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={handleGenerateCustom}
                  disabled={loadingCustom}
                  className="btn btn-secondary btn-sm"
                >
                  <RefreshCw size={14} className={loadingCustom ? 'spinning' : ''} />
                  <span>Update Table</span>
                </button>

                <button
                  onClick={() => handleExportCSV('custom')}
                  className="btn btn-primary btn-sm"
                >
                  <Download size={14} />
                  <span>Export Custom CSV</span>
                </button>
              </div>
            </div>

            {/* Field Picker Badges */}
            <div style={{ marginBottom: '20px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '8px' }}>
                Toggle Visible Columns ({customColumns.length} selected):
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {AVAILABLE_FIELDS.map((field) => {
                  const isChecked = customColumns.includes(field.id);
                  return (
                    <button
                      key={field.id}
                      onClick={() => toggleCustomColumn(field.id)}
                      style={{
                        background: isChecked ? 'var(--accent-primary-light)' : 'var(--bg-elevated)',
                        border: `1px solid ${isChecked ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                        color: isChecked ? 'var(--accent-primary)' : 'var(--text-secondary)',
                        padding: '5px 12px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.75rem',
                        fontWeight: isChecked ? 700 : 500,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}

                    >
                      {isChecked ? <CheckCircle2 size={12} style={{ color: 'var(--accent-primary)' }} /> : <div style={{ width: '12px', height: '12px', borderRadius: '50%', border: '1px solid var(--text-muted)' }} />}
                      <span>{field.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Multi-Dimensional Filter Bar */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-subtle)' }}>
              <div>
                <label className="form-label">Filter Readiness</label>
                <select
                  value={customFilterReadiness}
                  onChange={(e) => setCustomFilterReadiness(e.target.value)}
                  className="form-select"
                >
                  <option value="">All Readiness States</option>
                  <option value="READY">Ready</option>
                  <option value="ACTION_REQUIRED">Action Required</option>
                  <option value="NOT_READY">Not Ready</option>
                </select>
              </div>

              <div>
                <label className="form-label">Filter Contract Type</label>
                <select
                  value={customFilterEmpType}
                  onChange={(e) => setCustomFilterEmpType(e.target.value)}
                  className="form-select"
                >
                  <option value="">All Employment Types</option>
                  <option value="PAYROLL">Payroll (Direct)</option>
                  <option value="ZZP">ZZP (Freelance)</option>
                  <option value="SUBCONTRACTOR">Subcontractor</option>
                </select>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                <button
                  onClick={handleGenerateCustom}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '9px 16px' }}
                >
                  <Filter size={14} />
                  <span>Apply Filters & Recompute</span>
                </button>
              </div>
            </div>

          </div>

          {/* Custom Generated Table */}
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  {customColumns.map((colId) => {
                    const colObj = AVAILABLE_FIELDS.find(f => f.id === colId);
                    return <th key={colId}>{colObj?.label || colId}</th>;
                  })}
                </tr>
              </thead>
              <tbody>
                {loadingCustom ? (
                  <tr>
                    <td colSpan={customColumns.length} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                      Generating custom dataset...
                    </td>
                  </tr>
                ) : customReportData?.rows?.length === 0 ? (
                  <tr>
                    <td colSpan={customColumns.length} style={{ textAlign: 'center', padding: '32px', color: 'var(--text-muted)' }}>
                      No records match the custom criteria.
                    </td>
                  </tr>
                ) : (
                  customReportData?.rows?.map((row, idx) => (
                    <tr 
                      key={idx}
                      style={{ cursor: 'pointer' }}
                      onClick={() => row.id && onSelectAssociate(row.id)}
                      title="Click to view full 360° Profile"
                    >
                      {customColumns.map((colId) => (
                        <td key={colId}>
                          {colId === 'ba_id' ? <code>{row[colId]}</code> : (
                            colId === 'readiness' ? (
                              <span className={`badge badge-${row[colId] === 'READY' ? 'ready' : (row[colId] === 'ACTION_REQUIRED' ? 'action' : 'not-ready')}`}>
                                {row[colId]}
                              </span>
                            ) : (
                              colId === 'margin_pct' ? (
                                <strong style={{ color: '#10b981' }}>{row[colId]}</strong>
                              ) : (
                                row[colId] || '—'
                              )
                            )
                          )}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>
      )}

    </div>
  );
}
