import React, { useState } from 'react';
import { 
  Activity, Database, Server, RefreshCw, Code, User, LogOut, 
  ChevronDown, Moon, Sun, Bell, AlertTriangle, Clock, ShieldAlert, 
  CheckCircle2, ArrowRight, X, Landmark
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function BackendStatusHeader({ 
  healthData, 
  latency, 
  isRefreshing, 
  onRefresh, 
  onOpenDiagnostics,
  onOpenToolkit,
  notifications = [],
  onSelectAssociate
}) {

  const { user, role, logout, loginWithDemo, demoPersonas } = useAuth();
  const { theme, setTheme } = useTheme();
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const isOnline = healthData && healthData.status === 'ok';
  const isDbConnected = healthData && healthData.database && healthData.database.connected;
  const unreadCount = notifications.length;

  const getRoleBadgeStyle = (r) => {
    switch (r) {
      case 'ADMIN':
        return { bg: 'rgba(99, 102, 241, 0.2)', color: '#818cf8', border: 'rgba(99, 102, 241, 0.4)' };
      case 'MANAGEMENT':
        return { bg: 'rgba(236, 72, 153, 0.2)', color: '#f472b6', border: 'rgba(236, 72, 153, 0.4)' };
      case 'COMPLIANCE':
        return { bg: 'rgba(16, 185, 129, 0.2)', color: '#34d399', border: 'rgba(16, 185, 129, 0.4)' };
      case 'FINANCE':
        return { bg: 'rgba(245, 158, 11, 0.2)', color: '#fbbf24', border: 'rgba(245, 158, 11, 0.4)' };
      default:
        return { bg: 'rgba(6, 182, 212, 0.2)', color: '#38bdf8', border: 'rgba(6, 182, 212, 0.4)' };
    }
  };

  const roleStyle = getRoleBadgeStyle(role);

  return (
    <header style={{
      height: '60px',
      minHeight: '60px',
      maxHeight: '60px',
      background: 'var(--bg-glass)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-subtle)',
      padding: '0 28px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      gap: '16px',
      boxSizing: 'border-box'
    }}>
      {/* Left: Backend & Database status */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className={`pulse-dot ${isOnline ? 'online' : 'offline'}`} />
          <span style={{ fontSize: '0.8125rem', fontWeight: 600, color: isOnline ? 'var(--color-success)' : 'var(--color-danger)' }}>
            {isOnline ? 'REST API Live' : 'Offline'}
          </span>
        </div>

        <div style={{ height: '14px', width: '1px', background: 'var(--border-medium)' }} />

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          <Server size={13} style={{ color: 'var(--accent-primary)' }} />
          <span>Port <code>8001</code></span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
          <Database size={13} style={{ color: isDbConnected ? 'var(--color-success)' : 'var(--color-danger)' }} />
          <span>PostgreSQL: <strong style={{ color: isDbConnected ? 'var(--text-primary)' : 'var(--color-danger)' }}>Associate_DB</strong></span>
        </div>

        {latency !== null && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <Activity size={12} />
            <span>{latency}ms</span>
          </div>
        )}
      </div>

      {/* Right: Theme Switcher, Notifications, Diagnostics, User Dropdown */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
        
        {/* 2-Mode Theme Switcher (Dark & Light) */}
        <div className="theme-switcher-pill">
          <button
            onClick={() => setTheme('dark')}
            className={`theme-switcher-btn ${theme === 'dark' ? 'active' : ''}`}
            title="Dark Mode"
          >
            <Moon size={13} />
            <span>Dark</span>
          </button>

          <button
            onClick={() => setTheme('light')}
            className={`theme-switcher-btn ${theme === 'light' ? 'active' : ''}`}
            title="Light Mode"
          >
            <Sun size={13} />
            <span>Light</span>
          </button>
        </div>

        {/* Top-Right Notification Center Bell */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => {
              setShowNotifications(!showNotifications);
              setShowPersonaMenu(false);
            }}
            className="btn btn-secondary btn-sm"
            style={{ position: 'relative', padding: '6px 10px' }}
            title="Notifications & Operational Alerts"
          >
            <Bell size={15} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '-4px',


                right: '-4px',
                background: '#f43f5e',
                color: '#ffffff',
                fontSize: '0.625rem',
                fontWeight: 800,
                borderRadius: '9999px',
                minWidth: '16px',
                height: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 4px',
                boxShadow: '0 0 6px rgba(244, 63, 94, 0.6)'
              }}>
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {showNotifications && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: '120%',
                width: '360px',
                maxHeight: '440px',
                background: 'var(--bg-card)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-lg)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
                display: 'flex',
                flexDirection: 'column',
                zIndex: 300,
                overflow: 'hidden'
              }}
            >
              {/* Header */}
              <div style={{
                padding: '12px 16px',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                background: 'var(--bg-elevated)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Bell size={15} style={{ color: 'var(--accent-primary)' }} />
                  <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>Operational Alerts</span>
                  <span className="badge badge-danger" style={{ fontSize: '0.625rem' }}>
                    {unreadCount} Action Required
                  </span>
                </div>

                <button
                  onClick={() => setShowNotifications(false)}
                  style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  <X size={14} />
                </button>
              </div>

              {/* Alerts List */}
              <div style={{ overflowY: 'auto', padding: '8px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {notifications.length === 0 ? (
                  <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8125rem' }}>
                    <CheckCircle2 size={24} style={{ color: '#10b981', margin: '0 auto 8px' }} />
                    <div>All clear! No urgent items pending.</div>
                  </div>
                ) : (
                  notifications.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        if (item.associate_id && onSelectAssociate) {
                          onSelectAssociate(item.associate_id);
                          setShowNotifications(false);
                        }
                      }}
                      style={{
                        padding: '10px 12px',
                        borderRadius: 'var(--radius-md)',
                        background: item.urgency === 'CRITICAL' ? 'var(--color-danger-bg)' : 'var(--bg-elevated)',
                        border: `1px solid ${item.urgency === 'CRITICAL' ? 'var(--color-danger-border)' : 'var(--border-subtle)'}`,
                        cursor: 'pointer',
                        display: 'flex',
                        gap: '10px',
                        transition: 'all 0.15s ease'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--accent-primary)'}
                      onMouseLeave={(e) => e.currentTarget.style.borderColor = item.urgency === 'CRITICAL' ? 'var(--color-danger-border)' : 'var(--border-subtle)'}
                    >
                      <div style={{
                        padding: '5px',
                        borderRadius: '6px',
                        background: item.type === 'AGREEMENT_EXPIRY' ? 'var(--color-warning-bg)' : 'var(--color-danger-bg)',
                        color: item.type === 'AGREEMENT_EXPIRY' ? 'var(--color-warning)' : 'var(--color-danger)',
                        height: 'fit-content'
                      }}>
                        {item.type === 'AGREEMENT_EXPIRY' ? <Clock size={14} /> : <ShieldAlert size={14} />}
                      </div>

                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2px' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.8125rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {item.title}
                          </span>
                          <span className={`badge badge-${item.urgency === 'CRITICAL' ? 'danger' : 'warning'}`} style={{ fontSize: '0.625rem' }}>
                            {item.urgency}
                          </span>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: 1.3 }}>
                          {item.message}
                        </div>
                        <div style={{ fontSize: '0.6875rem', color: 'var(--accent-primary)', marginTop: '4px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <span>Click to open BA 360°</span>
                          <ArrowRight size={11} />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="btn btn-secondary btn-sm"
          title="Refresh Data from REST API"
        >
          <RefreshCw size={13} className={isRefreshing ? 'spinning' : ''} />
          <span>{isRefreshing ? 'Syncing...' : 'Sync'}</span>
        </button>

        <button
          onClick={onOpenDiagnostics}
          className="btn btn-secondary btn-sm"
        >
          <Code size={13} />
          <span>API</span>
        </button>

        <div style={{ height: '20px', width: '1px', background: 'var(--border-medium)' }} />

        {/* User Persona & Role Dropdown */}
        {user && (
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => {
                setShowPersonaMenu(!showPersonaMenu);
                setShowNotifications(false);
              }}
              style={{
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-md)',
                padding: '5px 12px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                cursor: 'pointer',
                color: 'var(--text-primary)',
                transition: 'all 0.15s ease'
              }}
            >
              <div style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: roleStyle.bg,
                border: `1px solid ${roleStyle.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '0.75rem',
                color: roleStyle.color
              }}>
                {user.first_name ? user.first_name[0] : 'U'}
              </div>

              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.2 }}>
                  {user.first_name} {user.last_name}
                </div>
                <div style={{ fontSize: '0.6875rem', color: roleStyle.color, fontWeight: 600 }}>
                  {role}
                </div>
              </div>

              <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
            </button>

            {/* Persona Switcher Dropdown Menu */}
            {showPersonaMenu && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '115%',
                  width: '260px',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-medium)',
                  borderRadius: 'var(--radius-lg)',
                  boxShadow: '0 15px 30px rgba(0,0,0,0.4)',
                  padding: '8px',
                  zIndex: 200
                }}
              >
                <div style={{ padding: '8px 10px', borderBottom: '1px solid var(--border-subtle)', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Logged in as <strong style={{ color: 'var(--text-primary)' }}>{user.email}</strong>
                  <div style={{ fontSize: '0.6875rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                    {user.profile?.title || 'System User'}
                  </div>
                </div>

                <div style={{ padding: '6px 10px 4px', fontSize: '0.6875rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Switch Demo Persona
                </div>

                {demoPersonas.map((persona) => (
                  <button
                    key={persona.roleKey}
                    onClick={() => {
                      loginWithDemo(persona.roleKey);
                      setShowPersonaMenu(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: 'var(--radius-sm)',
                      background: role === persona.roleKey ? 'rgba(99, 102, 241, 0.15)' : 'transparent',
                      border: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                    onMouseEnter={(e) => {
                      if (role !== persona.roleKey) e.currentTarget.style.background = 'var(--bg-card-hover)';
                    }}
                    onMouseLeave={(e) => {
                      if (role !== persona.roleKey) e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {persona.name}
                      </div>
                      <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
                        {persona.title}
                      </div>
                    </div>
                    <span className="badge" style={{ fontSize: '0.625rem', background: `${persona.color}20`, color: persona.color }}>
                      {persona.roleKey}
                    </span>
                  </button>
                ))}

                <div style={{ borderTop: '1px solid var(--border-subtle)', marginTop: '6px', paddingTop: '6px' }}>
                  <button
                    onClick={() => {
                      logout();
                      setShowPersonaMenu(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 10px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--color-danger-bg)',
                      border: '1px solid var(--color-danger-border)',
                      color: 'var(--color-danger)',
                      fontSize: '0.8125rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    <LogOut size={14} />
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      </div>
    </header>
  );
}
