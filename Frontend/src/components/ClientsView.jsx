import React, { useState, useEffect } from 'react';
import { Building, MapPin, Mail, Users, Plus, ArrowRight } from 'lucide-react';
import { apiService } from '../services/api';
import ClientDetailModal from './ClientDetailModal';

export default function ClientsView({ onSelectAssociate }) {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddClient, setShowAddClient] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  const [formData, setFormData] = useState({
    name: '',
    code: '',
    industry: 'Financial Services & Fintech',
    contact_name: '',
    contact_email: '',
    country: 'Netherlands'
  });

  const fetchClients = async () => {
    setLoading(true);
    try {
      const data = await apiService.getClients();
      setClients(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleAddClient = async (e) => {
    e.preventDefault();
    try {
      await apiService.createClient(formData);
      setShowAddClient(false);
      fetchClients();
    } catch (err) {
      alert(`Error creating client: ${err.message}`);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
            Clients & Accounts
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Client enterprise accounts, active consultant placements, and account managers. Click any client to view details.
          </p>
        </div>

        <button onClick={() => setShowAddClient(true)} className="btn btn-primary">
          <Plus size={16} />
          <span>Add Client Account</span>
        </button>
      </div>

      {/* Add Client Form */}
      {showAddClient && (
        <form onSubmit={handleAddClient} className="glass-card" style={{ padding: '20px', border: '1px solid var(--accent-primary)' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '14px', color: 'var(--accent-primary)' }}>
            New Client Account
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label">Client Name *</label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Adyen"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Client Code *</label>
              <input
                type="text"
                required
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="e.g. ADYEN-NL"
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Industry</label>
              <input
                type="text"
                value={formData.industry}
                onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                className="form-input"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Contact Person</label>
              <input
                type="text"
                value={formData.contact_name}
                onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                className="form-input"
              />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
            <button type="button" onClick={() => setShowAddClient(false)} className="btn btn-secondary btn-sm">
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-sm">
              Save Client
            </button>
          </div>
        </form>
      )}

      {/* Grid of Clients */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
        {clients.map(c => (
          <div 
            key={c.id} 
            className="glass-card" 
            onClick={() => setSelectedClient(c)}
            style={{ 
              padding: '20px', 
              display: 'flex', 
              flexDirection: 'column', 
              gap: '12px',
              cursor: 'pointer',
              transition: 'border-color 0.15s ease, transform 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent-primary)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ 
                  width: '40px', 
                  height: '40px', 
                  borderRadius: '8px', 
                  background: 'var(--accent-primary-light)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontWeight: 800, 
                  color: 'var(--accent-primary)' 
                }}>
                  {c.name.slice(0, 2).toUpperCase()}
                </div>
                <div>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '1rem' }}>{c.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontFamily: 'monospace' }}>{c.code}</div>
                </div>
              </div>
              <span className="badge badge-info">
                {c.active_associates_count || 0} Active BAs
              </span>
            </div>

            <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              Industry: <strong>{c.industry}</strong>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span>{c.country}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--accent-primary)', fontWeight: 600 }}>
                <span>View Details</span>
                <ArrowRight size={12} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pop-up Client Detail Modal */}
      {selectedClient && (
        <ClientDetailModal
          client={selectedClient}
          isOpen={!!selectedClient}
          onClose={() => setSelectedClient(null)}
          onSelectAssociate={onSelectAssociate}
        />
      )}

    </div>
  );
}
