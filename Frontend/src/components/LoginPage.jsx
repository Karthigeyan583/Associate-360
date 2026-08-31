import React, { useState } from 'react';
import { Layers, Lock, Mail, ArrowRight, Shield, UserCheck, AlertCircle, Eye, EyeOff, Sparkles, CheckCircle2, Moon, Sun } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import InteractiveMascot from './InteractiveMascot';

export default function LoginPage() {
  const { login, loginWithDemo, loading, demoPersonas } = useAuth();
  const { theme, setTheme } = useTheme();
  const [identifier, setIdentifier] = useState('admin@associate360.io');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [activeDemo, setActiveDemo] = useState(null);
  const [isEmailFocused, setIsEmailFocused] = useState(false);
  const [isPasswordFocused, setIsPasswordFocused] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const res = await login(identifier, password);
    if (!res.success) {
      setError(res.error);
    }
  };

  const handleDemoClick = async (persona) => {
    setError(null);
    setActiveDemo(persona.roleKey);
    setIdentifier(persona.email);
    setPassword(persona.password);
    const res = await loginWithDemo(persona.roleKey);
    if (!res.success) {
      setError(res.error);
    }
    setActiveDemo(null);
  };


  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px',
      background: 'var(--bg-main)',
      position: 'relative'
    }}>
      {/* Top Floating Theme Switcher */}
      <div style={{ position: 'absolute', top: '24px', right: '32px' }}>
        <div className="theme-switcher-pill">
          <button
            onClick={() => setTheme('dark')}
            className={`theme-switcher-btn ${theme === 'dark' ? 'active' : ''}`}
            title="Dark Mode (Toned-down smoky black)"
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
      </div>


      <div style={{ width: '100%', maxWidth: '1020px', display: 'grid', gridTemplateColumns: '1fr 1.15fr', gap: '32px', alignItems: 'center' }}>
        
        {/* Left Side: Product Intro & Capabilities */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '46px',
              height: '46px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #6366f1 0%, #06b6d4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              boxShadow: '0 6px 20px rgba(99, 102, 241, 0.45)'
            }}>
              <Layers size={26} />
            </div>
            <div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                Associate <span style={{ color: 'var(--accent-primary)' }}>360°</span>
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>
                BA Control Tower Platform
              </div>
            </div>
          </div>

          <div>
            <h1 style={{ fontSize: '2.1rem', fontWeight: 800, lineHeight: 1.2, color: 'var(--text-primary)', marginBottom: '12px' }}>
              Operational control system for consulting & staffing.
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>
              Centralized visibility into consultant placements, sequential agreement extensions, Dutch labour compliance (VOG/BGC/SNA), and commercial margin analytics.
            </p>
          </div>

          {/* Value Badges */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
              <CheckCircle2 size={18} style={{ color: 'var(--color-success)', flexShrink: 0 }} />
              <span>Preserves agreement history without data loss</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
              <CheckCircle2 size={18} style={{ color: 'var(--color-info)', flexShrink: 0 }} />
              <span>Real-time commercial margin and rate spread calculations</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.875rem', color: 'var(--text-secondary)', fontWeight: 500 }}>
              <CheckCircle2 size={18} style={{ color: 'var(--accent-primary)', flexShrink: 0 }} />
              <span>Role-based access control with enterprise JWT tokens</span>
            </div>
          </div>

          <div style={{
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border-subtle)',
            borderRadius: 'var(--radius-md)',
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div className="pulse-dot online" />
            <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>
              Backend REST API active on <strong style={{ color: 'var(--text-primary)' }}>PostgreSQL (Associate_DB)</strong>
            </span>
          </div>

        </div>

        {/* Right Side: Login Card with 1-Click Persona Logins */}
        <div className="glass-card" style={{ padding: '28px 36px 32px', border: '1px solid var(--border-medium)', boxShadow: 'var(--shadow-lg)' }}>
          
          {/* Animated Mascot Character */}
          <InteractiveMascot
            isEmailFocused={isEmailFocused}
            isPasswordFocused={isPasswordFocused}
            showPassword={showPassword}
            isLoading={loading}
            isError={error !== null}
            activePersona={activeDemo}
            emailLength={identifier.length}
          />

          <div style={{ marginBottom: '20px', textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '4px' }}>
              Sign In to Control Tower
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>
              Enter your credentials or choose a 1-click demo persona below.
            </p>
          </div>

          {error && (
            <div style={{
              background: 'var(--color-danger-bg)',
              border: '1px solid var(--color-danger-border)',
              color: 'var(--color-danger)',
              padding: '12px 14px',
              borderRadius: '8px',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '0.8125rem'
            }}>
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Email or Username</label>
              <div style={{ position: 'relative' }}>
                <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  onFocus={() => setIsEmailFocused(true)}
                  onBlur={() => setIsEmailFocused(false)}
                  placeholder="name@associate360.io"
                  className="form-input"
                  style={{ paddingLeft: '38px' }}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onFocus={() => setIsPasswordFocused(true)}
                  onBlur={() => setIsPasswordFocused(false)}
                  placeholder="••••••••"
                  className="form-input"
                  style={{ paddingLeft: '38px', paddingRight: '38px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ padding: '12px', fontSize: '0.95rem', marginTop: '6px' }}
            >
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
              <ArrowRight size={16} />
            </button>
          </form>


          {/* Divider */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '24px 0 16px' }}>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>
              Or 1-Click Demo Persona Login
            </span>
            <div style={{ flex: 1, height: '1px', background: 'var(--border-subtle)' }} />
          </div>

          {/* Quick Demo Personas Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
            {demoPersonas.map((persona) => (
              <button
                key={persona.roleKey}
                type="button"
                onClick={() => handleDemoClick(persona)}
                disabled={loading}
                style={{
                  background: 'var(--bg-elevated)',
                  border: `1px solid ${persona.roleKey === 'ADMIN' ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                  borderRadius: 'var(--radius-md)',
                  padding: '10px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all var(--transition-fast)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'var(--bg-elevated)'}
              >
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.8125rem', color: 'var(--text-primary)' }}>
                    {persona.name}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                    {persona.title}
                  </div>
                </div>
                <span className="badge" style={{ fontSize: '0.65rem', background: `${persona.color}20`, color: persona.color, border: `1px solid ${persona.color}40` }}>
                  {persona.badge}
                </span>
              </button>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
}
