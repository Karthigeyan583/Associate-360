import React from 'react';
import { LayoutDashboard, Users, ShieldCheck, Building2, BarChart3, Activity, Layers, Terminal, Landmark } from 'lucide-react';

export default function Sidebar({ activeTab, setActiveTab, onOpenToolkit }) {

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Control Tower',
      icon: LayoutDashboard
    },
    {
      id: 'associates',
      label: 'Associate 360°',
      icon: Users
    },
    {
      id: 'reports',
      label: 'Reports & Analytics',
      icon: BarChart3
    },
    {
      id: 'compliance',
      label: 'Compliance Hub',
      icon: ShieldCheck
    },
    {
      id: 'clients',
      label: 'Clients & Accounts',
      icon: Building2
    },
    {
      id: 'toolkit',
      label: 'NL Ops Toolkit',
      icon: Landmark
    },
    {
      id: 'activity',
      label: 'Audit & Activity',
      icon: Activity
    }
  ];


  return (
    <aside style={{
      width: '256px',
      background: 'var(--bg-secondary)',
      borderRight: '1px solid var(--border-subtle)',
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      position: 'sticky',
      top: 0,
      flexShrink: 0,
      zIndex: 50
    }}>
      {/* Brand Header (60px matching sticky status header) */}
      <div style={{
        height: '60px',
        minHeight: '60px',
        maxHeight: '60px',
        boxSizing: 'border-box',
        padding: '0 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        borderBottom: '1px solid var(--border-subtle)'
      }}>

        <div style={{
          width: '36px',
          height: '36px',
          borderRadius: '9px',
          background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ffffff',
          boxShadow: '0 2px 8px rgba(79, 70, 229, 0.25)',
          flexShrink: 0
        }}>
          <Layers size={20} strokeWidth={2} />
        </div>

        <div style={{ minWidth: 0 }}>
          <div style={{
            fontWeight: 800,
            fontSize: '1rem',
            color: 'var(--text-primary)',
            letterSpacing: '-0.02em',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            lineHeight: 1.2
          }}>
            <span>Associate</span>
            <span style={{ color: 'var(--accent-primary)' }}>360°</span>
          </div>
          <div style={{
            fontSize: '0.6875rem',
            color: 'var(--text-muted)',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            fontWeight: 600,
            marginTop: '2px'
          }}>
            BA Control Tower
          </div>
        </div>
      </div>

      {/* Navigation List */}
      <nav style={{ padding: '16px 12px', flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div style={{
          fontSize: '0.6875rem',
          fontWeight: 700,
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          padding: '6px 12px 6px'
        }}>
          Navigation
        </div>

        {menuItems.map(item => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              style={{
                width: '100%',
                height: '42px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                padding: '0 14px',
                borderRadius: 'var(--radius-md)',
                background: isActive ? 'var(--accent-primary-light)' : 'transparent',
                border: isActive ? '1px solid rgba(79, 70, 229, 0.25)' : '1px solid transparent',
                color: isActive ? 'var(--accent-primary)' : 'var(--text-secondary)',
                fontWeight: isActive ? 600 : 500,
                fontSize: '0.86rem',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'background-color 0.15s ease, color 0.15s ease'
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'var(--bg-card-hover)';
                  e.currentTarget.style.color = 'var(--text-primary)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = 'var(--text-secondary)';
                }
              }}
            >
              <Icon
                size={18}
                strokeWidth={isActive ? 2.2 : 1.75}
                style={{ color: isActive ? 'var(--accent-primary)' : 'inherit', flexShrink: 0 }}
              />
              <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Footer Info */}
      <div style={{
        padding: '14px 16px',
        borderTop: '1px solid var(--border-subtle)',
        background: 'var(--bg-card)'
      }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
          <Terminal size={14} style={{ color: 'var(--color-info)' }} />
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>System Active</span>
        </div>
        <div style={{ fontSize: '0.6875rem', color: 'var(--text-muted)' }}>
          PostgreSQL • Django REST API
        </div>
      </div>
    </aside>
  );
}

