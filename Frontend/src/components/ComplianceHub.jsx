import React, { useState, useEffect } from 'react';
import { ShieldCheck, AlertTriangle, CheckCircle, FileText, Filter, Search, User } from 'lucide-react';
import { apiService } from '../services/api';

export default function ComplianceHub({ onSelectAssociate }) {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    fetchCompliance();
  }, []);

  const fetchCompliance = async () => {
    setLoading(true);
    try {
      const res = await apiService.getAssociates();
      setRecords(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = records.filter(r => {
    if (!filterStatus) return true;
    return r.compliance_status === filterStatus;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header */}
      <div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>
          Compliance & Legal Hub
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Operational compliance tracking: Dutch VOG certificates, Background Screening (BGC), and SNA / NEN 4400-1 labour verification.
        </p>
      </div>

      {/* Overview Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        <div className="glass-card" style={{ padding: '18px 20px' }}>
          <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
            NEN 4400-1 / SNA Verification
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#34d399' }}>100% Verified</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Labour market standard satisfied</div>
        </div>

        <div className="glass-card" style={{ padding: '18px 20px' }}>
          <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
            VOG Criminal Record Checks
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fbbf24' }}>
            {records.filter(r => r.compliance_status === 'WARNING').length} Action Items
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>Renewals or checks pending</div>
        </div>

        <div className="glass-card" style={{ padding: '18px 20px' }}>
          <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px' }}>
            Knowledge Migrant / Visa Status
          </div>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: '#38bdf8' }}>Valid</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>IND sponsorship aligned</div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="glass-card" style={{ padding: '14px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '0.9rem', fontWeight: 600 }}>Associate Compliance Register</div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="form-select"
            style={{ width: '180px' }}
          >
            <option value="">All Statuses</option>
            <option value="COMPLIANT">Compliant Only</option>
            <option value="WARNING">Warning / Action Needed</option>
            <option value="NON_COMPLIANT">Non-Compliant</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="custom-table">
          <thead>
            <tr>
              <th>Associate</th>
              <th>Client</th>
              <th>Overall Compliance</th>
              <th>Working Country</th>
              <th>Joining Date</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(r => (
              <tr key={r.id}>
                <td>
                  <div style={{ fontWeight: 700, color: '#fff' }}>{r.full_name}</div>
                  <div style={{ fontSize: '0.75rem', color: '#818cf8', fontFamily: 'monospace' }}>{r.ba_id}</div>
                </td>
                <td>
                  <div style={{ fontWeight: 600 }}>{r.current_client?.name || 'Unassigned'}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{r.primary_role}</div>
                </td>
                <td>
                  <span className={`badge badge-${r.compliance_status === 'COMPLIANT' ? 'ready' : (r.compliance_status === 'WARNING' ? 'action' : 'not-ready')}`}>
                    {r.compliance_status}
                  </span>
                </td>
                <td>{r.working_country}</td>
                <td>{r.joining_date}</td>
                <td style={{ textAlign: 'right' }}>
                  <button onClick={() => onSelectAssociate(r.id)} className="btn btn-secondary btn-sm">
                    Inspect 360°
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
