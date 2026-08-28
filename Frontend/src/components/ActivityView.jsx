import React, { useState, useEffect } from 'react';
import { Activity, Clock, User, Shield, RefreshCw, ArrowRight } from 'lucide-react';
import { apiService } from '../services/api';
import ActivityDetailModal from './ActivityDetailModal';

export default function ActivityView({ onSelectAssociate }) {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedActivity, setSelectedActivity] = useState(null);

  const fetchActivities = async () => {
    setLoading(true);
    try {
      const data = await apiService.getActivities();
      setActivities(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
            Audit & Activity Trail
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Traceable change logs, agreement extensions, compliance verifications, and rate modifications. Click any event to inspect.
          </p>
        </div>

        <button onClick={fetchActivities} className="btn btn-secondary btn-sm">
          <RefreshCw size={14} className={loading ? 'spinning' : ''} />
          <span>Refresh Trail</span>
        </button>
      </div>

      {/* Activity Timeline */}
      <div className="glass-card" style={{ padding: '24px' }}>
        {activities.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            No recent activity logs recorded yet.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {activities.map((act) => (
              <div
                key={act.id}
                onClick={() => setSelectedActivity(act)}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '14px',
                  padding: '14px 16px',
                  background: 'var(--bg-elevated)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  cursor: 'pointer',
                  transition: 'border-color 0.15s ease, transform 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = 'var(--accent-primary)';
                  e.currentTarget.style.transform = 'translateX(2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  e.currentTarget.style.transform = 'translateX(0)';
                }}
              >
                <div style={{
                  padding: '8px',
                  borderRadius: '8px',
                  background: 'var(--accent-primary-light)',
                  color: 'var(--accent-primary)',
                  marginTop: '2px',
                  flexShrink: 0
                }}>
                  <Activity size={16} />
                </div>

                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.875rem' }}>
                      {act.action_type}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {new Date(act.created_at).toLocaleString()}
                    </span>
                  </div>

                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem', marginBottom: '6px', lineHeight: 1.4 }}>
                    {act.description}
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    <span>Actor: <strong style={{ color: 'var(--text-primary)' }}>{act.actor}</strong></span>
                    <span style={{ color: 'var(--accent-primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}>
                      <span>Details</span>
                      <ArrowRight size={11} />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Activity Detail Pop-up Modal */}
      {selectedActivity && (
        <ActivityDetailModal
          activity={selectedActivity}
          isOpen={!!selectedActivity}
          onClose={() => setSelectedActivity(null)}
          onSelectAssociate={onSelectAssociate}
        />
      )}

    </div>
  );
}
