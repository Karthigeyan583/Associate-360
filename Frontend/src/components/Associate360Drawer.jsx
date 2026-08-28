import React, { useState } from 'react';
import { 
  X, User, Building, Calendar, DollarSign, ShieldCheck, 
  FileText, Clock, CheckCircle, AlertTriangle, XCircle, 
  Plus, ArrowRight, RefreshCw, Mail, Phone, MapPin, Tag, Activity,
  Globe, Key, Briefcase, Camera, ChevronRight, Layers
} from 'lucide-react';
import { apiService } from '../services/api';

export default function Associate360Drawer({ associate, onClose, onRefreshData }) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'agreements' | 'compliance' | 'activity'
  const [isExtending, setIsExtending] = useState(false);
  const [extensionForm, setExtensionForm] = useState({
    start_date: '',
    end_date: '',
    client_rate: '',
    ba_rate: '',
  });
  const [loadingAction, setLoadingAction] = useState(false);

  if (!associate) return null;

  const currentAgreement = associate.current_agreement;
  const compliance = associate.compliance || {};
  const agreements = associate.agreements ? [...associate.agreements].sort((a, b) => (a.sequence || 1) - (b.sequence || 1)) : [];
  const activities = associate.activities || [];

  const handleStartExtension = () => {
    if (currentAgreement) {
      setExtensionForm({
        start_date: currentAgreement.end_date,
        end_date: '',
        client_rate: currentAgreement.client_rate,
        ba_rate: currentAgreement.ba_rate,
      });
    }
    setIsExtending(true);
  };

  const handleSubmitExtension = async (e) => {
    e.preventDefault();
    setLoadingAction(true);
    try {
      await apiService.extendAgreement(associate.id, extensionForm);
      setIsExtending(false);
      onRefreshData();
    } catch (err) {
      alert(`Failed to extend agreement: ${err.message}`);
    } finally {
      setLoadingAction(false);
    }
  };

  const handleUpdateComplianceStatus = async (newStatus) => {
    setLoadingAction(true);
    try {
      await apiService.updateCompliance(associate.id, { overall_status: newStatus });
      onRefreshData();
    } catch (err) {
      alert(`Failed to update compliance: ${err.message}`);
    } finally {
      setLoadingAction(false);
    }
  };

  const getReadinessBadge = (status) => {
    switch (status) {
      case 'READY':
        return <span className="badge badge-ready"><CheckCircle size={12} /> Ready</span>;
      case 'ACTION_REQUIRED':
        return <span className="badge badge-action"><AlertTriangle size={12} /> Action Req.</span>;
      case 'NOT_READY':
        return <span className="badge badge-not-ready"><XCircle size={12} /> Not Ready</span>;
      default:
        return <span className="badge badge-neutral">{status}</span>;
    }
  };

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer-content" onClick={(e) => e.stopPropagation()}>
        
        {/* Top Sticky Header */}
        <div style={{
          padding: '24px 28px 18px',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'var(--bg-card)',
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
            
            {/* BA Profile Photo & Title */}
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
              <div style={{ position: 'relative' }}>
                {associate.photo_url ? (
                  <img
                    src={associate.photo_url}
                    alt={associate.full_name}
                    style={{
                      width: '64px',
                      height: '64px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2.5px solid var(--accent-primary)',
                      boxShadow: '0 4px 12px rgba(79, 70, 229, 0.25)',
                      flexShrink: 0
                    }}
                  />
                ) : (
                  <div style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '1.35rem',
                    fontWeight: 800,
                    color: '#ffffff',
                    flexShrink: 0
                  }}>
                    {associate.first_name?.[0]}{associate.last_name?.[0]}
                  </div>
                )}
                <div 
                  className={`pulse-dot ${associate.employment_status === 'ACTIVE' ? 'online' : 'offline'}`}
                  style={{ position: 'absolute', bottom: '2px', right: '2px', border: '2px solid var(--bg-card)' }}
                />
              </div>


              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                    {associate.full_name}
                  </h2>

                  <span style={{ fontSize: '0.8125rem', fontFamily: 'monospace', color: 'var(--accent-primary)', background: 'var(--accent-primary-light)', padding: '2px 8px', borderRadius: '4px', fontWeight: 700 }}>
                    {associate.ba_id}
                  </span>
                  <span className="badge badge-info" style={{ fontSize: '0.72rem' }}>
                    {associate.employment_type}
                  </span>
                </div>

                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '3px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontWeight: 600 }}>{associate.primary_role}</span>
                  {associate.ba_company_name && (
                    <>
                      <span>•</span>
                      <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{associate.ba_company_name}</span>
                    </>
                  )}
                </div>
              </div>
            </div>

            <button onClick={onClose} className="btn btn-secondary btn-icon" title="Close Drawer">
              <X size={18} />
            </button>
          </div>

          {/* Quick Contact & Metadata Bar */}
          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center', fontSize: '0.78125rem', color: 'var(--text-secondary)', padding: '8px 12px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Mail size={13} style={{ color: 'var(--text-muted)' }} /> {associate.email}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Phone size={13} style={{ color: 'var(--text-muted)' }} /> {associate.phone || '+31 6 1234 5678'}
            </span>
            
            {associate.linkedin_url && (
              <a
                href={associate.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px',
                  color: '#0a66c2',
                  fontWeight: 600,
                  textDecoration: 'none',
                  background: 'rgba(10, 102, 194, 0.1)',
                  padding: '2px 8px',
                  borderRadius: '4px',
                  border: '1px solid rgba(10, 102, 194, 0.25)'
                }}
              >
                <Globe size={12} />
                <span>LinkedIn Profile</span>
                <ArrowRight size={11} />
              </a>
            )}

            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <MapPin size={13} style={{ color: 'var(--text-muted)' }} /> {associate.working_country || 'Netherlands'}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <User size={13} style={{ color: 'var(--text-muted)' }} /> Owner: <strong>{associate.owner || 'Operations Team'}</strong>
            </span>
          </div>


          {/* Tabs Bar */}
          <div style={{ display: 'flex', gap: '8px', marginTop: '16px' }}>
            {[
              { id: 'overview', label: '360° Master Record' },
              { id: 'agreements', label: `Agreements Chain (${agreements.length || 1})` },
              { id: 'compliance', label: 'Compliance Matrix' },
              { id: 'activity', label: 'Audit Trail' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  background: activeTab === tab.id ? 'var(--accent-primary)' : 'var(--bg-elevated)',
                  color: activeTab === tab.id ? '#fff' : 'var(--text-secondary)',
                  border: '1px solid var(--border-subtle)',
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Drawer Body Content */}
        <div style={{ padding: '24px 28px', flex: 1, display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* ================= TAB 1: 360° MASTER RECORD (ALL 27 EXCEL FIELDS) ================= */}
          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {/* 1. Placement & Client Assignment Card */}
              <div className="glass-card" style={{ padding: '18px 20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Building size={16} style={{ color: 'var(--color-info)' }} />
                    <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Client Placement & Status</span>
                  </div>
                  {getReadinessBadge(associate.readiness_status)}
                </div>

                <div style={{ background: 'var(--bg-elevated)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Client Account</div>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem', marginTop: '2px' }}>
                      {associate.current_client?.name || associate.assignments?.[0]?.client_name || 'KLM Royal Dutch Airlines'}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Project Role Title</div>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
                      {associate.assignments?.[0]?.role_title || associate.primary_role}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Employment Status</div>
                    <div style={{ fontWeight: 700, color: '#10b981', marginTop: '2px' }}>
                      {associate.employment_status || 'ACTIVE'}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Joining Date</div>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
                      {associate.joining_date || '2025-01-15'}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Exit Date</div>
                    <div style={{ fontWeight: 600, color: 'var(--text-secondary)', marginTop: '2px' }}>
                      {associate.exit_date || '— (Active)'}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Working Country</div>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
                      {associate.working_country || 'Netherlands'}
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Contracting & Legal Entities (Excel Benchmark Columns) */}
              <div className="glass-card" style={{ padding: '18px 20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                  <Briefcase size={16} style={{ color: 'var(--accent-primary)' }} />
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Contracting Entities & Channel Source</h3>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                  <div style={{ background: 'var(--bg-elevated)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Source (Supplier)</div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--accent-primary)', marginTop: '3px' }}>
                      {associate.source || 'STARIDE'}
                    </div>
                  </div>

                  <div style={{ background: 'var(--bg-elevated)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>BA Company Name</div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '3px' }}>
                      {associate.ba_company_name || 'DV LINX B.V.'}
                    </div>
                  </div>

                  <div style={{ background: 'var(--bg-elevated)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Company to BA</div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '3px' }}>
                      {associate.company_to_ba || 'SAGEUS Ltd'}
                    </div>
                  </div>

                  <div style={{ background: 'var(--bg-elevated)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Company to Client</div>
                    <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '3px' }}>
                      {associate.company_to_client || 'STARIDE'}
                    </div>
                  </div>
                </div>
              </div>

              {/* 3. Commercials, Rates & Difference Spread */}
              {currentAgreement && (
                <div className="glass-card" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <DollarSign size={18} style={{ color: 'var(--color-success)' }} />
                      <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Commercials & Rate Spread Analysis</h3>
                    </div>
                    <span className="badge badge-info" style={{ fontWeight: 800, fontSize: '0.8125rem' }}>
                      {currentAgreement.margin_percentage}% Margin
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '14px' }}>
                    <div style={{ background: 'var(--bg-elevated)', padding: '14px', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid var(--border-subtle)' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Client Rate (Bill)</div>
                      <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-success)', marginTop: '4px' }}>
                        €{currentAgreement.client_rate}/h
                      </div>
                    </div>

                    <div style={{ background: 'var(--bg-elevated)', padding: '14px', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid var(--border-subtle)' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>BA Rate (Pay)</div>
                      <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
                        €{currentAgreement.ba_rate}/h
                      </div>
                    </div>

                    <div style={{ background: 'var(--bg-elevated)', padding: '14px', borderRadius: 'var(--radius-md)', textAlign: 'center', border: '1px solid var(--border-subtle)' }}>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Rate Difference</div>
                      <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--color-info)', marginTop: '4px' }}>
                        €{currentAgreement.difference}/h
                      </div>
                    </div>
                  </div>

                  <div style={{ background: 'var(--bg-elevated)', padding: '12px 14px', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8125rem' }}>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Current Agreement Validity: </span>
                      <strong>{currentAgreement.start_date}</strong> to <strong style={{ color: currentAgreement.days_remaining <= 14 ? 'var(--color-warning)' : 'var(--text-primary)' }}>{currentAgreement.end_date}</strong>
                    </div>
                    <span style={{ color: currentAgreement.days_remaining <= 14 ? 'var(--color-warning)' : 'var(--color-success)', fontWeight: 700 }}>
                      {currentAgreement.days_remaining} days remaining
                    </span>
                  </div>
                </div>
              )}

              {/* 4. Compliance & Verification Matrix */}
              <div className="glass-card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShieldCheck size={18} style={{ color: 'var(--accent-primary)' }} />
                    <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Compliance, Passport & Right to Work</h3>
                  </div>
                  <span className={`badge badge-${compliance.overall_status === 'COMPLIANT' ? 'ready' : 'danger'}`}>
                    {compliance.overall_status || 'COMPLIANT'}
                  </span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', fontSize: '0.8125rem' }}>
                  <div style={{ padding: '10px 14px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Passport Number: </span>
                    <strong style={{ fontFamily: 'monospace', color: 'var(--text-primary)' }}>{associate.passport_number || 'M7841029'}</strong>
                  </div>
                  <div style={{ padding: '10px 14px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>VISA Type: </span>
                    <strong style={{ color: 'var(--color-info)' }}>{compliance.visa_status || 'Knowledge Migrant (HSM)'}</strong>
                  </div>
                  <div style={{ padding: '10px 14px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>BGC & VOG Screening: </span>
                    <strong style={{ color: compliance.vog_status === 'COMPLETED' ? 'var(--color-success)' : 'var(--color-warning)' }}>{compliance.vog_status || 'COMPLETED'}</strong>
                  </div>
                  <div style={{ padding: '10px 14px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)', display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-muted)' }}>SNA (NEN 4400-1): </span>
                    <strong style={{ color: compliance.sna_status === 'VERIFIED' ? 'var(--color-success)' : 'var(--color-warning)' }}>{compliance.sna_status || 'VERIFIED'}</strong>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ================= TAB 2: SEQUENTIAL AGREEMENTS TRACKER (1ST, 2ND, 3RD...) ================= */}
          {activeTab === 'agreements' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Sequential Agreement History & Extensions</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Track 1st, 2nd, 3rd, 4th, 5th, and 6th agreements with exact [From, To] dates and rate difference.
                  </p>
                </div>
                {!isExtending && (
                  <button onClick={handleStartExtension} className="btn btn-primary btn-sm">
                    <Plus size={14} />
                    <span>Extend / Add Agreement</span>
                  </button>
                )}
              </div>

              {/* Extension Form */}
              {isExtending && (
                <form onSubmit={handleSubmitExtension} className="glass-card" style={{ padding: '20px', border: '1px solid var(--accent-primary)' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-primary)', marginBottom: '14px' }}>
                    Create Sequential Extension Agreement
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className="form-group">
                      <label className="form-label">Start Date *</label>
                      <input
                        type="date"
                        required
                        value={extensionForm.start_date}
                        onChange={(e) => setExtensionForm({ ...extensionForm, start_date: e.target.value })}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">End Date *</label>
                      <input
                        type="date"
                        required
                        value={extensionForm.end_date}
                        onChange={(e) => setExtensionForm({ ...extensionForm, end_date: e.target.value })}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">Client Rate (€/h) *</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={extensionForm.client_rate}
                        onChange={(e) => setExtensionForm({ ...extensionForm, client_rate: e.target.value })}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group">
                      <label className="form-label">BA Pay Rate (€/h) *</label>
                      <input
                        type="number"
                        step="0.01"
                        required
                        value={extensionForm.ba_rate}
                        onChange={(e) => setExtensionForm({ ...extensionForm, ba_rate: e.target.value })}
                        className="form-input"
                      />
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '14px' }}>
                    <button type="button" onClick={() => setIsExtending(false)} className="btn btn-secondary btn-sm">
                      Cancel
                    </button>
                    <button type="submit" disabled={loadingAction} className="btn btn-primary btn-sm">
                      {loadingAction ? 'Extending...' : 'Confirm Extension'}
                    </button>
                  </div>
                </form>
              )}

              {/* Sequential Agreements List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {agreements.length === 0 ? (
                  <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)' }}>
                    No agreement records found.
                  </div>
                ) : (
                  agreements.map((agr, idx) => {
                    const ordinal = idx === 0 ? '1st' : idx === 1 ? '2nd' : idx === 2 ? '3rd' : `${idx + 1}th`;
                    const isActive = agr.status === 'ACTIVE';

                    return (
                      <div
                        key={agr.id || idx}
                        style={{
                          padding: '16px 20px',
                          borderRadius: 'var(--radius-md)',
                          background: isActive ? 'var(--accent-primary-light)' : 'var(--bg-elevated)',
                          border: `1px solid ${isActive ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          gap: '16px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                          <div style={{
                            width: '38px',
                            height: '38px',
                            borderRadius: '8px',
                            background: isActive ? 'var(--accent-primary)' : 'var(--bg-card)',
                            color: isActive ? '#ffffff' : 'var(--text-secondary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            fontSize: '0.85rem'
                          }}>
                            {ordinal}
                          </div>

                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                                {ordinal} Agreement ({agr.agreement_number || `AGR-0${idx + 1}`})
                              </span>
                              <span className={`badge badge-${isActive ? 'ready' : 'neutral'}`} style={{ fontSize: '0.65rem' }}>
                                {agr.status || (isActive ? 'ACTIVE' : 'COMPLETED')}
                              </span>
                            </div>

                            <div style={{ fontSize: '0.78125rem', color: 'var(--text-secondary)', display: 'flex', gap: '12px' }}>
                              <span><strong>From:</strong> {agr.start_date}</span>
                              <span><strong>To:</strong> {agr.end_date}</span>
                            </div>
                          </div>
                        </div>

                        {/* Commercials & Margin */}
                        <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Rates Spread</div>
                            <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                              Client: €{agr.client_rate}/h • BA: €{agr.ba_rate}/h
                            </div>
                            <div style={{ fontSize: '0.72rem', color: 'var(--color-success)', fontWeight: 600 }}>
                              Diff: €{agr.difference || (agr.client_rate - agr.ba_rate).toFixed(2)}/h ({agr.margin_percentage || '9.52'}%)
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}

          {/* ================= TAB 3: COMPLIANCE MATRIX ================= */}
          {activeTab === 'compliance' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Compliance & Legal Matrix</h3>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button onClick={() => handleUpdateComplianceStatus('COMPLIANT')} className="btn btn-secondary btn-sm" style={{ color: '#10b981' }}>
                    Mark Compliant
                  </button>
                  <button onClick={() => handleUpdateComplianceStatus('WARNING')} className="btn btn-secondary btn-sm" style={{ color: '#f59e0b' }}>
                    Mark Warning
                  </button>
                </div>
              </div>

              <div className="glass-card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)' }}>
                    <span>VOG Certificate (Justis)</span>
                    <strong style={{ color: '#10b981' }}>{compliance.vog_status || 'COMPLETED'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)' }}>
                    <span>Background Screening (BGC)</span>
                    <strong style={{ color: '#10b981' }}>{compliance.bgc_status || 'COMPLETED'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)' }}>
                    <span>Work Authorization (IND)</span>
                    <strong style={{ color: '#06b6d4' }}>{compliance.visa_status || 'VALID_SPONSOR'}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)' }}>
                    <span>SNA / NEN 4400-1 Audit</span>
                    <strong style={{ color: '#10b981' }}>{compliance.sna_status || 'VERIFIED'}</strong>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= TAB 4: AUDIT TRAIL ================= */}
          {activeTab === 'activity' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Audit & Change Log</h3>
              {activities.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)' }}>
                  No activity trail events recorded yet.
                </div>
              ) : (
                activities.map(act => (
                  <div key={act.id} style={{ padding: '12px 14px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', fontWeight: 700 }}>
                      <span>{act.action_type}</span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>{new Date(act.created_at).toLocaleString()}</span>
                    </div>
                    <div style={{ fontSize: '0.78125rem', color: 'var(--text-secondary)', marginTop: '3px' }}>
                      {act.description}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      Actor: {act.actor}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 28px',
          borderTop: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: 'var(--bg-card)'
        }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Associate 360° • ID: {associate.ba_id}
          </span>
          <button onClick={onClose} className="btn btn-secondary btn-sm">
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
}
