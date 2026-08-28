import React, { useState } from 'react';
import { 
  X, User, Building, DollarSign, ShieldCheck, Check, 
  Calendar, FileText, Globe, Key, Briefcase, Camera, ArrowRight
} from 'lucide-react';
import { apiService } from '../services/api';

export default function CreateAssociateModal({ isOpen, onClose, clients = [], onCreated }) {
  const [formData, setFormData] = useState({
    ba_id: `BA-${Math.floor(1000 + Math.random() * 9000)}`,
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    linkedin_url: '',
    photo_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    primary_role: 'Business Analyst',
    employment_type: 'PAYROLL',
    employment_status: 'ACTIVE',
    readiness_status: 'READY',
    source: 'STARIDE',
    ba_company_name: '',
    passport_number: '',
    company_to_ba: 'SAGEUS Ltd',
    company_to_client: 'STARIDE',
    working_country: 'Netherlands',
    owner: 'Operations Team',
    joining_date: new Date().toISOString().split('T')[0],
    exit_date: '',
    exit_reason: '',
    
    // Initial / 1st Agreement
    client_id: '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    client_rate: '105.00',
    ba_rate: '95.00',
    
    // Compliance
    vog_status: 'COMPLETED',
    bgc_status: 'COMPLETED',
    visa_status: 'VALID_SPONSOR',
    sna_status: 'VERIFIED'
  });


  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  // Real-time calculated rate difference & margin
  const clientRateNum = parseFloat(formData.client_rate) || 0;
  const baRateNum = parseFloat(formData.ba_rate) || 0;
  const rateDifference = (clientRateNum - baRateNum).toFixed(2);
  const marginPct = clientRateNum > 0 ? (((clientRateNum - baRateNum) / clientRateNum) * 100).toFixed(2) : '0.00';

  const avatarPresets = [
    'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await apiService.createAssociate(formData);
      onCreated();
      onClose();
    } catch (err) {
      setError(err.response?.data ? JSON.stringify(err.response.data) : err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        style={{ maxWidth: '860px', maxHeight: '92vh', overflowY: 'auto' }} 
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
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
              Add Associate Profile & Placement (27-Field Master Record)
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', margin: '4px 0 0' }}>
              Complete consultant profile with photo, contracting companies, rates difference, 1st agreement dates & compliance.
            </p>
          </div>
          <button onClick={onClose} className="btn btn-secondary btn-icon" title="Close">
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {error && (
            <div style={{ background: 'var(--color-danger-bg)', border: '1px solid var(--color-danger-border)', color: 'var(--color-danger)', padding: '10px 14px', borderRadius: '8px', fontSize: '0.8125rem' }}>
              {error}
            </div>
          )}

          {/* Section 1: Photo & Identification */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-primary)', marginBottom: '16px' }}>
              <Camera size={16} />
              <span>1. Associate Photo & Identification</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '74px 1fr 190px', gap: '18px', alignItems: 'flex-start' }}>
              {/* Photo Avatar */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', paddingTop: '2px' }}>
                <img
                  src={formData.photo_url || avatarPresets[0]}
                  alt="BA Preview"
                  style={{
                    width: '64px',
                    height: '64px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    border: '2.5px solid var(--accent-primary)',
                    boxShadow: '0 2px 8px rgba(79, 70, 229, 0.2)'
                  }}
                />
                <span style={{ fontSize: '0.625rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Portrait
                </span>
              </div>

              {/* Photo URL & Quick Selector */}
              <div className="form-group">
                <label className="form-label">Photo Preset / Image URL</label>
                <input
                  type="url"
                  value={formData.photo_url}
                  onChange={(e) => setFormData({ ...formData, photo_url: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="form-input"
                />
                <div style={{ display: 'flex', gap: '8px', marginTop: '8px', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 500 }}>Select Preset:</span>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {avatarPresets.map((url, idx) => (
                      <img
                        key={idx}
                        src={url}
                        alt={`Avatar ${idx + 1}`}
                        onClick={() => setFormData({ ...formData, photo_url: url })}
                        style={{
                          width: '24px',
                          height: '24px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                          cursor: 'pointer',
                          border: formData.photo_url === url ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
                          transform: formData.photo_url === url ? 'scale(1.15)' : 'scale(1)',
                          transition: 'transform 0.15s ease'
                        }}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* BA ID */}
              <div className="form-group">
                <label className="form-label">BA ID *</label>
                <input
                  type="text"
                  required
                  value={formData.ba_id}
                  onChange={(e) => setFormData({ ...formData, ba_id: e.target.value })}
                  placeholder="e.g. 2002896"
                  className="form-input"
                  style={{ fontFamily: 'monospace', fontWeight: 700, letterSpacing: '0.04em' }}
                />
              </div>
            </div>
          </div>

          {/* Section 2: Consultant & Contracting Entity Details */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-info)', marginBottom: '16px' }}>
              <User size={16} />
              <span>2. Consultant & Contracting Entity Details</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px 16px' }}>
              <div className="form-group">
                <label className="form-label">First Name *</label>
                <input
                  type="text"
                  required
                  value={formData.first_name}
                  onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
                  placeholder="e.g. Maharraj"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Last Name *</label>
                <input
                  type="text"
                  required
                  value={formData.last_name}
                  onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
                  placeholder="e.g. Subramaniam"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="maharraj.s@example.com"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+31 6 7812 3456"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">LinkedIn Profile URL</label>
                <input
                  type="url"
                  value={formData.linkedin_url}
                  onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                  placeholder="https://www.linkedin.com/in/..."
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Employment Type *</label>
                <select
                  value={formData.employment_type}
                  onChange={(e) => setFormData({ ...formData, employment_type: e.target.value })}
                  className="form-select"
                >
                  <option value="PAYROLL">Payroll / Permanent</option>
                  <option value="ZZP">Contract / ZZP / Freelance</option>
                  <option value="SUBCONTRACTOR">Subcontractor</option>
                </select>
              </div>


              <div className="form-group">
                <label className="form-label">Employment Status</label>
                <select
                  value={formData.employment_status}
                  onChange={(e) => setFormData({ ...formData, employment_status: e.target.value })}
                  className="form-select"
                >
                  <option value="ACTIVE">Active</option>
                  <option value="INACTIVE">Inactive</option>
                  <option value="EXITED">Exited</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Source (Supplier / Channel)</label>
                <input
                  type="text"
                  value={formData.source}
                  onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                  placeholder="e.g. STARIDE, Direct, Referral"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">BA Company Name</label>
                <input
                  type="text"
                  value={formData.ba_company_name}
                  onChange={(e) => setFormData({ ...formData, ba_company_name: e.target.value })}
                  placeholder="e.g. DV LINX B.V."
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Passport Number</label>
                <input
                  type="text"
                  value={formData.passport_number}
                  onChange={(e) => setFormData({ ...formData, passport_number: e.target.value })}
                  placeholder="e.g. M7841029"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Working from Country</label>
                <input
                  type="text"
                  value={formData.working_country}
                  onChange={(e) => setFormData({ ...formData, working_country: e.target.value })}
                  placeholder="e.g. Netherlands"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Company to BA</label>
                <input
                  type="text"
                  value={formData.company_to_ba}
                  onChange={(e) => setFormData({ ...formData, company_to_ba: e.target.value })}
                  placeholder="e.g. SAGEUS Ltd"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Company to Client</label>
                <input
                  type="text"
                  value={formData.company_to_client}
                  onChange={(e) => setFormData({ ...formData, company_to_client: e.target.value })}
                  placeholder="e.g. STARIDE"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Joining Date</label>
                <input
                  type="date"
                  value={formData.joining_date}
                  onChange={(e) => setFormData({ ...formData, joining_date: e.target.value })}
                  className="form-input"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Client Placement, Rates & Difference Spread */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-success)', marginBottom: '16px' }}>
              <DollarSign size={16} />
              <span>3. Client Placement, Rates & Difference Spread</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px 16px' }}>
              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label className="form-label">Client Organization *</label>
                <select
                  value={formData.client_id}
                  onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
                  className="form-select"
                >
                  <option value="">Select Client Account</option>
                  {clients.map(c => (
                    <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Primary Role Title</label>
                <input
                  type="text"
                  value={formData.primary_role}
                  onChange={(e) => setFormData({ ...formData, primary_role: e.target.value })}
                  placeholder="e.g. Business Analyst"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">1st Agreement Start Date</label>
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">1st Agreement End Date</label>
                <input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Account Lead Owner</label>
                <input
                  type="text"
                  value={formData.owner}
                  onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Client Rate (€/h) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.client_rate}
                  onChange={(e) => setFormData({ ...formData, client_rate: e.target.value })}
                  placeholder="105.00"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">BA Pay Rate (€/h) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.ba_rate}
                  onChange={(e) => setFormData({ ...formData, ba_rate: e.target.value })}
                  placeholder="95.00"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Rate Difference Spread</label>
                <div style={{
                  height: '40px',
                  padding: '0 12px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-medium)',
                  fontWeight: 800,
                  color: 'var(--color-success)',
                  fontSize: '0.86rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  boxSizing: 'border-box'
                }}>
                  <span>€{rateDifference}/h</span>
                  <span className="badge badge-ready">{marginPct}% Margin</span>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Compliance & Screening Checks */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-warning)', marginBottom: '16px' }}>
              <ShieldCheck size={16} />
              <span>4. BGC, VOG, VISA & SNA Compliance Checks</span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px 16px' }}>
              <div className="form-group">
                <label className="form-label">BGC & VOG Status</label>
                <select
                  value={formData.vog_status}
                  onChange={(e) => {
                    setFormData({ ...formData, vog_status: e.target.value, bgc_status: e.target.value });
                  }}
                  className="form-select"
                >
                  <option value="COMPLETED">Completed</option>
                  <option value="PENDING">In Progress / Pending</option>
                  <option value="NOT_REQUIRED">Not Applicable</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">VISA Type</label>
                <select
                  value={formData.visa_status}
                  onChange={(e) => setFormData({ ...formData, visa_status: e.target.value })}
                  className="form-select"
                >
                  <option value="VALID_SPONSOR">Knowledge Migrant (HSM)</option>
                  <option value="CITIZEN_EU">EU / Dutch Citizen</option>
                  <option value="SEARCH_YEAR">Zoekjaar / Search Year</option>
                  <option value="PENDING">Renewal Pending</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">SNA Compliant (NEN 4400-1)</label>
                <select
                  value={formData.sna_status}
                  onChange={(e) => setFormData({ ...formData, sna_status: e.target.value })}
                  className="form-select"
                >
                  <option value="VERIFIED">Yes / Verified</option>
                  <option value="PENDING">No / Pending</option>
                  <option value="EXEMPT">Exempt</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Initial Readiness</label>
                <select
                  value={formData.readiness_status}
                  onChange={(e) => setFormData({ ...formData, readiness_status: e.target.value })}
                  className="form-select"
                >
                  <option value="READY">Ready</option>
                  <option value="ACTION_REQUIRED">Action Required</option>
                  <option value="NOT_READY">Not Ready</option>
                </select>
              </div>
            </div>
          </div>

          {/* Footer Buttons */}
          <div style={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '12px',
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '16px'
          }}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="btn btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? (
                <>
                  <div className="pulse-dot online" style={{ width: '8px', height: '8px' }} />
                  <span>Saving Associate...</span>
                </>
              ) : (
                <>
                  <Check size={16} />
                  <span>Save Associate 360° Profile</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
