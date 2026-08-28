import React from 'react';
import { ShieldCheck, X, CheckCircle2, AlertTriangle, XCircle, ArrowRight, User } from 'lucide-react';

export default function ReadinessDrilldownModal({ isOpen, onClose, associates = [], onSelectAssociate }) {
  if (!isOpen) return null;

  const readyList = associates.filter(a => a.readiness_status === 'READY');
  const actionList = associates.filter(a => a.readiness_status === 'ACTION_REQUIRED');
  const blockedList = associates.filter(a => a.readiness_status === 'NOT_READY');

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
              background: 'var(--color-success-bg)',
              color: 'var(--color-success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 2px 8px rgba(16, 185, 129, 0.2)'
            }}>
              <CheckCircle2 size={22} strokeWidth={2.2} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Operational Readiness Breakdown
              </h2>
              <div style={{ fontSize: '0.78125rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                Consultant deployment readiness, missing compliance screening & blocker details.
              </div>
            </div>
          </div>

          <button onClick={onClose} className="btn btn-secondary btn-icon" title="Close">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Readiness Summary Pills */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            <div style={{ background: 'var(--color-success-bg)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-success-border)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-success)', textTransform: 'uppercase', fontWeight: 700 }}>Ready for Placement</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-success)', marginTop: '2px' }}>{readyList.length}</div>
            </div>

            <div style={{ background: 'var(--color-warning-bg)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-warning-border)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-warning)', textTransform: 'uppercase', fontWeight: 700 }}>Action Required</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-warning)', marginTop: '2px' }}>{actionList.length}</div>
            </div>

            <div style={{ background: 'var(--color-danger-bg)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-danger-border)', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--color-danger)', textTransform: 'uppercase', fontWeight: 700 }}>Blocked / Not Ready</div>
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--color-danger)', marginTop: '2px' }}>{blockedList.length}</div>
            </div>
          </div>

          {/* Action Required & Blocked Consultants List */}
          <div>
            <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '12px' }}>
              Consultants Requiring Operational Attention ({actionList.length + blockedList.length})
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[...actionList, ...blockedList].map((a) => (
                <div
                  key={a.id}
                  style={{
                    padding: '12px 16px',
                    borderRadius: 'var(--radius-md)',
                    background: a.readiness_status === 'NOT_READY' ? 'var(--color-danger-bg)' : 'var(--color-warning-bg)',
                    border: `1px solid ${a.readiness_status === 'NOT_READY' ? 'var(--color-danger-border)' : 'var(--color-warning-border)'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    {a.photo_url ? (
                      <img src={a.photo_url} alt={a.full_name} style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--bg-elevated)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>
                        {a.first_name?.[0]}
                      </div>
                    )}
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{a.full_name}</span>
                        <span className="badge badge-info" style={{ fontSize: '0.65rem' }}>{a.ba_id}</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        {a.primary_role} • Client: {a.current_client?.name || 'Unassigned'}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <span className={`badge badge-${a.readiness_status === 'NOT_READY' ? 'danger' : 'warning'}`}>
                      {a.readiness_status}
                    </span>
                    <button
                      onClick={() => {
                        onClose();
                        onSelectAssociate(a.id);
                      }}
                      className="btn btn-secondary btn-sm"
                    >
                      <span>Resolve in BA 360°</span>
                      <ArrowRight size={11} />
                    </button>
                  </div>
                </div>
              ))}
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
