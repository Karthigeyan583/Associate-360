import React from 'react';
import { DollarSign, X, TrendingUp, ArrowUpRight, Users, Building, ArrowRight, CheckCircle2, BarChart2 } from 'lucide-react';

export default function FinanceDetailModal({ isOpen, onClose, stats, onSelectAssociate }) {
  if (!isOpen || !stats) return null;

  const overview = stats.overview || {};
  const financeAssociates = stats.finance_associates || [];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        style={{ maxWidth: '880px', maxHeight: '90vh', overflowY: 'auto' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '20px 28px',
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
              width: '42px',
              height: '42px',
              borderRadius: '10px',
              background: 'var(--color-success-bg)',
              color: 'var(--color-success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(16, 185, 129, 0.2)'
            }}>
              <DollarSign size={22} strokeWidth={2.2} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Total Profit Margin & Commercial Intelligence
              </h2>
              <div style={{ fontSize: '0.78125rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Real-time financial run-rate, monthly gross billing, consultant payroll cost & profit spreads.
              </div>
            </div>
          </div>

          <button onClick={onClose} className="btn btn-secondary btn-icon" title="Close">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
          
          {/* Top 4 Financial KPI Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px' }}>
            
            {/* Monthly Gross Revenue */}
            <div style={{ background: 'var(--bg-elevated)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Monthly Revenue</div>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '3px' }}>
                €{(overview.monthly_gross_revenue || 0).toLocaleString()}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-success)', marginTop: '4px', display: 'flex', alignItems: 'center', gap: '3px', fontWeight: 600 }}>
                <ArrowUpRight size={12} />
                <span>Annual: €{(overview.annualized_run_rate || 0).toLocaleString()}</span>
              </div>
            </div>

            {/* Monthly Payroll / BA Cost */}
            <div style={{ background: 'var(--bg-elevated)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Total BA Cost</div>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--text-secondary)', marginTop: '3px' }}>
                €{(overview.monthly_payroll_cost || 0).toLocaleString()}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Payroll: €{(overview.payroll_only_cost || 0).toLocaleString()}
              </div>
            </div>

            {/* Monthly Net Profit Margin */}
            <div style={{ background: 'var(--color-success-bg)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-success-border)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-success)', textTransform: 'uppercase', fontWeight: 700 }}>Net Profit Margin</div>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--color-success)', marginTop: '3px' }}>
                €{(overview.monthly_profit_margin || 0).toLocaleString()}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-success)', marginTop: '4px', fontWeight: 700 }}>
                Annual Profit: €{(overview.annualized_profit || 0).toLocaleString()}
              </div>
            </div>

            {/* Weighted Margin % */}
            <div style={{ background: 'var(--color-info-bg)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-info-border)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-info)', textTransform: 'uppercase', fontWeight: 700 }}>Weighted Margin %</div>
              <div style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--color-info)', marginTop: '3px' }}>
                {overview.weighted_margin_pct || overview.avg_margin_percentage || 0}%
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-info)', marginTop: '4px', fontWeight: 600 }}>
                Avg Spread: +€{overview.avg_spread_diff || 0}/h
              </div>
            </div>

          </div>

          {/* Granular Commercial Rate Breakdown Table */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <BarChart2 size={16} style={{ color: 'var(--accent-primary)' }} />
                <span>Consultant Commercials & Profit Contribution</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Based on 168 billable hours / month
              </span>
            </div>

            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Consultant & BA ID</th>
                    <th>Client Account</th>
                    <th>Client Rate</th>
                    <th>BA Pay Rate</th>
                    <th>Hourly Diff</th>
                    <th>Monthly Revenue</th>
                    <th>Monthly Profit</th>
                    <th>Margin %</th>
                    <th style={{ textAlign: 'right' }}>360°</th>
                  </tr>
                </thead>
                <tbody>
                  {financeAssociates.map((item) => (
                    <tr key={item.associate_id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          {item.photo_url ? (
                            <img
                              src={item.photo_url}
                              alt={item.full_name}
                              style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                            />
                          ) : (
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent-primary-light)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.75rem' }}>
                              {item.full_name?.[0]}
                            </div>
                          )}
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.84rem' }}>{item.full_name}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--accent-primary)', fontFamily: 'monospace' }}>{item.ba_id}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontWeight: 600 }}>{item.client_name}</span>
                      </td>
                      <td style={{ fontWeight: 700, color: 'var(--color-success)' }}>€{item.client_rate}/h</td>
                      <td style={{ fontWeight: 600 }}>€{item.ba_rate}/h</td>
                      <td style={{ fontWeight: 700, color: 'var(--color-info)' }}>+€{item.difference}/h</td>
                      <td style={{ fontWeight: 600 }}>€{item.monthly_revenue?.toLocaleString()}</td>
                      <td style={{ fontWeight: 700, color: 'var(--color-success)' }}>€{item.monthly_profit?.toLocaleString()}</td>
                      <td>
                        <span className="badge badge-info" style={{ fontWeight: 700, fontSize: '0.72rem' }}>
                          {item.margin_percentage}%
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          onClick={() => {
                            onClose();
                            onSelectAssociate(item.associate_id);
                          }}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '3px 8px', fontSize: '0.72rem' }}
                        >
                          <span>View 360°</span>
                          <ArrowRight size={11} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 28px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'var(--bg-elevated)'
        }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Financial calculations standardized for Dutch staffing operations
          </span>
          <button onClick={onClose} className="btn btn-secondary btn-sm">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
