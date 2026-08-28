import React, { useState } from 'react';
import { 
  Users, CheckCircle2, AlertCircle, AlertTriangle, Clock, 
  TrendingUp, DollarSign, ShieldAlert, ArrowRight, PlusCircle,
  Building, Calendar, UserCheck, Wallet, ArrowUpRight, BarChart3
} from 'lucide-react';
import ClientDetailModal from './ClientDetailModal';
import FinanceDetailModal from './FinanceDetailModal';
import PayrollCostModal from './PayrollCostModal';
import ReadinessDrilldownModal from './ReadinessDrilldownModal';
import ExpiringAgreementsModal from './ExpiringAgreementsModal';
import PlacementsDrilldownModal from './PlacementsDrilldownModal';

export default function ControlTowerDashboard({ 
  stats, 
  associates = [],
  onSelectAssociate, 
  onOpenCreateModal
}) {
  const overview = stats?.overview || {};
  const urgentActions = stats?.urgent_actions || [];
  const topClients = stats?.top_clients || [];
  const employmentDist = stats?.employment_distribution || [];

  // In-Page Pop-up Modal States (No page transitions - everything opens in pop-ups!)
  const [activeModal, setActiveModal] = useState(null); // 'finance' | 'payroll' | 'placements' | 'readiness' | 'expiring'
  const [selectedClient, setSelectedClient] = useState(null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Banner / Welcome & Quick Actions */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
            Control Tower Dashboard
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Executive operational overview of total profit margin, consultant payroll cost, active placements & contract expiries. Click any card for instant in-page details.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={onOpenCreateModal}
            className="btn btn-primary"
          >
            <PlusCircle size={16} />
            <span>Add New Associate</span>
          </button>
          
          <button 
            onClick={() => setActiveModal('placements')}
            className="btn btn-secondary"
          >
            <Users size={16} />
            <span>Active Placements Roster</span>
          </button>
        </div>
      </div>

      {/* Row 1: Dedicated Finance & Commercial Intelligence KPIs (Total Profit Margin, Payroll Cost, Revenue) */}
      <div>
        <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
          <DollarSign size={15} style={{ color: 'var(--color-success)' }} />
          <span>Financial & Commercial Performance (Monthly Run-Rate)</span>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '16px'
        }}>
          
          {/* 1. Total Net Profit Margin */}
          <div 
            className="glass-card" 
            onClick={() => setActiveModal('finance')}
            style={{ 
              padding: '20px', 
              cursor: 'pointer', 
              transition: 'border-color 0.15s ease, transform 0.15s ease',
              borderLeft: '4px solid var(--color-success)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-success)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                Total Net Profit Margin
              </span>
              <div style={{ background: 'var(--color-success-bg)', color: 'var(--color-success)', padding: '6px', borderRadius: '8px' }}>
                <TrendingUp size={18} />
              </div>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-success)', marginBottom: '4px' }}>
              €{(overview.monthly_profit_margin || 0).toLocaleString()}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span>Weighted: <strong style={{ color: 'var(--color-success)' }}>{overview.weighted_margin_pct || overview.avg_margin_percentage || 0}%</strong></span>
              <span style={{ color: 'var(--accent-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}>
                Inspect <ArrowRight size={11} />
              </span>
            </div>
          </div>

          {/* 2. Total Payroll & Consultant Cost */}
          <div 
            className="glass-card" 
            onClick={() => setActiveModal('payroll')}
            style={{ 
              padding: '20px', 
              cursor: 'pointer', 
              transition: 'border-color 0.15s ease, transform 0.15s ease',
              borderLeft: '4px solid var(--accent-primary)'
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                Total Consultant & Payroll Cost
              </span>
              <div style={{ background: 'var(--accent-primary-light)', color: 'var(--accent-primary)', padding: '6px', borderRadius: '8px' }}>
                <Wallet size={18} />
              </div>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
              €{(overview.monthly_payroll_cost || 0).toLocaleString()}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span>Payroll: €{(overview.payroll_only_cost || 0).toLocaleString()}</span>
              <span style={{ color: 'var(--accent-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}>
                Cost Details <ArrowRight size={11} />
              </span>
            </div>
          </div>

          {/* 3. Monthly Gross Revenue Run-Rate */}
          <div 
            className="glass-card" 
            onClick={() => setActiveModal('finance')}
            style={{ 
              padding: '20px', 
              cursor: 'pointer', 
              transition: 'border-color 0.15s ease, transform 0.15s ease',
              borderLeft: '4px solid var(--color-info)'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--color-info)';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                Monthly Gross Revenue
              </span>
              <div style={{ background: 'var(--color-info-bg)', color: 'var(--color-info)', padding: '6px', borderRadius: '8px' }}>
                <DollarSign size={18} />
              </div>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
              €{(overview.monthly_gross_revenue || 0).toLocaleString()}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span style={{ color: 'var(--color-success)', fontWeight: 600 }}>Annual: €{(overview.annualized_run_rate || 0).toLocaleString()}</span>
              <span style={{ color: 'var(--color-info)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}>
                Breakdown <ArrowRight size={11} />
              </span>
            </div>
          </div>

          {/* 4. Commercial Average Rates */}
          <div 
            className="glass-card" 
            onClick={() => setActiveModal('finance')}
            style={{ 
              padding: '20px', 
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
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
              <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                Avg Hourly Spread
              </span>
              <div style={{ background: 'var(--bg-elevated)', color: 'var(--color-info)', padding: '6px', borderRadius: '8px' }}>
                <BarChart3 size={18} />
              </div>
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-info)', marginBottom: '4px' }}>
              +€{overview.avg_spread_diff || 0}/h
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Bill: €{overview.avg_client_rate}/h • Pay: €{overview.avg_ba_rate}/h
            </div>
          </div>

        </div>
      </div>

      {/* Row 2: Operational & Deployment KPIs (Placements, Readiness, Expirations) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '16px'
      }}>
        {/* Active Placements */}
        <div 
          className="glass-card" 
          onClick={() => setActiveModal('placements')}
          style={{ padding: '20px', cursor: 'pointer', transition: 'border-color 0.15s ease, transform 0.15s ease' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--accent-primary)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-subtle)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Active Placements
            </span>
            <div style={{ background: 'var(--accent-primary-light)', color: 'var(--accent-primary)', padding: '6px', borderRadius: '8px' }}>
              <Users size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
            {overview.active_associates || 0}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span>Total Headcount: <strong>{overview.total_associates || 0}</strong></span>
            <span style={{ color: 'var(--accent-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}>
              Pop-up List <ArrowRight size={11} />
            </span>
          </div>
        </div>

        {/* Readiness Status */}
        <div 
          className="glass-card" 
          onClick={() => setActiveModal('readiness')}
          style={{ padding: '20px', cursor: 'pointer', transition: 'border-color 0.15s ease, transform 0.15s ease' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-success)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-subtle)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Readiness Breakdown
            </span>
            <div style={{ background: 'var(--color-success-bg)', color: 'var(--color-success)', padding: '6px', borderRadius: '8px' }}>
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginBottom: '6px' }}>
            <span style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--color-success)' }}>
              {overview.ready_count || 0}
            </span>
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Ready</span>
          </div>
          <div style={{ display: 'flex', gap: '8px', fontSize: '0.75rem' }}>
            <span className="badge badge-warning">{overview.action_required_count || 0} Action Req.</span>
            <span className="badge badge-danger">{overview.not_ready_count || 0} Blocked</span>
          </div>
        </div>

        {/* Agreements Expiring Bucket */}
        <div 
          className="glass-card" 
          onClick={() => setActiveModal('expiring')}
          style={{ padding: '20px', cursor: 'pointer', transition: 'border-color 0.15s ease, transform 0.15s ease' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = 'var(--color-warning)';
            e.currentTarget.style.transform = 'translateY(-2px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'var(--border-subtle)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              Expiring in ≤30 Days
            </span>
            <div style={{ background: 'var(--color-warning-bg)', color: 'var(--color-warning)', padding: '6px', borderRadius: '8px' }}>
              <Clock size={18} />
            </div>
          </div>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: overview.expiring_30d > 0 ? 'var(--color-warning)' : 'var(--text-primary)', marginBottom: '4px' }}>
            {overview.expiring_30d || 0}
          </div>
          <div style={{ display: 'flex', gap: '8px', fontSize: '0.75rem' }}>
            <span style={{ color: 'var(--color-danger)' }}>≤7d: <strong>{overview.expiring_7d || 0}</strong></span>
            <span style={{ color: 'var(--text-muted)' }}>•</span>
            <span style={{ color: 'var(--color-warning)' }}>≤14d: <strong>{overview.expiring_14d || 0}</strong></span>
          </div>
        </div>
      </div>

      {/* Main Grid: Urgent Action Queue & Top Clients */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1.2fr)', gap: '20px' }}>
        
        {/* Urgent Actions Queue */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <AlertCircle size={20} style={{ color: 'var(--color-warning)' }} />
              <h2 style={{ fontSize: '1.15rem', fontWeight: 700 }}>Urgent Action Queue</h2>
            </div>
            <span className="badge badge-warning">
              {urgentActions.length} Pending Actions
            </span>
          </div>

          {urgentActions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--text-muted)' }}>
              <CheckCircle2 size={36} style={{ color: 'var(--color-success)', margin: '0 auto 12px' }} />
              <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>All clear! No urgent items</div>
              <div style={{ fontSize: '0.8125rem' }}>Agreements and compliance records are in healthy states.</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {urgentActions.map((action) => (
                <div
                  key={action.id}
                  onClick={() => onSelectAssociate(action.associate_id)}
                  style={{
                    background: action.urgency === 'CRITICAL' ? 'var(--color-danger-bg)' : 'var(--bg-elevated)',
                    border: `1px solid ${action.urgency === 'CRITICAL' ? 'var(--color-danger-border)' : 'var(--border-subtle)'}`,
                    borderRadius: 'var(--radius-md)',
                    padding: '14px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '16px',
                    cursor: 'pointer',
                    transition: 'border-color 0.15s ease, transform 0.15s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = 'var(--accent-primary)';
                    e.currentTarget.style.transform = 'translateX(2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = action.urgency === 'CRITICAL' ? 'var(--color-danger-border)' : 'var(--border-subtle)';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                    <div style={{
                      padding: '6px',
                      borderRadius: '8px',
                      background: action.type === 'AGREEMENT_EXPIRY' ? 'var(--color-warning-bg)' : 'var(--color-danger-bg)',
                      color: action.type === 'AGREEMENT_EXPIRY' ? 'var(--color-warning)' : 'var(--color-danger)',
                      marginTop: '2px',
                      flexShrink: 0
                    }}>
                      {action.type === 'AGREEMENT_EXPIRY' ? <Clock size={16} /> : <ShieldAlert size={16} />}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                        <span style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>
                          {action.title}
                        </span>
                        <span className={`badge badge-${action.urgency === 'CRITICAL' ? 'danger' : 'warning'}`} style={{ fontSize: '0.65rem' }}>
                          {action.urgency}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.78125rem', color: 'var(--text-secondary)' }}>
                        {action.message}
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectAssociate(action.associate_id);
                    }}
                    className="btn btn-secondary btn-sm"
                    style={{ flexShrink: 0 }}
                  >
                    <span>View BA 360°</span>
                    <ArrowRight size={13} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Clients & Distribution */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          {/* Top Clients */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Building size={18} style={{ color: 'var(--color-info)' }} />
                <h3 style={{ fontSize: '1rem', fontWeight: 700 }}>Client Headcount</h3>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Click for details</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {topClients.map((c) => (
                <div
                  key={c.id}
                  onClick={() => setSelectedClient(c)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-subtle)',
                    cursor: 'pointer',
                    transition: 'border-color 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '6px',
                      background: 'var(--accent-primary-light)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.75rem',
                      color: 'var(--accent-primary)'
                    }}>
                      {c.name.slice(0, 2).toUpperCase()}
                    </div>
                    <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{c.name}</span>
                  </div>
                  <span className="badge badge-info" style={{ fontSize: '0.75rem' }}>
                    {c.associate_count} {c.associate_count === 1 ? 'BA' : 'BAs'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Employment Type Distribution */}
          <div className="glass-card" style={{ padding: '20px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '12px' }}>
              Contract Type Distribution
            </h3>
            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              {employmentDist.map((item) => (
                <div
                  key={item.employment_type}
                  onClick={() => setActiveModal('placements')}
                  style={{
                    flex: 1,
                    minWidth: '100px',
                    background: 'var(--bg-elevated)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: 'var(--radius-md)',
                    padding: '12px',
                    textAlign: 'center',
                    cursor: 'pointer',
                    transition: 'border-color 0.15s ease'
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-subtle)'}
                >
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>{item.count}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '2px' }}>
                    {item.employment_type}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

      {/* ================= IN-PAGE POP-UP MODALS ================= */}

      {/* 1. Total Profit Margin & Commercials Modal */}
      {activeModal === 'finance' && (
        <FinanceDetailModal
          isOpen={activeModal === 'finance'}
          onClose={() => setActiveModal(null)}
          stats={stats}
          onSelectAssociate={onSelectAssociate}
        />
      )}

      {/* 2. Payroll & Consultant Cost Modal */}
      {activeModal === 'payroll' && (
        <PayrollCostModal
          isOpen={activeModal === 'payroll'}
          onClose={() => setActiveModal(null)}
          stats={stats}
          onSelectAssociate={onSelectAssociate}
        />
      )}

      {/* 3. Active Placements Modal */}
      {activeModal === 'placements' && (
        <PlacementsDrilldownModal
          isOpen={activeModal === 'placements'}
          onClose={() => setActiveModal(null)}
          associates={associates}
          onSelectAssociate={onSelectAssociate}
        />
      )}

      {/* 4. Readiness Breakdown Modal */}
      {activeModal === 'readiness' && (
        <ReadinessDrilldownModal
          isOpen={activeModal === 'readiness'}
          onClose={() => setActiveModal(null)}
          associates={associates}
          onSelectAssociate={onSelectAssociate}
        />
      )}

      {/* 5. Expiring Agreements Modal */}
      {activeModal === 'expiring' && (
        <ExpiringAgreementsModal
          isOpen={activeModal === 'expiring'}
          onClose={() => setActiveModal(null)}
          stats={stats}
          associates={associates}
          onSelectAssociate={onSelectAssociate}
        />
      )}

      {/* 6. Client Details Modal */}
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
