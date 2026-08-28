import React from 'react';
import { DollarSign, X, Users, Briefcase, Building, ArrowRight, Wallet, PieChart } from 'lucide-react';

export default function PayrollCostModal({ isOpen, onClose, stats, onSelectAssociate }) {
  if (!isOpen || !stats) return null;

  const overview = stats.overview || {};
  const financeAssociates = stats.finance_associates || [];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        style={{ maxWidth: '840px', maxHeight: '90vh', overflowY: 'auto' }}
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
              background: 'var(--accent-primary-light)',
              color: 'var(--accent-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(79, 70, 229, 0.2)'
            }}>
              <Wallet size={22} strokeWidth={2.2} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Total Payroll & Consultant Cost Breakdown
              </h2>
              <div style={{ fontSize: '0.78125rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Payroll, ZZP Freelance & Subcontractor expenditure distribution.
              </div>
            </div>
          </div>

          <button onClick={onClose} className="btn btn-secondary btn-icon" title="Close">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '22px' }}>
          
          {/* Top 3 Cost Buckets */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
            
            {/* Total Cost */}
            <div style={{ background: 'var(--bg-elevated)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Total Monthly BA Cost</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
                €{(overview.monthly_payroll_cost || 0).toLocaleString()}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                Annualized Cost: <strong>€{((overview.monthly_payroll_cost || 0) * 12).toLocaleString()}</strong>
              </div>
            </div>

            {/* Permanent Payroll Cost */}
            <div style={{ background: 'var(--bg-elevated)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Permanent Payroll Cost</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--accent-primary)', marginTop: '4px' }}>
                €{(overview.payroll_only_cost || 0).toLocaleString()}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                Internal Payroll Staff
              </div>
            </div>

            {/* ZZP / Freelance Cost */}
            <div style={{ background: 'var(--bg-elevated)', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>ZZP & Subcontractor Cost</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--color-info)', marginTop: '4px' }}>
                €{((overview.zzp_freelance_cost || 0) + (overview.subcontractor_cost || 0)).toLocaleString()}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                ZZP: €{(overview.zzp_freelance_cost || 0).toLocaleString()} • Sub: €{(overview.subcontractor_cost || 0).toLocaleString()}
              </div>
            </div>

          </div>

          {/* Individual Consultant Cost Roster */}
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Users size={16} style={{ color: 'var(--accent-primary)' }} />
              <span>Consultant Pay Rates & Monthly Cost Distribution</span>
            </div>

            <div className="table-container">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Consultant</th>
                    <th>Employment Type</th>
                    <th>Client Account</th>
                    <th>Pay Rate (€/h)</th>
                    <th>Monthly Cost (€)</th>
                    <th style={{ textAlign: 'right' }}>Action</th>
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
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>{item.ba_id}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>
                          {item.employment_type}
                        </span>
                      </td>
                      <td>{item.client_name}</td>
                      <td style={{ fontWeight: 700, color: 'var(--text-primary)' }}>€{item.ba_rate}/h</td>
                      <td style={{ fontWeight: 700, color: 'var(--color-info)' }}>€{item.monthly_cost?.toLocaleString()}</td>
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
          justifyContent: 'flex-end',
          background: 'var(--bg-elevated)'
        }}>
          <button onClick={onClose} className="btn btn-secondary btn-sm">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
