import React from 'react';
import { Users, X, Building, ArrowRight, CheckCircle2 } from 'lucide-react';

export default function PlacementsDrilldownModal({ isOpen, onClose, associates = [], onSelectAssociate }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        style={{ maxWidth: '820px', maxHeight: '90vh', overflowY: 'auto' }}
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
              <Users size={22} strokeWidth={2.2} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Active Associate Placements Roster
              </h2>
              <div style={{ fontSize: '0.78125rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                All active consultants placed across client enterprise accounts.
              </div>
            </div>
          </div>

          <button onClick={onClose} className="btn btn-secondary btn-icon" title="Close">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px 28px' }}>
          <div className="table-container">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Consultant & Photo</th>
                  <th>Client Account</th>
                  <th>Role</th>
                  <th>Contract Type</th>
                  <th>Rates & Margin</th>
                  <th style={{ textAlign: 'right' }}>360°</th>
                </tr>
              </thead>
              <tbody>
                {associates.map((a) => {
                  const agr = a.current_agreement;
                  return (
                    <tr key={a.id}>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          {a.photo_url ? (
                            <img
                              src={a.photo_url}
                              alt={a.full_name}
                              style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                            />
                          ) : (
                            <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent-primary-light)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.75rem' }}>
                              {a.first_name?.[0]}
                            </div>
                          )}
                          <div>
                            <div style={{ fontWeight: 700, fontSize: '0.84rem' }}>{a.full_name}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--accent-primary)', fontFamily: 'monospace' }}>{a.ba_id}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span style={{ fontWeight: 600 }}>{a.current_client?.name || 'Unassigned'}</span>
                      </td>
                      <td>{a.primary_role}</td>
                      <td>
                        <span className="badge badge-info" style={{ fontSize: '0.7rem' }}>
                          {a.employment_type}
                        </span>
                      </td>
                      <td>
                        {agr ? (
                          <span style={{ fontWeight: 700, color: 'var(--color-success)', fontSize: '0.8rem' }}>
                            €{agr.client_rate}/h ({agr.margin_percentage}%)
                          </span>
                        ) : '—'}
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <button
                          onClick={() => {
                            onClose();
                            onSelectAssociate(a.id);
                          }}
                          className="btn btn-secondary btn-sm"
                          style={{ padding: '3px 8px', fontSize: '0.72rem' }}
                        >
                          <span>View 360°</span>
                          <ArrowRight size={11} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
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
