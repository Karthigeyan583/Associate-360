import React from 'react';
import { Clock, X, AlertTriangle, ArrowRight, Building, Calendar, DollarSign } from 'lucide-react';

export default function ExpiringAgreementsModal({ isOpen, onClose, stats, associates = [], onSelectAssociate }) {
  if (!isOpen) return null;

  const overview = stats?.overview || {};
  const urgentActions = stats?.urgent_actions?.filter(a => a.type === 'AGREEMENT_EXPIRY') || [];

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
              background: 'var(--color-warning-bg)',
              color: 'var(--color-warning)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(245, 158, 11, 0.2)'
            }}>
              <Clock size={22} strokeWidth={2.2} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Agreement Expiry Urgency Radar
              </h2>
              <div style={{ fontSize: '0.78125rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Client agreements approaching contract end dates categorized by urgency horizon.
              </div>
            </div>
          </div>

          <button onClick={onClose} className="btn btn-secondary btn-icon" title="Close">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Expiry Horizon Buckets */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            <div style={{ background: 'var(--color-danger-bg)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-danger-border)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-danger)', textTransform: 'uppercase', fontWeight: 700 }}>≤ 7 Days Left</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-danger)', marginTop: '2px' }}>{overview.expiring_7d || 0}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-danger)' }}>Immediate extension action</div>
            </div>

            <div style={{ background: 'var(--color-warning-bg)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-warning-border)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-warning)', textTransform: 'uppercase', fontWeight: 700 }}>≤ 14 Days Left</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-warning)', marginTop: '2px' }}>{overview.expiring_14d || 0}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-warning)' }}>Client negotiation active</div>
            </div>

            <div style={{ background: 'var(--bg-elevated)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>≤ 30 Days Left</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>{overview.expiring_30d || 0}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Initiate extension process</div>
            </div>
          </div>

          {/* Expiring Agreements List */}
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>
              Expiring Client Agreements ({urgentActions.length})
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {urgentActions.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)' }}>
                  No urgent expiring contracts found.
                </div>
              ) : (
                urgentActions.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      padding: '12px 16px',
                      borderRadius: 'var(--radius-md)',
                      background: item.urgency === 'CRITICAL' ? 'var(--color-danger-bg)' : 'var(--bg-elevated)',
                      border: `1px solid ${item.urgency === 'CRITICAL' ? 'var(--color-danger-border)' : 'var(--border-subtle)'}`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: '12px'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{item.associate_name}</span>
                        <span className="badge badge-info" style={{ fontSize: '0.65rem' }}>{item.ba_id}</span>
                        <span className={`badge badge-${item.urgency === 'CRITICAL' ? 'danger' : 'warning'}`} style={{ fontSize: '0.65rem' }}>
                          {item.urgency}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        Client: <strong>{item.client_name}</strong> • End Date: <strong>{item.end_date}</strong> ({item.days_remaining} days left)
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        onClose();
                        onSelectAssociate(item.associate_id);
                      }}
                      className="btn btn-secondary btn-sm"
                    >
                      <span>Extend in BA 360°</span>
                      <ArrowRight size={11} />
                    </button>
                  </div>
                ))
              )}
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
