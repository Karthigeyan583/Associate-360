import React, { useState } from 'react';
import { 
  Search, Filter, Plus, User, Building, Calendar, DollarSign, 
  CheckCircle, AlertTriangle, XCircle, LayoutGrid, List, ChevronRight,
  TrendingUp, Clock, ShieldCheck, Briefcase, Globe
} from 'lucide-react';


export default function AssociateDirectory({ 
  associates, 
  loading, 
  onSelectAssociate, 
  onOpenCreateModal,
  searchQuery,
  setSearchQuery,
  filterReadiness,
  setFilterReadiness,
  filterEmploymentType,
  setFilterEmploymentType,
  filterExpiry,
  setFilterExpiry
}) {
  const [viewMode, setViewMode] = useState('table'); // 'table' | 'grid'

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

  const getComplianceBadge = (status) => {
    switch (status) {
      case 'COMPLIANT':
        return <span style={{ color: 'var(--color-success)', fontWeight: 600, fontSize: '0.75rem' }}>✓ Compliant</span>;
      case 'WARNING':
        return <span style={{ color: 'var(--color-warning)', fontWeight: 600, fontSize: '0.75rem' }}>⚠ Warning</span>;
      case 'NON_COMPLIANT':
        return <span style={{ color: 'var(--color-danger)', fontWeight: 600, fontSize: '0.75rem' }}>✕ Non-Compliant</span>;
      default:
        return <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Unknown</span>;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
            Associate 360° Directory
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Complete consultant profiles with photo, contracting companies, rates difference spread, agreement extensions & compliance.
          </p>
        </div>

        <button onClick={onOpenCreateModal} className="btn btn-primary">
          <Plus size={16} />
          <span>Add Associate (27 Fields)</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
          
          {/* Search Box */}
          <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search by Name, BA ID (e.g. 2002896), Client, Company, Role..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input"
              style={{ paddingLeft: '36px' }}
            />
          </div>

          {/* Readiness Filter */}
          <div style={{ minWidth: '150px' }}>
            <select
              value={filterReadiness}
              onChange={(e) => setFilterReadiness(e.target.value)}
              className="form-select"
            >
              <option value="">All Readiness</option>
              <option value="READY">Ready</option>
              <option value="ACTION_REQUIRED">Action Required</option>
              <option value="NOT_READY">Not Ready</option>
            </select>
          </div>

          {/* Employment Type Filter */}
          <div style={{ minWidth: '150px' }}>
            <select
              value={filterEmploymentType}
              onChange={(e) => setFilterEmploymentType(e.target.value)}
              className="form-select"
            >
              <option value="">All Types</option>
              <option value="PAYROLL">Payroll / Perm</option>
              <option value="ZZP">Contract / ZZP</option>
              <option value="SUBCONTRACTOR">Subcontractor</option>
            </select>
          </div>

          {/* Expiry Bucket */}
          <div style={{ minWidth: '150px' }}>
            <select
              value={filterExpiry}
              onChange={(e) => setFilterExpiry(e.target.value)}
              className="form-select"
            >
              <option value="">All Expiries</option>
              <option value="7">Expiring ≤ 7 Days</option>
              <option value="14">Expiring ≤ 14 Days</option>
              <option value="30">Expiring ≤ 30 Days</option>
            </select>
          </div>

          {/* View Mode Toggle */}
          <div style={{ display: 'flex', background: 'var(--bg-elevated)', padding: '4px', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <button
              onClick={() => setViewMode('table')}
              style={{
                background: viewMode === 'table' ? 'var(--accent-primary)' : 'transparent',
                color: viewMode === 'table' ? '#fff' : 'var(--text-secondary)',
                border: 'none',
                padding: '6px 10px',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
              title="Table View"
            >
              <List size={16} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              style={{
                background: viewMode === 'grid' ? 'var(--accent-primary)' : 'transparent',
                color: viewMode === 'grid' ? '#fff' : 'var(--text-secondary)',
                border: 'none',
                padding: '6px 10px',
                borderRadius: 'var(--radius-sm)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
              title="Grid Cards View"
            >
              <LayoutGrid size={16} />
            </button>
          </div>

        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
          <div className="pulse-dot online" style={{ margin: '0 auto 16px', width: '12px', height: '12px' }} />
          <div>Loading Associate 360 records from Django REST API...</div>
        </div>
      ) : associates.length === 0 ? (
        <div className="glass-card" style={{ textAlign: 'center', padding: '60px 20px' }}>
          <User size={40} style={{ color: 'var(--text-muted)', margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '4px' }}>
            No Associates Found
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '16px' }}>
            Try adjusting your search criteria or add a new associate record.
          </p>
          <button onClick={onOpenCreateModal} className="btn btn-primary">
            <Plus size={16} />
            <span>Create Associate</span>
          </button>
        </div>
      ) : viewMode === 'table' ? (
        
        /* Table View */
        <div className="table-container">
          <table className="custom-table">
            <thead>
              <tr>
                <th>Photo & BA Details</th>
                <th>Contracting Entities</th>
                <th>Client & Role</th>
                <th>Rates Spread (€/h)</th>
                <th>Difference & Margin</th>
                <th>Readiness</th>
                <th>Agreement End</th>
                <th>Compliance</th>
                <th style={{ textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {associates.map((assoc) => {
                const agr = assoc.current_agreement;
                const days = agr?.days_remaining;
                const isUrgent = days !== undefined && days <= 14;

                return (
                  <tr key={assoc.id} style={{ cursor: 'pointer' }} onClick={() => onSelectAssociate(assoc.id)}>
                    
                    {/* Photo, Name & BA ID */}
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {assoc.photo_url ? (
                          <img
                            src={assoc.photo_url}
                            alt={assoc.full_name}
                            style={{ width: '42px', height: '42px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid var(--accent-primary)', flexShrink: 0 }}
                          />
                        ) : (
                          <div style={{ width: '42px', height: '42px', borderRadius: '50%', background: 'var(--accent-primary-light)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '0.875rem', flexShrink: 0 }}>
                            {assoc.first_name?.[0]}{assoc.last_name?.[0]}
                          </div>
                        )}
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{assoc.full_name}</span>
                            {assoc.linkedin_url && (
                              <a
                                href={assoc.linkedin_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                title="Open LinkedIn Profile"
                                style={{
                                  color: '#0a66c2',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  background: 'rgba(10, 102, 194, 0.1)',
                                  padding: '2px 5px',
                                  borderRadius: '3px',
                                  fontSize: '0.65rem',
                                  fontWeight: 700,
                                  textDecoration: 'none'
                                }}
                              >
                                in
                              </a>
                            )}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontFamily: 'monospace', fontWeight: 700 }}>
                            {assoc.ba_id} • <span style={{ color: 'var(--text-muted)' }}>{assoc.employment_type}</span>
                          </div>
                          {assoc.ba_company_name && (
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                              {assoc.ba_company_name}
                            </div>
                          )}
                        </div>
                      </div>
                    </td>


                    {/* Contracting Entities */}
                    <td>
                      <div style={{ fontSize: '0.78125rem', color: 'var(--text-primary)', fontWeight: 600 }}>
                        {assoc.company_to_ba || 'SAGEUS Ltd'}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        via {assoc.company_to_client || 'STARIDE'} ({assoc.source || 'STARIDE'})
                      </div>
                    </td>

                    {/* Client & Role */}
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                        {assoc.current_client?.name || 'KLM Royal Dutch Airlines'}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        {assoc.primary_role}
                      </div>
                    </td>

                    {/* Rates Spread (€/h) */}
                    <td>
                      {agr ? (
                        <div style={{ fontSize: '0.8125rem' }}>
                          <span style={{ color: 'var(--color-success)', fontWeight: 700 }}>€{agr.client_rate}</span>
                          <span style={{ color: 'var(--text-muted)', margin: '0 4px' }}>/</span>
                          <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>€{agr.ba_rate}</span>
                        </div>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>—</span>
                      )}
                    </td>

                    {/* Difference & Margin % */}
                    <td>
                      {agr ? (
                        <div>
                          <div style={{ color: 'var(--color-info)', fontWeight: 700, fontSize: '0.8125rem' }}>
                            +€{agr.difference || (agr.client_rate - agr.ba_rate).toFixed(2)}/h
                          </div>
                          <span className="badge badge-info" style={{ fontWeight: 700, fontSize: '0.65rem' }}>
                            {agr.margin_percentage}%
                          </span>
                        </div>
                      ) : (
                        <span style={{ color: 'var(--text-muted)' }}>—</span>
                      )}
                    </td>

                    {/* Readiness Badge */}
                    <td>
                      {getReadinessBadge(assoc.readiness_status)}
                    </td>

                    {/* Agreement End */}
                    <td>
                      {agr ? (
                        <div>
                          <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: isUrgent ? 'var(--color-danger)' : 'var(--text-primary)' }}>
                            {agr.end_date}
                          </div>
                          <div style={{ fontSize: '0.7rem', color: isUrgent ? 'var(--color-warning)' : 'var(--text-muted)' }}>
                            {days > 0 ? `${days}d left` : 'Expired'}
                          </div>
                        </div>
                      ) : (
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>No agreement</span>
                      )}
                    </td>

                    {/* Compliance */}
                    <td>
                      {getComplianceBadge(assoc.compliance_status)}
                    </td>

                    {/* Action */}
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectAssociate(assoc.id);
                        }}
                        className="btn btn-secondary btn-sm"
                      >
                        <span>360° View</span>
                        <ChevronRight size={14} />
                      </button>
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      ) : (

        /* Grid Cards View */
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))',
          gap: '16px'
        }}>
          {associates.map((assoc) => {
            const agr = assoc.current_agreement;
            return (
              <div
                key={assoc.id}
                className="glass-card"
                style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px', cursor: 'pointer' }}
                onClick={() => onSelectAssociate(assoc.id)}
              >
                {/* Header with Photo */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    {assoc.photo_url ? (
                      <img
                        src={assoc.photo_url}
                        alt={assoc.full_name}
                        style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '1.5px solid var(--accent-primary)' }}
                      />
                    ) : (
                      <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--accent-primary-light)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
                        {assoc.first_name?.[0]}{assoc.last_name?.[0]}
                      </div>
                    )}
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>{assoc.full_name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', fontFamily: 'monospace', fontWeight: 700 }}>
                        {assoc.ba_id} • <span style={{ color: 'var(--text-muted)' }}>{assoc.employment_type}</span>
                      </div>
                      {assoc.ba_company_name && (
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                          {assoc.ba_company_name}
                        </div>
                      )}
                    </div>
                  </div>
                  {getReadinessBadge(assoc.readiness_status)}
                </div>

                {/* Assignment & Client */}
                <div style={{ background: 'var(--bg-elevated)', padding: '10px 12px', borderRadius: '8px', border: '1px solid var(--border-subtle)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    <Building size={14} style={{ color: 'var(--color-info)' }} />
                    <span>{assoc.current_client?.name || 'KLM Royal Dutch Airlines'}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {assoc.primary_role} • Source: {assoc.source || 'STARIDE'}
                  </div>
                </div>

                {/* Commercials Summary */}
                {agr && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem' }}>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Rates: </span>
                      <strong style={{ color: 'var(--color-success)' }}>€{agr.client_rate}</strong> / <strong>€{agr.ba_rate}</strong>
                    </div>
                    <div style={{ color: 'var(--color-info)', fontWeight: 700 }}>
                      Diff: +€{agr.difference || (agr.client_rate - agr.ba_rate).toFixed(2)}/h ({agr.margin_percentage}%)
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid var(--border-subtle)', fontSize: '0.75rem' }}>
                  <span>{getComplianceBadge(assoc.compliance_status)}</span>
                  <span style={{ color: 'var(--accent-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    View 360° Record <ChevronRight size={13} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

      )}

    </div>
  );
}
