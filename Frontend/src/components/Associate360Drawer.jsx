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
  const [revisingAgreementId, setRevisingAgreementId] = useState(null);
  
  const [extensionForm, setExtensionForm] = useState({
    start_date: '',
    end_date: '',
    client_rate: '',
    ba_rate: '',
    end_client_name: '',
    end_client_project: ''
  });

  const [rateRevisionForm, setRateRevisionForm] = useState({
    revised_client_rate: '',
    revised_ba_rate: '',
    rate_revision_effective_date: '',
    rate_revision_reason: '',
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
        end_client_name: associate.end_client || currentAgreement.end_client_name || '',
        end_client_project: currentAgreement.end_client_project || ''
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

  const handleStartRateRevision = (agr) => {
    setRevisingAgreementId(agr.id);
    setRateRevisionForm({
      revised_client_rate: agr.revised_client_rate || agr.client_rate,
      revised_ba_rate: agr.revised_ba_rate || agr.ba_rate,
      rate_revision_effective_date: agr.rate_revision_effective_date || new Date().toISOString().split('T')[0],
      rate_revision_reason: agr.rate_revision_reason || 'Annual client billing escalation and rate revision'
    });
  };

  const handleSubmitRateRevision = async (e, agreementId) => {
    e.preventDefault();
    setLoadingAction(true);
    try {
      await apiService.reviseAgreementRate(agreementId, rateRevisionForm);
      setRevisingAgreementId(null);
      onRefreshData();
    } catch (err) {
      alert(`Failed to revise rate: ${err.message}`);
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
              {associate.secondary_email && <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>({associate.secondary_email})</span>}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <Phone size={13} style={{ color: 'var(--text-muted)' }} /> {associate.phone || '+31 6 1234 5678'}
              {associate.secondary_phone && <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>({associate.secondary_phone})</span>}
            </span>

            {associate.linkedin_url && (
              <a
                href={associate.linkedin_url}
                target="_blank"
                rel="noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#0077b5', textDecoration: 'none', fontWeight: 600 }}
              >
                <Globe size={13} />
                <span>LinkedIn</span>
              </a>
            )}

            {associate.end_client && (
              <span style={{ display: 'flex', alignItems: 'center', gap: '5px', color: 'var(--color-info)', fontWeight: 600 }}>
                <Building size={13} /> End Client: <strong>{associate.end_client}</strong>
              </span>
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
              { id: 'agreements', label: `Agreements Chain (${agreements.length || 1}/10)` },
              { id: 'compliance', label: 'Compliance Matrix' },
              { id: 'activity', label: `Audit Trail (${activities.length})` }
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
                    <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Client & End Client Placement</span>
                  </div>
                  {getReadinessBadge(associate.readiness_status)}
                </div>

                <div style={{ background: 'var(--bg-elevated)', padding: '14px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Prime Contracting Client</div>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem', marginTop: '2px' }}>
                      {associate.current_client?.name || associate.assignments?.[0]?.client_name || 'STARIDE'}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>End Client Enterprise</div>
                    <div style={{ fontWeight: 700, color: 'var(--color-info)', fontSize: '0.95rem', marginTop: '2px' }}>
                      {associate.end_client || associate.assignments?.[0]?.end_client_name || 'ASML Netherlands B.V.'}
                    </div>
                  </div>

                  <div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Project Role Title</div>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', marginTop: '2px' }}>
                      {associate.assignments?.[0]?.role_title || associate.primary_role}
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

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}>
                    <div style={{ padding: '16px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Client Bill Rate</div>
                      <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
                        €{currentAgreement.client_rate}
                        <span style={{ fontSize: '0.78125rem', fontWeight: 500, color: 'var(--text-muted)' }}>/hr</span>
                      </div>
                    </div>

                    <div style={{ padding: '16px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>BA Pay Rate</div>
                      <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '4px' }}>
                        €{currentAgreement.ba_rate}
                        <span style={{ fontSize: '0.78125rem', fontWeight: 500, color: 'var(--text-muted)' }}>/hr</span>
                      </div>
                    </div>

                    <div style={{ padding: '16px', background: 'rgba(16, 185, 129, 0.08)', borderRadius: 'var(--radius-md)', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
                      <div style={{ fontSize: '0.75rem', color: '#10b981', textTransform: 'uppercase', fontWeight: 700 }}>Net Rate Spread</div>
                      <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10b981', marginTop: '4px' }}>
                        €{currentAgreement.difference || (currentAgreement.client_rate - currentAgreement.ba_rate).toFixed(2)}
                        <span style={{ fontSize: '0.78125rem', fontWeight: 500 }}>/hr</span>
                      </div>
                    </div>
                  </div>

                  <div style={{ marginTop: '14px', background: 'var(--bg-elevated)', padding: '12px 14px', borderRadius: 'var(--radius-md)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8125rem' }}>
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
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Agreement Sequences (Up to 10) & Rate Increase History</h3>
                  <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Manage 1st, 2nd, 3rd up to 10th agreement extensions with rate revision edit option for Admin role.
                  </p>
                </div>
                {!isExtending && agreements.length < 10 && (
                  <button onClick={handleStartExtension} className="btn btn-primary btn-sm">
                    <Plus size={14} />
                    <span>+ Add Next Sequence ({agreements.length + 1}/10)</span>
                  </button>
                )}
              </div>

              {/* Extension Form */}
              {isExtending && (
                <form onSubmit={handleSubmitExtension} className="glass-card" style={{ padding: '20px', border: '1px solid var(--accent-primary)' }}>
                  <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-primary)', marginBottom: '14px' }}>
                    Create Agreement Sequence #{agreements.length + 1}
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
                      {loadingAction ? 'Saving...' : 'Confirm Sequence'}
                    </button>
                  </div>
                </form>
              )}

              {/* Sequential Agreements List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {agreements.length === 0 ? (
                  <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)' }}>
                    No agreement records found.
                  </div>
                ) : (
                  agreements.map((agr, idx) => {
                    const seqNum = agr.sequence || (idx + 1);
                    const ordinal = seqNum === 1 ? '1st' : seqNum === 2 ? '2nd' : seqNum === 3 ? '3rd' : `${seqNum}th`;
                    const isActive = agr.status === 'ACTIVE';
                    const isRevisingThis = revisingAgreementId === agr.id;

                    return (
                      <div
                        key={agr.id || idx}
                        style={{
                          borderRadius: 'var(--radius-md)',
                          background: isActive ? 'var(--accent-primary-light)' : 'var(--bg-elevated)',
                          border: `1px solid ${isActive ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                          padding: '16px 20px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '14px'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                            <div style={{
                              width: '40px',
                              height: '40px',
                              borderRadius: '8px',
                              background: isActive ? 'var(--accent-primary)' : 'var(--bg-card)',
                              color: isActive ? '#ffffff' : 'var(--text-secondary)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 800,
                              fontSize: '0.85rem'
                            }}>
                              #{seqNum}
                            </div>

                            <div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                                <span style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--text-primary)' }}>
                                  {ordinal} Agreement Sequence ({agr.agreement_number || `AGR-0${seqNum}`})
                                </span>
                                <span className={`badge badge-${isActive ? 'ready' : 'neutral'}`} style={{ fontSize: '0.65rem' }}>
                                  {agr.status || (isActive ? 'ACTIVE' : 'COMPLETED')}
                                </span>
                              </div>

                              <div style={{ fontSize: '0.78125rem', color: 'var(--text-secondary)', display: 'flex', gap: '12px' }}>
                                <span><strong>From:</strong> {agr.start_date}</span>
                                <span><strong>To:</strong> {agr.end_date}</span>
                                {agr.end_client_name && <span><strong>End Client:</strong> {agr.end_client_name}</span>}
                              </div>
                            </div>
                          </div>

                          {/* Commercials, Margin & Rate Revision Action */}
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

                            <button
                              type="button"
                              onClick={() => isRevisingThis ? setRevisingAgreementId(null) : handleStartRateRevision(agr)}
                              className="btn btn-secondary btn-sm"
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem', fontWeight: 700 }}
                            >
                              <span>✏️ Revise Rate (Admin)</span>
                            </button>
                          </div>
                        </div>

                        {/* Rate Revision Highlight if applied */}
                        {agr.has_rate_revision && (
                          <div style={{
                            background: 'rgba(79, 70, 229, 0.08)',
                            border: '1px solid rgba(79, 70, 229, 0.2)',
                            borderRadius: 'var(--radius-sm)',
                            padding: '10px 14px',
                            fontSize: '0.78125rem',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}>
                            <div>
                              <span style={{ fontWeight: 700, color: 'var(--accent-primary)' }}>📈 Rate Revised: </span>
                              <span>Client €{agr.revised_client_rate}/h • BA €{agr.revised_ba_rate}/h</span>
                              {agr.rate_revision_reason && <span style={{ color: 'var(--text-muted)', marginLeft: '8px' }}>({agr.rate_revision_reason})</span>}
                            </div>
                            <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>
                              Effective: {agr.rate_revision_effective_date} (by {agr.revised_by || 'Admin'})
                            </span>
                          </div>
                        )}

                        {/* Admin Inline Rate Revision Form */}
                        {isRevisingThis && (
                          <form
                            onSubmit={(e) => handleSubmitRateRevision(e, agr.id)}
                            style={{
                              background: 'var(--bg-card)',
                              border: '1px solid var(--accent-primary)',
                              borderRadius: 'var(--radius-sm)',
                              padding: '14px 16px',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '10px'
                            }}
                          >
                            <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent-primary)' }}>
                              Admin Rate Revision for Sequence #{seqNum}
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                              <div className="form-group">
                                <label className="form-label" style={{ fontSize: '0.72rem' }}>Revised Client Rate (€/h) *</label>
                                <input
                                  type="number"
                                  step="0.01"
                                  required
                                  value={rateRevisionForm.revised_client_rate}
                                  onChange={(e) => setRateRevisionForm({ ...rateRevisionForm, revised_client_rate: e.target.value })}
                                  className="form-input"
                                />
                              </div>

                              <div className="form-group">
                                <label className="form-label" style={{ fontSize: '0.72rem' }}>Revised BA Rate (€/h) *</label>
                                <input
                                  type="number"
                                  step="0.01"
                                  required
                                  value={rateRevisionForm.revised_ba_rate}
                                  onChange={(e) => setRateRevisionForm({ ...rateRevisionForm, revised_ba_rate: e.target.value })}
                                  className="form-input"
                                />
                              </div>

                              <div className="form-group">
                                <label className="form-label" style={{ fontSize: '0.72rem' }}>Date of Revised Rate *</label>
                                <input
                                  type="date"
                                  required
                                  value={rateRevisionForm.rate_revision_effective_date}
                                  onChange={(e) => setRateRevisionForm({ ...rateRevisionForm, rate_revision_effective_date: e.target.value })}
                                  className="form-input"
                                />
                              </div>

                              <div className="form-group" style={{ gridColumn: 'span 3' }}>
                                <label className="form-label" style={{ fontSize: '0.72rem' }}>Revision Reason / Audit Notes *</label>
                                <input
                                  type="text"
                                  required
                                  value={rateRevisionForm.rate_revision_reason}
                                  onChange={(e) => setRateRevisionForm({ ...rateRevisionForm, rate_revision_reason: e.target.value })}
                                  placeholder="e.g. Annual client billing escalation and seniority grade advancement"
                                  className="form-input"
                                />
                              </div>
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '4px' }}>
                              <button
                                type="button"
                                onClick={() => setRevisingAgreementId(null)}
                                className="btn btn-secondary btn-sm"
                              >
                                Cancel
                              </button>
                              <button
                                type="submit"
                                disabled={loadingAction}
                                className="btn btn-primary btn-sm"
                              >
                                {loadingAction ? 'Saving Revision...' : 'Save & Log Rate Revision'}
                              </button>
                            </div>
                          </form>
                        )}
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
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700 }}>Audit & Change Log</h3>
                <span className="badge badge-info">{activities.length} Audit Entries</span>
              </div>

              {activities.length === 0 ? (
                <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)' }}>
                  No activity trail events recorded yet.
                </div>
              ) : (
                activities.map(act => (
                  <div
                    key={act.id}
                    style={{
                      padding: '12px 16px',
                      background: 'var(--bg-elevated)',
                      borderRadius: 'var(--radius-sm)',
                      borderLeft: `3px solid ${act.action_type === 'RATE_REVISED' ? 'var(--accent-primary)' : act.action_type === 'AGREEMENT_EXTENDED' ? 'var(--color-success)' : 'var(--border-medium)'}`,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '4px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8125rem', fontWeight: 700 }}>
                      <span style={{ color: act.action_type === 'RATE_REVISED' ? 'var(--accent-primary)' : 'var(--text-primary)' }}>
                        {act.action_type === 'RATE_REVISED' ? '📈 Rate Revised' : act.action_type}
                      </span>
                      <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem' }}>
                        {new Date(act.created_at).toLocaleString()}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.78125rem', color: 'var(--text-secondary)' }}>
                      {act.description}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      Actor: <strong>{act.actor || 'Admin'}</strong>
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
