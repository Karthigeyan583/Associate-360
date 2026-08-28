import React, { useState, useEffect } from 'react';
import { Building, X, Users, MapPin, Mail, DollarSign, Calendar, ArrowRight, CheckCircle2 } from 'lucide-react';
import { apiService } from '../services/api';

export default function ClientDetailModal({ client, isOpen, onClose, onSelectAssociate }) {
  const [associates, setAssociates] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (client && isOpen) {
      setLoading(true);
      apiService.getAssociates({ client: client.id })
        .then(data => setAssociates(data))
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [client, isOpen]);

  if (!isOpen || !client) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        style={{ maxWidth: '680px' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'var(--bg-elevated)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              background: 'var(--accent-primary-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1rem',
              color: 'var(--accent-primary)'
            }}>
              {client.name.slice(0, 2).toUpperCase()}
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                  {client.name}
                </h2>
                <span className="badge badge-info">{client.code}</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                {client.industry} • {client.country}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Account Metadata Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            <div style={{ background: 'var(--bg-elevated)', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Active Headcount</div>
              <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '2px' }}>
                {client.active_associates_count || associates.length} BAs
              </div>
            </div>

            <div style={{ background: 'var(--bg-elevated)', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Primary Contact</div>
              <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '4px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {client.contact_name || 'Account Director'}
              </div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{client.contact_email || 'contact@client.nl'}</div>
            </div>

            <div style={{ background: 'var(--bg-elevated)', padding: '12px 14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Account Status</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '6px' }}>
                <CheckCircle2 size={15} style={{ color: '#10b981' }} />
                <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: '#10b981' }}>Active Client</span>
              </div>
            </div>
          </div>

          {/* Active Placed Associates Table */}
          <div>
            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Users size={16} style={{ color: 'var(--accent-primary)' }} />
              <span>Active Consultant Placements at {client.name}</span>
            </div>

            {loading ? (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
                Loading placed consultants...
              </div>
            ) : associates.length === 0 ? (
              <div style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8125rem', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)' }}>
                No active consultants currently assigned to this account.
              </div>
            ) : (
              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>BA ID</th>
                      <th>Consultant</th>
                      <th>Role</th>
                      <th>Rates & Margin</th>
                      <th>Readiness</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {associates.map((a) => {
                      const agr = a.current_agreement;
                      return (
                        <tr key={a.id}>
                          <td><code>{a.ba_id}</code></td>
                          <td style={{ fontWeight: 600 }}>{a.first_name} {a.last_name}</td>
                          <td>{a.primary_role}</td>
                          <td>
                            {agr ? (
                              <span style={{ color: '#10b981', fontWeight: 600, fontSize: '0.78rem' }}>
                                €{agr.client_rate}/h ({agr.margin_percentage}%)
                              </span>
                            ) : '—'}
                          </td>
                          <td>
                            <span className={`badge badge-${a.readiness_status === 'READY' ? 'ready' : (a.readiness_status === 'ACTION_REQUIRED' ? 'action' : 'not-ready')}`}>
                              {a.readiness_status}
                            </span>
                          </td>
                          <td>
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
            )}
          </div>

        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 24px',
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
