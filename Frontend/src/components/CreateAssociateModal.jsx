import React, { useState } from 'react';
import { 
  X, User, Building, DollarSign, ShieldCheck, Check, 
  Calendar, FileText, Globe, Key, Briefcase, Camera, ArrowRight, Layers, Plus, Trash2,
  UploadCloud, Paperclip, FileCheck, CheckCircle2, File, Eye
} from 'lucide-react';
import { apiService } from '../services/api';

export default function CreateAssociateModal({ isOpen, onClose, clients = [], onCreated }) {
  const [activeModalTab, setActiveModalTab] = useState('details'); // 'details' | 'documents'

  const [formData, setFormData] = useState({
    ba_id: `BA-${Math.floor(1000 + Math.random() * 9000)}`,
    first_name: '',
    last_name: '',
    email: '',
    secondary_email: '',
    phone: '',
    secondary_phone: '',
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
    end_client_name: 'ASML Netherlands B.V.',
    end_client_project: 'EUV Core Automation & Delivery',
    joining_date: new Date().toISOString().split('T')[0],
    exit_date: '',
    exit_reason: '',
    
    // Initial Client Placement
    client_id: '',
    
    // Compliance
    vog_status: 'COMPLETED',
    bgc_status: 'COMPLETED',
    visa_status: 'VALID_SPONSOR',
    sna_status: 'VERIFIED'
  });

  // Dynamic Agreement Sequences (Up to 10 sequences)
  const [agreementSequences, setAgreementSequences] = useState([
    {
      sequence: 1,
      title: '1st Initial Agreement',
      start_date: new Date().toISOString().split('T')[0],
      end_date: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      client_rate: '105.00',
      ba_rate: '95.00',
      has_rate_revision: false,
      revised_client_rate: '',
      revised_ba_rate: '',
      rate_revision_effective_date: '',
      rate_revision_reason: '',
      status: 'ACTIVE'
    }
  ]);

  const [attachedDocs, setAttachedDocs] = useState([
    { id: '1', doc_type: 'RESUME', title: 'Consultant Resume / Curriculum Vitae (CV) (PDF / DOCX)', file_name: '', file_size: '', status: 'PENDING', is_required: true },
    { id: '2', doc_type: 'PASSPORT', title: 'Passport / National ID (Front & Back Copy)', file_name: '', file_size: '', status: 'PENDING', is_required: true },
    { id: '3', doc_type: 'VOG', title: 'VOG Dutch Certificate of Conduct (Verklaring Omtrent het Gedrag)', file_name: '', file_size: '', status: 'PENDING', is_required: true },
    { id: '4', doc_type: 'AGREEMENT', title: 'Signed Framework Agreement / SOW Contract Document', file_name: '', file_size: '', status: 'PENDING', is_required: true },
    { id: '5', doc_type: 'VISA', title: 'Work Permit / HSM Knowledge Migrant Visa Approval', file_name: '', file_size: '', status: 'PENDING', is_required: false },
    { id: '6', doc_type: 'KVK', title: 'KVK Trade Register Extract & BTW VAT Number', file_name: '', file_size: '', status: 'PENDING', is_required: false },
    { id: '7', doc_type: 'SNA', title: 'SNA NEN 4400-1 Labour Compliance Audit Certificate', file_name: '', file_size: '', status: 'PENDING', is_required: false },
  ]);

  const [customDocTitle, setCustomDocTitle] = useState('');
  const [showSecondaryEmail, setShowSecondaryEmail] = useState(false);
  const [showSecondaryPhone, setShowSecondaryPhone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!isOpen) return null;

  const handleAddAgreementSequence = () => {
    if (agreementSequences.length >= 10) return;
    const nextSeq = agreementSequences.length + 1;
    const lastSeq = agreementSequences[agreementSequences.length - 1];
    const lastEndDate = lastSeq?.end_date ? new Date(lastSeq.end_date) : new Date();
    const nextStartDate = new Date(lastEndDate.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const nextEndDate = new Date(lastEndDate.getTime() + 181 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    setAgreementSequences([
      ...agreementSequences,
      {
        sequence: nextSeq,
        title: `${nextSeq === 2 ? '2nd' : nextSeq === 3 ? '3rd' : `${nextSeq}th`} Extension Sequence`,
        start_date: nextStartDate,
        end_date: nextEndDate,
        client_rate: lastSeq?.client_rate || '105.00',
        ba_rate: lastSeq?.ba_rate || '95.00',
        has_rate_revision: false,
        revised_client_rate: '',
        revised_ba_rate: '',
        rate_revision_effective_date: '',
        rate_revision_reason: '',
        status: 'UPCOMING'
      }
    ]);
  };

  const handleRemoveAgreementSequence = (index) => {
    if (agreementSequences.length <= 1) return;
    setAgreementSequences(agreementSequences.filter((_, i) => i !== index));
  };

  const handleUpdateSequence = (index, field, value) => {
    const updated = [...agreementSequences];
    updated[index][field] = value;
    setAgreementSequences(updated);
  };


  const handleSimulateFileUpload = (docId, e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAttachedDocs(attachedDocs.map(doc => {
      if (doc.id === docId) {
        return {
          ...doc,
          file_name: file.name,
          file_size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`,
          status: 'ATTACHED'
        };
      }
      return doc;
    }));
  };

  const handleAddCustomDoc = (e) => {
    e.preventDefault();
    if (!customDocTitle.trim()) return;

    setAttachedDocs([
      ...attachedDocs,
      {
        id: `custom-${Date.now()}`,
        doc_type: 'OTHER',
        title: customDocTitle.trim(),
        file_name: 'Custom_Attachment.pdf',
        file_size: '1.24 MB',
        status: 'ATTACHED',
        is_required: false
      }
    ]);
    setCustomDocTitle('');
  };

  const handleRemoveDoc = (docId) => {
    setAttachedDocs(attachedDocs.map(doc => {
      if (doc.id === docId) {
        return { ...doc, file_name: '', file_size: '', status: 'PENDING' };
      }
      return doc;
    }).filter(doc => !doc.id.startsWith('custom-') || doc.status === 'ATTACHED'));
  };

  const handleProceedToDocuments = (e) => {
    e.preventDefault();
    if (!formData.first_name || !formData.last_name || !formData.email || !formData.phone || !formData.linkedin_url) {
      setError('Please fill in all mandatory consultant contact details (First Name, Last Name, Email, Phone, LinkedIn).');
      return;
    }
    if (!formData.client_id) {
      setError('Please select a Client Organization in Section 3.');
      return;
    }
    setError(null);
    setActiveModalTab('documents');
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        start_date: agreementSequences[0]?.start_date,
        end_date: agreementSequences[0]?.end_date,
        client_rate: agreementSequences[0]?.client_rate,
        ba_rate: agreementSequences[0]?.ba_rate,
        agreements: agreementSequences,
        documents: attachedDocs.filter(d => d.status === 'ATTACHED')
      };
      await apiService.createAssociate(payload);
      onCreated();
      onClose();
    } catch (err) {
      setError(err.response?.data ? JSON.stringify(err.response.data) : err.message);
    } finally {
      setLoading(false);
    }
  };


  const attachedCount = attachedDocs.filter(d => d.status === 'ATTACHED').length;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        style={{ maxWidth: '880px', maxHeight: '92vh', overflowY: 'auto' }} 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{
          padding: '18px 28px 14px',
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
              All fields mandatory. Complete consultant profile, contracting entities, rate difference, and document attachments.
            </p>
          </div>
          <button onClick={onClose} className="btn btn-secondary btn-icon" title="Close">
            <X size={18} />
          </button>
        </div>

        {/* Modal Navigation Tabs (Details vs Documents) */}
        <div style={{
          padding: '10px 28px',
          background: 'var(--bg-card)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: '68px',
          zIndex: 19
        }}>
          <div style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-full)',
            padding: '3px',
            display: 'inline-flex',
            gap: '4px'
          }}>
            <button
              type="button"
              onClick={() => setActiveModalTab('details')}
              style={{
                background: activeModalTab === 'details' ? 'var(--accent-primary)' : 'transparent',
                color: activeModalTab === 'details' ? '#ffffff' : 'var(--text-secondary)',
                border: 'none',
                padding: '6px 16px',
                borderRadius: 'var(--radius-full)',
                fontWeight: 600,
                fontSize: '0.8125rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <User size={14} />
              <span>1. Associate Details & Rates</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveModalTab('documents')}
              style={{
                background: activeModalTab === 'documents' ? 'var(--accent-primary)' : 'transparent',
                color: activeModalTab === 'documents' ? '#ffffff' : 'var(--text-secondary)',
                border: 'none',
                padding: '6px 16px',
                borderRadius: 'var(--radius-full)',
                fontWeight: 600,
                fontSize: '0.8125rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <Paperclip size={14} />
              <span>2. Compliance Documents</span>
              <span className={`badge ${attachedCount > 0 ? 'badge-ready' : 'badge-neutral'}`} style={{ fontSize: '0.65rem', padding: '1px 6px' }}>
                {attachedCount}/{attachedDocs.length}
              </span>
            </button>
          </div>

          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            Step {activeModalTab === 'details' ? '1 of 2' : '2 of 2'}
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '24px 28px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {error && (
            <div style={{ background: 'var(--color-danger-bg)', border: '1px solid var(--color-danger-border)', color: 'var(--color-danger)', padding: '10px 14px', borderRadius: '8px', fontSize: '0.8125rem' }}>
              {error}
            </div>
          )}

          {/* ================= TAB 1: DETAILS & COMMERCIALS ================= */}
          {activeModalTab === 'details' && (
            <>
              {/* Section 1: Associate Photo & Identification */}
              <div className="glass-card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent-primary)', marginBottom: '16px' }}>
                  <Camera size={16} />
                  <span>1. Associate Photo & Identification</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '74px 220px 1fr', gap: '20px', alignItems: 'center' }}>
                  {/* Photo Avatar Preview */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                    <img
                      src={formData.photo_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
                      alt="BA Portrait Preview"
                      style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '2.5px solid var(--accent-primary)',
                        boxShadow: '0 2px 8px rgba(79, 70, 229, 0.25)'
                      }}
                    />
                    <span style={{ fontSize: '0.625rem', fontWeight: 700, color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Portrait
                    </span>
                  </div>

                  {/* BA ID */}
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">BA ID *</label>
                    <input
                      type="text"
                      required
                      value={formData.ba_id}
                      onChange={(e) => setFormData({ ...formData, ba_id: e.target.value })}
                      placeholder="e.g. 2002896 or BA-6378"
                      className="form-input"
                      style={{ fontFamily: 'monospace', fontWeight: 700, letterSpacing: '0.04em' }}
                    />
                  </div>

                  {/* LinkedIn Profile URL */}
                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Globe size={13} style={{ color: '#0a66c2' }} />
                      <span>LinkedIn Profile URL *</span>
                    </label>
                    <input
                      type="url"
                      required
                      value={formData.linkedin_url}
                      onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                      placeholder="https://www.linkedin.com/in/..."
                      className="form-input"
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

                  {/* Primary Email with + Add Alternate Email */}
                  <div className="form-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label className="form-label">Email Address *</label>
                      {!showSecondaryEmail && (
                        <button
                          type="button"
                          onClick={() => setShowSecondaryEmail(true)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--accent-primary)',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '2px',
                            padding: 0
                          }}
                        >
                          <Plus size={12} />
                          <span>Email</span>
                        </button>
                      )}
                    </div>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="maharraj.s@example.com"
                      className="form-input"
                    />
                  </div>

                  {/* Secondary Email (Shown when toggled with +) */}
                  {showSecondaryEmail && (
                    <div className="form-group">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <label className="form-label">Secondary Email Address *</label>
                        <button
                          type="button"
                          onClick={() => {
                            setShowSecondaryEmail(false);
                            setFormData({ ...formData, secondary_email: '' });
                          }}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--color-danger)',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            padding: 0
                          }}
                          title="Remove Secondary Email"
                        >
                          ✕ Remove
                        </button>
                      </div>
                      <input
                        type="email"
                        required
                        value={formData.secondary_email}
                        onChange={(e) => setFormData({ ...formData, secondary_email: e.target.value })}
                        placeholder="alternate.email@domain.com"
                        className="form-input"
                      />
                    </div>
                  )}

                  {/* Primary Phone with + Add Alternate Phone */}
                  <div className="form-group">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <label className="form-label">Phone Number *</label>
                      {!showSecondaryPhone && (
                        <button
                          type="button"
                          onClick={() => setShowSecondaryPhone(true)}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--accent-primary)',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '2px',
                            padding: 0
                          }}
                        >
                          <Plus size={12} />
                          <span>Phone</span>
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+31 6 7812 3456"
                      className="form-input"
                    />
                  </div>

                  {/* Secondary Phone (Shown when toggled with +) */}
                  {showSecondaryPhone && (
                    <div className="form-group">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <label className="form-label">Secondary Phone *</label>
                        <button
                          type="button"
                          onClick={() => {
                            setShowSecondaryPhone(false);
                            setFormData({ ...formData, secondary_phone: '' });
                          }}
                          style={{
                            background: 'transparent',
                            border: 'none',
                            color: 'var(--color-danger)',
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            padding: 0
                          }}
                          title="Remove Secondary Phone"
                        >
                          ✕ Remove
                        </button>
                      </div>
                      <input
                        type="text"
                        required
                        value={formData.secondary_phone}
                        onChange={(e) => setFormData({ ...formData, secondary_phone: e.target.value })}
                        placeholder="+31 6 9876 5432"
                        className="form-input"
                      />
                    </div>
                  )}

                  <div className="form-group">
                    <label className="form-label">Employment Type *</label>
                    <select
                      required
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
                    <label className="form-label">Employment Status *</label>
                    <select
                      required
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
                    <label className="form-label">Source (Supplier / Channel) *</label>
                    <input
                      type="text"
                      required
                      value={formData.source}
                      onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                      placeholder="e.g. STARIDE, Direct, Referral"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">BA Company Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.ba_company_name}
                      onChange={(e) => setFormData({ ...formData, ba_company_name: e.target.value })}
                      placeholder="e.g. DV LINX B.V."
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Passport Number *</label>
                    <input
                      type="text"
                      required
                      value={formData.passport_number}
                      onChange={(e) => setFormData({ ...formData, passport_number: e.target.value })}
                      placeholder="e.g. M7841029"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Working from Country *</label>
                    <input
                      type="text"
                      required
                      value={formData.working_country}
                      onChange={(e) => setFormData({ ...formData, working_country: e.target.value })}
                      placeholder="e.g. Netherlands"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Company to BA *</label>
                    <input
                      type="text"
                      required
                      value={formData.company_to_ba}
                      onChange={(e) => setFormData({ ...formData, company_to_ba: e.target.value })}
                      placeholder="e.g. SAGEUS Ltd"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Company to Client *</label>
                    <input
                      type="text"
                      required
                      value={formData.company_to_client}
                      onChange={(e) => setFormData({ ...formData, company_to_client: e.target.value })}
                      placeholder="e.g. STARIDE"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Joining Date *</label>
                    <input
                      type="date"
                      required
                      value={formData.joining_date}
                      onChange={(e) => setFormData({ ...formData, joining_date: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3: Client Placement, End Client & Agreement Sequences (Up to 10) */}
              <div className="glass-card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-success)' }}>
                    <DollarSign size={16} />
                    <span>3. Client Placement, End Client & Agreement Sequences (Up to 10)</span>
                  </div>
                  <span className="badge badge-info" style={{ fontSize: '0.72rem' }}>
                    {agreementSequences.length} of 10 Sequences Configured
                  </span>
                </div>

                {/* Client & End Client Header Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px 16px', marginBottom: '20px', paddingBottom: '16px', borderBottom: '1px solid var(--border-subtle)' }}>
                  <div className="form-group">
                    <label className="form-label">Client Organization (Prime) *</label>
                    <select
                      required
                      value={formData.client_id}
                      onChange={(e) => setFormData({ ...formData, client_id: e.target.value })}
                      className="form-select"
                    >
                      <option value="">Select Client Account *</option>
                      {clients.map(c => (
                        <option key={c.id} value={c.id}>{c.name} ({c.code})</option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Primary Role Title *</label>
                    <input
                      type="text"
                      required
                      value={formData.primary_role}
                      onChange={(e) => setFormData({ ...formData, primary_role: e.target.value })}
                      placeholder="e.g. Business Analyst"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Account Lead Owner *</label>
                    <input
                      type="text"
                      required
                      value={formData.owner}
                      onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">End Client Organization / Enterprise *</label>
                    <input
                      type="text"
                      required
                      value={formData.end_client_name}
                      onChange={(e) => setFormData({ ...formData, end_client_name: e.target.value })}
                      placeholder="e.g. ASML Netherlands B.V., ING Bank, Philips"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label className="form-label">End Client Project / Program *</label>
                    <input
                      type="text"
                      required
                      value={formData.end_client_project}
                      onChange={(e) => setFormData({ ...formData, end_client_project: e.target.value })}
                      placeholder="e.g. Core EUV Platform Modernization & Payment Gateway"
                      className="form-input"
                    />
                  </div>
                </div>

                {/* Agreement Sequences List (1 to 10) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  {agreementSequences.map((seq, idx) => {
                    const cRate = parseFloat(seq.client_rate) || 0;
                    const bRate = parseFloat(seq.ba_rate) || 0;
                    const diff = (cRate - bRate).toFixed(2);
                    const margin = cRate > 0 ? (((cRate - bRate) / cRate) * 100).toFixed(2) : '0.00';

                    return (
                      <div
                        key={idx}
                        style={{
                          background: 'var(--bg-elevated)',
                          border: '1px solid var(--border-medium)',
                          borderRadius: 'var(--radius-md)',
                          padding: '16px 18px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '14px'
                        }}
                      >
                        {/* Sequence Header */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span className="badge badge-info" style={{ fontWeight: 800 }}>
                              #{seq.sequence}
                            </span>
                            <span style={{ fontWeight: 700, fontSize: '0.86rem', color: 'var(--text-primary)' }}>
                              {seq.title}
                            </span>
                          </div>

                          {idx > 0 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveAgreementSequence(idx)}
                              style={{
                                background: 'transparent',
                                border: 'none',
                                color: 'var(--color-danger)',
                                fontSize: '0.75rem',
                                fontWeight: 700,
                                cursor: 'pointer',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px'
                              }}
                            >
                              <Trash2 size={13} />
                              <span>Remove Sequence #{seq.sequence}</span>
                            </button>
                          )}
                        </div>

                        {/* Sequence Dates and Rates Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px 14px' }}>
                          <div className="form-group">
                            <label className="form-label">Agreement Start Date *</label>
                            <input
                              type="date"
                              required
                              value={seq.start_date}
                              onChange={(e) => handleUpdateSequence(idx, 'start_date', e.target.value)}
                              className="form-input"
                            />
                          </div>

                          <div className="form-group">
                            <label className="form-label">Agreement End Date *</label>
                            <input
                              type="date"
                              required
                              value={seq.end_date}
                              onChange={(e) => handleUpdateSequence(idx, 'end_date', e.target.value)}
                              className="form-input"
                            />
                          </div>

                          <div className="form-group">
                            <label className="form-label">Calculated Margin Spread</label>
                            <div style={{
                              height: '40px',
                              padding: '0 12px',
                              borderRadius: 'var(--radius-md)',
                              background: 'var(--bg-card)',
                              border: '1px solid var(--border-medium)',
                              fontWeight: 800,
                              color: 'var(--color-success)',
                              fontSize: '0.84rem',
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              boxSizing: 'border-box'
                            }}>
                              <span>€{diff}/h</span>
                              <span className="badge badge-ready">{margin}% Margin</span>
                            </div>
                          </div>

                          <div className="form-group">
                            <label className="form-label">Client Bill Rate (€/h) *</label>
                            <input
                              type="number"
                              step="0.01"
                              required
                              value={seq.client_rate}
                              onChange={(e) => handleUpdateSequence(idx, 'client_rate', e.target.value)}
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
                              value={seq.ba_rate}
                              onChange={(e) => handleUpdateSequence(idx, 'ba_rate', e.target.value)}
                              placeholder="95.00"
                              className="form-input"
                            />
                          </div>

                          <div className="form-group" style={{ display: 'flex', alignItems: 'center', paddingTop: '24px' }}>
                            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                              <input
                                type="checkbox"
                                checked={seq.has_rate_revision}
                                onChange={(e) => handleUpdateSequence(idx, 'has_rate_revision', e.target.checked)}
                                style={{ width: '16px', height: '16px', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
                              />
                              <span>Rate Increase / Revised Rate (Admin)</span>
                            </label>
                          </div>
                        </div>

                        {/* Rate Increase & Revised Rate Sub-card (Admin Option) */}
                        {seq.has_rate_revision && (
                          <div style={{
                            background: 'rgba(79, 70, 229, 0.05)',
                            border: '1px dashed rgba(79, 70, 229, 0.35)',
                            borderRadius: 'var(--radius-md)',
                            padding: '14px 16px',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '12px'
                          }}>
                            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span>📈 Admin Rate Increase & Revision Controls</span>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                              <div className="form-group">
                                <label className="form-label">Revised Client Rate (€/h) *</label>
                                <input
                                  type="number"
                                  step="0.01"
                                  required
                                  value={seq.revised_client_rate}
                                  onChange={(e) => handleUpdateSequence(idx, 'revised_client_rate', e.target.value)}
                                  placeholder="e.g. 115.00"
                                  className="form-input"
                                />
                              </div>

                              <div className="form-group">
                                <label className="form-label">Revised BA Pay Rate (€/h) *</label>
                                <input
                                  type="number"
                                  step="0.01"
                                  required
                                  value={seq.revised_ba_rate}
                                  onChange={(e) => handleUpdateSequence(idx, 'revised_ba_rate', e.target.value)}
                                  placeholder="e.g. 102.00"
                                  className="form-input"
                                />
                              </div>

                              <div className="form-group">
                                <label className="form-label">Date of Revised Rate *</label>
                                <input
                                  type="date"
                                  required
                                  value={seq.rate_revision_effective_date}
                                  onChange={(e) => handleUpdateSequence(idx, 'rate_revision_effective_date', e.target.value)}
                                  className="form-input"
                                />
                              </div>

                              <div className="form-group" style={{ gridColumn: 'span 3' }}>
                                <label className="form-label">Revision Reason / Admin Audit Log Notes *</label>
                                <input
                                  type="text"
                                  required
                                  value={seq.rate_revision_reason}
                                  onChange={(e) => handleUpdateSequence(idx, 'rate_revision_reason', e.target.value)}
                                  placeholder="e.g. Annual client billing escalation and seniority grade advancement"
                                  className="form-input"
                                />
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Add Sequence Button (Up to 10) */}
                  {agreementSequences.length < 10 && (
                    <button
                      type="button"
                      onClick={handleAddAgreementSequence}
                      className="btn btn-secondary"
                      style={{
                        padding: '10px 16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        borderStyle: 'dashed',
                        fontWeight: 700
                      }}
                    >
                      <Plus size={15} />
                      <span>+ Add Next Agreement / Extension Sequence (Currently {agreementSequences.length}/10)</span>
                    </button>
                  )}
                </div>
              </div>


              {/* Section 4: Dutch Compliance & Screening Checklist (BGC & VOG Separate) */}
              <div className="glass-card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-warning)', marginBottom: '16px' }}>
                  <ShieldCheck size={16} />
                  <span>4. Dutch Compliance & Screening Checklist (BGC & VOG Separate)</span>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px 16px' }}>
                  {/* Separate Field 1: BGC Status */}
                  <div className="form-group">
                    <label className="form-label">BGC Status (Background Check) *</label>
                    <select
                      required
                      value={formData.bgc_status}
                      onChange={(e) => setFormData({ ...formData, bgc_status: e.target.value })}
                      className="form-select"
                    >
                      <option value="COMPLETED">Completed & Verified</option>
                      <option value="PENDING">In Progress / Pending</option>
                      <option value="NOT_REQUIRED">Not Applicable</option>
                    </select>
                  </div>

                  {/* Separate Field 2: VOG Status */}
                  <div className="form-group">
                    <label className="form-label">VOG Status (Certificate of Conduct) *</label>
                    <select
                      required
                      value={formData.vog_status}
                      onChange={(e) => setFormData({ ...formData, vog_status: e.target.value })}
                      className="form-select"
                    >
                      <option value="COMPLETED">Valid & Verified</option>
                      <option value="PENDING">Application Submitted / Pending</option>
                      <option value="NOT_REQUIRED">Not Applicable</option>
                    </select>
                  </div>

                  {/* Field 3: VISA Type */}
                  <div className="form-group">
                    <label className="form-label">VISA Type *</label>
                    <select
                      required
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

                  {/* Field 4: SNA Standard */}
                  <div className="form-group">
                    <label className="form-label">SNA Compliant (NEN 4400-1) *</label>
                    <select
                      required
                      value={formData.sna_status}
                      onChange={(e) => setFormData({ ...formData, sna_status: e.target.value })}
                      className="form-select"
                    >
                      <option value="VERIFIED">Yes / Verified (NEN 4400-1)</option>
                      <option value="PENDING">No / Pending Audit</option>
                      <option value="EXEMPT">Exempt</option>
                    </select>
                  </div>

                  {/* Field 5: Initial Readiness */}
                  <div className="form-group">
                    <label className="form-label">Initial Placement Readiness *</label>
                    <select
                      required
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
            </>
          )}

          {/* ================= TAB 2: COMPLIANCE DOCUMENTS & ATTACHMENTS ================= */}
          {activeModalTab === 'documents' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {/* Info banner */}
              <div style={{
                background: 'rgba(79, 70, 229, 0.08)',
                border: '1px solid rgba(79, 70, 229, 0.25)',
                borderRadius: 'var(--radius-md)',
                padding: '14px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '8px',
                    background: 'var(--accent-primary-light)',
                    color: 'var(--accent-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Paperclip size={18} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                      Associate Document Repository & Verification
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                      Attach mandatory Dutch compliance certificates (VOG, ID, SOW, Visa, KVK) to establish audit-ready records.
                    </div>
                  </div>
                </div>

                <div className="badge badge-ready" style={{ fontSize: '0.75rem', padding: '4px 10px' }}>
                  {attachedCount} of {attachedDocs.length} Attached
                </div>
              </div>

              {/* Document List Matrix */}
              <div className="glass-card" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem', fontWeight: 700, color: 'var(--color-info)' }}>
                    <FileCheck size={16} />
                    <span>Mandatory & Regulatory Documents Checklist</span>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    Supported formats: PDF, DOCX, PNG, JPG (Max 25MB)
                  </span>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {attachedDocs.map((doc) => {
                    const isAttached = doc.status === 'ATTACHED';
                    return (
                      <div
                        key={doc.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '12px 16px',
                          borderRadius: 'var(--radius-md)',
                          background: isAttached ? 'rgba(16, 185, 129, 0.06)' : 'var(--bg-elevated)',
                          border: isAttached ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-subtle)',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                          <div style={{
                            width: '34px',
                            height: '34px',
                            borderRadius: '8px',
                            background: isAttached ? 'rgba(16, 185, 129, 0.15)' : 'var(--bg-card)',
                            color: isAttached ? 'var(--color-success)' : 'var(--text-muted)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            {isAttached ? <CheckCircle2 size={18} /> : <File size={18} />}
                          </div>

                          <div style={{ minWidth: 0, flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontWeight: 700, fontSize: '0.84rem', color: 'var(--text-primary)' }}>
                                {doc.title}
                              </span>
                              {doc.is_required && (
                                <span className="badge badge-warning" style={{ fontSize: '0.625rem', padding: '1px 6px' }}>
                                  Required *
                                </span>
                              )}
                            </div>

                            {isAttached ? (
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '2px', fontSize: '0.72rem', color: 'var(--color-success)', fontWeight: 600 }}>
                                <span style={{ textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                  📄 {doc.file_name}
                                </span>
                                <span>•</span>
                                <span>{doc.file_size}</span>
                                <span>•</span>
                                <span>Verified</span>
                              </div>
                            ) : (
                              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                                No document attached yet — click upload or drag file to attach.
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Action buttons */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '16px' }}>
                          {isAttached ? (
                            <button
                              type="button"
                              onClick={() => handleRemoveDoc(doc.id)}
                              className="btn btn-secondary btn-icon"
                              style={{ width: '32px', height: '32px', color: 'var(--color-danger)' }}
                              title="Remove Attachment"
                            >
                              <Trash2 size={14} />
                            </button>
                          ) : (
                            <label
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '6px 14px',
                                borderRadius: 'var(--radius-md)',
                                background: 'var(--accent-primary-light)',
                                color: 'var(--accent-primary)',
                                fontWeight: 700,
                                fontSize: '0.78125rem',
                                cursor: 'pointer',
                                border: '1px solid rgba(79, 70, 229, 0.3)',
                                transition: 'all 0.2s ease'
                              }}
                            >
                              <UploadCloud size={14} />
                              <span>Upload File</span>
                              <input
                                type="file"
                                onChange={(e) => handleSimulateFileUpload(doc.id, e)}
                                style={{ display: 'none' }}
                                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                              />
                            </label>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Add Custom Document Section */}
              <div className="glass-card" style={{ padding: '18px 20px' }}>
                <div style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '10px' }}>
                  + Add Custom Supporting Document or NDA
                </div>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <input
                    type="text"
                    value={customDocTitle}
                    onChange={(e) => setCustomDocTitle(e.target.value)}
                    placeholder="e.g. Non-Disclosure Agreement (NDA), Driver License, Bank Statement..."
                    className="form-input"
                    style={{ flex: 1 }}
                  />
                  <button
                    type="button"
                    onClick={handleAddCustomDoc}
                    disabled={!customDocTitle.trim()}
                    className="btn btn-secondary"
                    style={{ whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Plus size={14} />
                    <span>Add Document</span>
                  </button>
                </div>
              </div>
            </div>
          )}



          {/* Footer Buttons */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderTop: '1px solid var(--border-subtle)',
            paddingTop: '16px'
          }}>
            {activeModalTab === 'details' ? (
              <>
                <button
                  type="button"
                  onClick={onClose}
                  disabled={loading}
                  className="btn btn-secondary"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleProceedToDocuments}
                  className="btn btn-primary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
                >
                  <span>Save & Proceed to Documents</span>
                  <ArrowRight size={16} />
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setActiveModalTab('details')}
                  className="btn btn-secondary"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <span>← Back to Associate Details</span>
                </button>

                <div style={{ display: 'flex', gap: '12px' }}>
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
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
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
              </>
            )}
          </div>

        </form>
      </div>
    </div>
  );
}


