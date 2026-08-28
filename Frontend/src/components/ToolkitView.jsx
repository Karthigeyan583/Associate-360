import React, { useState } from 'react';
import { 
  Calculator, Calendar, ShieldCheck, Building2, Scale, 
  ExternalLink, Search, Info, ArrowUpRight, DollarSign,
  Clock, CheckCircle, ArrowRight, Landmark, Sparkles, FileText
} from 'lucide-react';

export default function ToolkitView() {
  // Built-in Quick Calculators State
  const [calcHourlyRate, setCalcHourlyRate] = useState('105');
  const [calcHoursPerWeek, setCalcHoursPerWeek] = useState('40');
  const [has30Ruling, setHas30Ruling] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState('2026-09');
  const [kvkSearchQuery, setKvkSearchQuery] = useState('');

  // Calculations
  const hourlyNum = parseFloat(calcHourlyRate) || 0;
  const hoursWeekNum = parseFloat(calcHoursPerWeek) || 40;
  const monthlyHours = (hoursWeekNum * 4.333).toFixed(0);
  const monthlyGross = (hourlyNum * monthlyHours).toFixed(2);
  const effectiveTaxRate = has30Ruling ? 0.28 : 0.38; // estimated with 30% ruling vs standard
  const estimatedNet = (monthlyGross * (1 - effectiveTaxRate)).toFixed(2);

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
  const billableMonthlyTotal = (billableHours * hourlyNum).toFixed(2);

  const portals = [
    {
      id: 'salary-calc',
      title: 'ADP Netherlands Salary Calculator',
      category: 'Payroll & Taxation',
      icon: Calculator,
      color: 'var(--color-success)',
      bgColor: 'var(--color-success-bg)',
      borderColor: 'var(--color-success-border)',
      url: 'https://prepay.nl.adp.com/',
      description: 'Official ADP prepay salary calculator for gross-to-net tax simulations, 30% ruling exemption, holiday allowance (8%), and Dutch payroll tax brackets.',
      features: [
        'Gross-to-net wage simulation',
        '30% facility tax exemption',
        'Holiday allowance (vakantiegeld 8%)',
        'Social security & pension contributions'
      ],
      actionLabel: 'Launch ADP Prepay'
    },
    {
      id: 'working-days',
      title: 'Working Days & Dutch Holidays (2025/2026)',
      category: 'Time & Timesheet Billing',
      icon: Calendar,
      color: 'var(--color-info)',
      bgColor: 'var(--color-info-bg)',
      borderColor: 'var(--color-info-border)',
      url: 'https://netherlands.workingdays.org/workingdays_holidays_2025.htm#a3',
      description: 'Official working days calendar for the Netherlands detailing public holidays, weekend counts, total monthly business days, and billable hour benchmarks.',
      features: [
        'Official Dutch public holidays',
        'Monthly working days count (20-23 days)',
        'Standard 8-hour workday billing benchmarks',
        'Quarterly billable hours projections'
      ],
      actionLabel: 'Open Holiday Calendar'
    },
    {
      id: 'sna-check',
      title: 'SNA Labour Standards Register (NEN 4400-1)',
      category: 'Compliance & Verification',
      icon: ShieldCheck,
      color: 'var(--color-warning)',
      bgColor: 'var(--color-warning-bg)',
      borderColor: 'var(--color-warning-border)',
      url: 'https://www.normeringarbeid.nl/',
      description: 'Stichting Normering Arbeid official registry to verify staffing agencies and subcontracting B.V.s for Dutch labor tax compliance and NEN 4400-1 certification.',
      features: [
        'NEN 4400-1 certification verification',
        'Waadi registration check',
        'Direct screening of subcontracting entities',
        'Protection against sequential liability'
      ],
      actionLabel: 'Verify SNA Register'
    },
    {
      id: 'kvk-check',
      title: 'KVK Trade Register (Kamer van Koophandel)',
      category: 'Company & Entity Verification',
      icon: Building2,
      color: 'var(--accent-primary)',
      bgColor: 'var(--accent-primary-light)',
      borderColor: 'rgba(79, 70, 229, 0.25)',
      url: 'https://www.kvk.nl/en/search/',
      description: 'Official Dutch Chamber of Commerce Handelsregister. Verify B.V. company registration, authorized directors, registered address, and active corporate status.',
      features: [
        'Dutch B.V. & ZZP registration check',
        'Authorized signing directors & UBO',
        'Official trade names & SBI codes',
        'Annual financial statement filings'
      ],
      actionLabel: 'Search KVK Register'
    },
    {
      id: 'insolvency-check',
      title: 'Central Insolvency Register (CIR - Rechtspraak)',
      category: 'Legal & Risk Assessment',
      icon: Scale,
      color: '#ec4899',
      bgColor: 'rgba(236, 72, 153, 0.1)',
      borderColor: 'rgba(236, 72, 153, 0.25)',
      url: 'https://insolventies.rechtspraak.nl/#!/#search',
      description: 'Official Dutch judiciary Central Insolvency Register to check for bankruptcy orders, moratoria of payments (surseance van betaling), and debt restructuring.',
      features: [
        'Corporate bankruptcy verification',
        'Suspension of payments monitoring',
        'Judiciary court order history',
        'Vendor & subcontractor solvency checks'
      ],
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
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Page Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '9px',
              background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(79, 70, 229, 0.25)'
            }}>
              <Landmark size={20} strokeWidth={2.2} />
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              NL Operations & Compliance Toolkit
            </h1>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '6px' }}>
            Official Dutch staffing portals, gross-to-net salary calculators, working days calendars, KVK searches & SNA compliance checks.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <span className="badge badge-info" style={{ padding: '6px 12px', fontSize: '0.78rem' }}>
            5 Official Dutch Portals
          </span>
          <span className="badge badge-ready" style={{ padding: '6px 12px', fontSize: '0.78rem' }}>
            Live Calculators Active
          </span>
        </div>
      </div>

      {/* Row 1: Interactive Quick Calculators & Tools */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.3fr) minmax(0, 1.7fr)', gap: '20px' }}>
        
        {/* Tool 1: Salary & Net-to-Gross Quick Simulator */}
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ background: 'var(--color-success-bg)', color: 'var(--color-success)', padding: '6px', borderRadius: '8px' }}>
                <Calculator size={18} />
              </div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Quick Salary & Tax Estimator</h2>
            </div>

            <a
              href="https://prepay.nl.adp.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-sm"
              style={{ padding: '4px 10px', fontSize: '0.75rem' }}
            >
              <span>Official ADP Prepay</span>
              <ExternalLink size={12} />
            </a>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Hourly Bill Rate (€/h)</label>
              <input
                type="number"
                value={calcHourlyRate}
                onChange={(e) => setCalcHourlyRate(e.target.value)}
                className="form-input"
                placeholder="105"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Hours / Week</label>
              <select
                value={calcHoursPerWeek}
                onChange={(e) => setCalcHoursPerWeek(e.target.value)}
                className="form-select"
              >
                <option value="40">40 hrs / week (Full time)</option>
                <option value="36">36 hrs / week (Dutch standard)</option>
                <option value="32">32 hrs / week (4 days)</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', borderRadius: 'var(--radius-md)', background: 'var(--bg-elevated)', border: '1px solid var(--border-subtle)' }}>
            <input
              type="checkbox"
              id="rulingCheck"
              checked={has30Ruling}
              onChange={(e) => setHas30Ruling(e.target.checked)}
              style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: 'var(--accent-primary)' }}
            />
            <label htmlFor="rulingCheck" style={{ fontSize: '0.8125rem', color: 'var(--text-primary)', cursor: 'pointer', fontWeight: 500 }}>
              Apply 30% Ruling Facility (Knowledge Migrant / HSM Tax Exemption)
            </label>
          </div>

          {/* Result Box */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <div style={{ background: 'var(--bg-elevated)', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Monthly Gross Billing</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                €{Number(monthlyGross).toLocaleString()}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>~{monthlyHours} billable hours/mo</div>
            </div>

            <div style={{ background: 'var(--color-success-bg)', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-success-border)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-success)', textTransform: 'uppercase', fontWeight: 700 }}>Estimated Net Payout</div>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-success)', marginTop: '2px' }}>
                €{Number(estimatedNet).toLocaleString()}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-success)', marginTop: '2px', fontWeight: 600 }}>
                {has30Ruling ? 'With 30% Tax Ruling' : 'Standard Dutch Tax'}
              </div>
            </div>
          </div>
        </div>

        {/* Tool 2: Dutch Working Days & Holidays Calendar */}
        <div className="glass-card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ background: 'var(--color-info-bg)', color: 'var(--color-info)', padding: '6px', borderRadius: '8px' }}>
                <Calendar size={18} />
              </div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>Dutch Working Days & Billing Hours (2026)</h2>
            </div>

            <a
              href="https://netherlands.workingdays.org/workingdays_holidays_2025.htm#a3"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-secondary btn-sm"
              style={{ padding: '4px 10px', fontSize: '0.75rem' }}
            >
              <span>Full Calendar</span>
              <ExternalLink size={12} />
            </a>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '12px', alignItems: 'center' }}>
            <div className="form-group">
              <label className="form-label">Select Month (2026)</label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                className="form-select"
              >
                <option value="2026-01">January 2026</option>
                <option value="2026-02">February 2026</option>
                <option value="2026-03">March 2026</option>
                <option value="2026-04">April 2026</option>
                <option value="2026-05">May 2026</option>
                <option value="2026-06">June 2026</option>
                <option value="2026-07">July 2026</option>
                <option value="2026-08">August 2026</option>
                <option value="2026-09">September 2026</option>
                <option value="2026-10">October 2026</option>
                <option value="2026-11">November 2026</option>
                <option value="2026-12">December 2026</option>
              </select>
            </div>

            <div style={{ background: 'var(--bg-elevated)', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Working Days</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-info)', marginTop: '2px' }}>
                {selectedMonthData.days} Days
              </div>
            </div>

            <div style={{ background: 'var(--bg-elevated)', padding: '10px 12px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Standard Hours</div>
              <div style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--color-success)', marginTop: '2px' }}>
                {billableHours} hrs
              </div>
            </div>
          </div>

          {/* Holiday Alert Box */}
          <div style={{ background: 'var(--bg-elevated)', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Info size={16} style={{ color: 'var(--color-info)', flexShrink: 0 }} />
              <div>
                <span style={{ fontSize: '0.78125rem', fontWeight: 600, color: 'var(--text-primary)' }}>Official Public Holidays: </span>
                <span style={{ fontSize: '0.78125rem', color: 'var(--text-secondary)' }}>{selectedMonthData.name}</span>
              </div>
            </div>

            <div style={{ fontSize: '0.78125rem', fontWeight: 700, color: 'var(--color-success)', whiteSpace: 'nowrap' }}>
              €{Number(billableMonthlyTotal).toLocaleString()} @ €{calcHourlyRate}/h
            </div>
          </div>

          {/* KVK Search Shortcut */}
          <form onSubmit={handleKvkSearch} style={{ display: 'flex', gap: '8px' }}>
            <div style={{ position: 'relative', flex: 1 }}>
              <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                placeholder="Search KVK Trade Register (e.g. DV LINX B.V. or KVK #)"
                value={kvkSearchQuery}
                onChange={(e) => setKvkSearchQuery(e.target.value)}
                className="form-input"
                style={{ paddingLeft: '36px' }}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              <span>Search KVK</span>
              <ExternalLink size={13} />
            </button>
          </form>
        </div>

      </div>

      {/* Row 2: Official Portals Master Directory Cards */}
      <div>
        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '14px' }}>
          Official Dutch Government & Regulatory Portals Directory
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
          {portals.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.id}
                className="glass-card"
                style={{
                  padding: '22px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px',
                  transition: 'border-color 0.15s ease, transform 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = p.color;
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '10px',
                    background: p.bgColor,
                    border: `1px solid ${p.borderColor}`,
                    color: p.color,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}>
                    <Icon size={22} strokeWidth={2.2} />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.7rem', color: p.color, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      {p.category}
                    </div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: '2px 0 0' }}>
                      {p.title}
                    </h3>
                  </div>
                </div>

                {/* Description */}
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.45 }}>
                  {p.description}
                </p>

                {/* Feature Checklist */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', background: 'var(--bg-elevated)', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  {p.features.map((feat, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      <CheckCircle size={13} style={{ color: p.color, flexShrink: 0 }} />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>

                {/* Action Link Button */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)', marginTop: 'auto' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                    {p.url.replace('https://', '').split('/')[0]}
                  </span>

                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary btn-sm"
                    style={{
                      gap: '6px',
                      fontWeight: 700,
                      color: p.color,
                      borderColor: p.borderColor
                    }}
                  >
                    <span>{p.actionLabel}</span>
                    <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
