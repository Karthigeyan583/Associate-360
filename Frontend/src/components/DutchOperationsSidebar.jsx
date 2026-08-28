import React, { useState } from 'react';
import { 
  X, ExternalLink, Calculator, Calendar, ShieldCheck, 
  Building2, Scale, Search, ArrowRight, Sparkles, ChevronRight,
  TrendingUp, CheckCircle, Clock, Info, Landmark, HelpCircle
} from 'lucide-react';

export default function DutchOperationsSidebar({ isOpen, onClose }) {
  // Built-in Quick Calculators State
  const [calcHourlyRate, setCalcHourlyRate] = useState('105');
  const [calcHoursPerMonth, setCalcHoursPerMonth] = useState('168');
  const [selectedMonth, setSelectedMonth] = useState('2026-09');
  const [kvkSearchQuery, setKvkSearchQuery] = useState('');

  if (!isOpen) return null;

  // Hourly to Monthly Calculation
  const hourlyNum = parseFloat(calcHourlyRate) || 0;
  const hoursNum = parseFloat(calcHoursPerMonth) || 0;
  const monthlyGross = (hourlyNum * hoursNum).toFixed(2);
  const estimatedNet = (hourlyNum * hoursNum * 0.62).toFixed(2); // ~38% effective tax estimate

  // Dutch working days per month (2025/2026 standard)
  const workingDaysMap = {
    '2026-01': { days: 21, holidays: 1, name: "New Year's Day (1 Jan)" },
    '2026-02': { days: 20, holidays: 0, name: "None" },
    '2026-03': { days: 22, holidays: 0, name: "None" },
    '2026-04': { days: 20, holidays: 2, name: "Easter Monday (6 Apr), King's Day (27 Apr)" },
    '2026-05': { days: 19, holidays: 2, name: "Liberation Day (5 May), Ascension Day (14 May)" },
    '2026-06': { days: 21, holidays: 1, name: "Whit Monday (25 May)" },
    '2026-07': { days: 23, holidays: 0, name: "None" },
    '2026-08': { days: 21, holidays: 0, name: "None" },
    '2026-09': { days: 22, holidays: 0, name: "None" },
    '2026-10': { days: 22, holidays: 0, name: "None" },
    '2026-11': { days: 21, holidays: 0, name: "None" },
    '2026-12': { days: 21, holidays: 2, name: "Christmas Days (25-26 Dec)" },
  };

  const selectedMonthData = workingDaysMap[selectedMonth] || { days: 22, holidays: 0, name: "Standard Month" };
  const billableHours = selectedMonthData.days * 8;

  const tools = [
    {
      id: 'salary-calc',
      title: 'ADP Netherlands Salary Calculator',
      category: 'Payroll & Compensation',
      icon: Calculator,
      color: '#10b981',
      bgColor: 'var(--color-success-bg)',
      borderColor: 'var(--color-success-border)',
      url: 'https://prepay.nl.adp.com/',
      description: 'Official ADP prepay net/gross salary estimator for 30% ruling, holiday allowance & payroll taxes.',
      actionLabel: 'Launch ADP Prepay'
    },
    {
      id: 'working-days',
      title: 'Working Days & Dutch Holidays 2025/2026',
      category: 'Time & Timesheet Billing',
      icon: Calendar,
      color: '#38bdf8',
      bgColor: 'var(--color-info-bg)',
      borderColor: 'var(--color-info-border)',
      url: 'https://netherlands.workingdays.org/workingdays_holidays_2025.htm#a3',
      description: 'Official working days, Dutch public holidays, weekend counts and billable hours calendar.',
      actionLabel: 'Open Holiday Calendar'
    },
    {
      id: 'sna-check',
      title: 'SNA Labour Standard Certification (NEN 4400-1)',
      category: 'Compliance & Verification',
      icon: ShieldCheck,
      color: '#f59e0b',
      bgColor: 'var(--color-warning-bg)',
      borderColor: 'var(--color-warning-border)',
      url: 'https://www.normeringarbeid.nl/',
      description: 'Stichting Normering Arbeid registry to verify staffing agencies and ZZP subcontracting compliance.',
      actionLabel: 'Verify SNA Register'
    },
    {
      id: 'kvk-check',
      title: 'KVK Chamber of Commerce Trade Search',
      category: 'Company & Entity Verification',
      icon: Building2,
      color: '#6366f1',
      bgColor: 'var(--accent-primary-light)',
      borderColor: 'rgba(79, 70, 229, 0.25)',
      url: 'https://www.kvk.nl/en/search/',
      description: 'Search official Dutch Handelsregister for B.V. registration, directors, UBO and active status.',
      actionLabel: 'Search KVK Trade Register'
    },
    {
      id: 'insolvency-check',
      title: 'Central Insolvency & Bankruptcy Register',
      category: 'Legal & Risk Assessment',
      icon: Scale,
      color: '#ec4899',
      bgColor: 'rgba(236, 72, 153, 0.1)',
      borderColor: 'rgba(236, 72, 153, 0.25)',
      url: 'https://insolventies.rechtspraak.nl/#!/#search',
      description: 'Search official Rechtspraak Central Insolvency Register (CIR) for Dutch corporate bankruptcies.',
      actionLabel: 'Check Insolvency Register'
    }
  ];

  const handleKvkSearch = (e) => {
    e.preventDefault();
    if (!kvkSearchQuery) {
      window.open('https://www.kvk.nl/en/search/', '_blank');
      return;
    }
    const searchUrl = `https://www.kvk.nl/en/search/?source=all&q=${encodeURIComponent(kvkSearchQuery)}`;
    window.open(searchUrl, '_blank');
  };

  return (
    <div className="drawer-overlay" onClick={onClose} style={{ zIndex: 1050 }}>
      <div 
        className="drawer-content" 
        style={{ maxWidth: '640px', background: 'var(--bg-secondary)', borderLeft: '1px solid var(--border-medium)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'var(--bg-elevated)',
          position: 'sticky',
          top: 0,
          zIndex: 20
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(79, 70, 229, 0.3)'
            }}>
              <Landmark size={22} strokeWidth={2.2} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  NL Operations Toolkit
                </h2>
                <span className="badge badge-info" style={{ fontSize: '0.65rem', fontWeight: 700 }}>
                  Official NL Portals
                </span>
              </div>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.78125rem', margin: '2px 0 0' }}>
                Quick salary calculators, working days, KVK checks, SNA & insolvency registers.
              </p>
            </div>
          </div>

          <button onClick={onClose} className="btn btn-secondary btn-icon" title="Close Toolkit">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Quick Interactive Widgets Section */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            
            {/* Widget 1: Working Days & Billable Hours Helper */}
            <div className="glass-card" style={{ padding: '16px 18px', background: 'var(--bg-card)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Calendar size={16} style={{ color: '#38bdf8' }} />
                  <span style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Quick Dutch Working Days Estimator
                  </span>
                </div>
                <a
                  href="https://netherlands.workingdays.org/workingdays_holidays_2025.htm#a3"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-secondary btn-sm"
                  style={{ padding: '3px 8px', fontSize: '0.7rem' }}
                >
                  <span>Calendar</span>
                  <ExternalLink size={11} />
                </a>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', alignItems: 'center' }}>
                <div className="form-group">
                  <label className="form-label" style={{ fontSize: '0.72rem' }}>Month (2026)</label>
                  <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    className="form-select"
                    style={{ height: '36px', fontSize: '0.8rem' }}
                  >
                    <option value="2026-01">Jan 2026</option>
                    <option value="2026-02">Feb 2026</option>
                    <option value="2026-03">Mar 2026</option>
                    <option value="2026-04">Apr 2026</option>
                    <option value="2026-05">May 2026</option>
                    <option value="2026-06">Jun 2026</option>
                    <option value="2026-07">Jul 2026</option>
                    <option value="2026-08">Aug 2026</option>
                    <option value="2026-09">Sep 2026</option>
                    <option value="2026-10">Oct 2026</option>
                    <option value="2026-11">Nov 2026</option>
                    <option value="2026-12">Dec 2026</option>
                  </select>
                </div>

                <div style={{ background: 'var(--bg-elevated)', padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Working Days</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-info)' }}>{selectedMonthData.days} Days</div>
                </div>

                <div style={{ background: 'var(--bg-elevated)', padding: '8px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Standard Hours</div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--color-success)' }}>{billableHours} hrs</div>
                </div>
              </div>

              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Info size={12} style={{ color: 'var(--color-info)', flexShrink: 0 }} />
                <span>Holidays: {selectedMonthData.name}</span>
              </div>
            </div>

            {/* Widget 2: KVK Quick Company Search Bar */}
            <div className="glass-card" style={{ padding: '16px 18px', background: 'var(--bg-card)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Building2 size={16} style={{ color: 'var(--accent-primary)' }} />
                  <span style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    KVK Trade Register Search
                  </span>
                </div>
                <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Kamer van Koophandel</span>
              </div>

              <form onSubmit={handleKvkSearch} style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text"
                  placeholder="Enter B.V. Name (e.g. DV LINX B.V.) or KVK #"
                  value={kvkSearchQuery}
                  onChange={(e) => setKvkSearchQuery(e.target.value)}
                  className="form-input"
                  style={{ height: '38px', flex: 1, fontSize: '0.82rem' }}
                />
                <button type="submit" className="btn btn-primary" style={{ height: '38px', padding: '0 14px' }}>
                  <Search size={14} />
                  <span>Search KVK</span>
                </button>
              </form>
            </div>

          </div>

          {/* Official Portals Directory */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Official Dutch Government & Payroll Portals
            </div>

            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <div
                  key={tool.id}
                  style={{
                    padding: '16px 18px',
                    borderRadius: 'var(--radius-lg)',
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-subtle)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    transition: 'border-color 0.15s ease, transform 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = tool.color;
                    e.currentTarget.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <div style={{
                        width: '38px',
                        height: '38px',
                        borderRadius: '9px',
                        background: tool.bgColor,
                        border: `1px solid ${tool.borderColor}`,
                        color: tool.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <Icon size={20} strokeWidth={2.2} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.7rem', color: tool.color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                          {tool.category}
                        </div>
                        <h3 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)', margin: '2px 0 0' }}>
                          {tool.title}
                        </h3>
                      </div>
                    </div>
                  </div>

                  <p style={{ fontSize: '0.78125rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.4 }}>
                    {tool.description}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid var(--border-subtle)' }}>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                      {tool.url.replace('https://', '').split('/')[0]}
                    </span>

                    <a
                      href={tool.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-secondary btn-sm"
                      style={{
                        padding: '4px 10px',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        gap: '6px',
                        color: tool.color,
                        borderColor: tool.borderColor
                      }}
                    >
                      <span>{tool.actionLabel}</span>
                      <ExternalLink size={12} />
                    </a>
                  </div>
                </div>
              );
            })}
          </div>

        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'var(--bg-elevated)',
          position: 'sticky',
          bottom: 0
        }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
            Staffing Compliance & Operations Suite
          </div>
          <button onClick={onClose} className="btn btn-secondary btn-sm">
            Close Toolkit
          </button>
        </div>
      </div>
    </div>
  );
}
