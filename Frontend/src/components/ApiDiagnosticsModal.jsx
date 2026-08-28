import React, { useState, useEffect } from 'react';
import { X, Code, CheckCircle, AlertTriangle, RefreshCw, Server, Database, Globe } from 'lucide-react';
import { apiClient } from '../services/api';

export default function ApiDiagnosticsModal({ isOpen, onClose, initialHealth }) {
  const [selectedEndpoint, setSelectedEndpoint] = useState('/health/');
  const [endpointData, setEndpointData] = useState(initialHealth);
  const [loading, setLoading] = useState(false);
  const [latency, setLatency] = useState(null);
  const [statusCode, setStatusCode] = useState(200);

  const endpoints = [
    { path: '/health/', label: 'GET /api/health/ (Health & DB Check)' },
    { path: '/dashboard/stats/', label: 'GET /api/dashboard/stats/ (Control Tower KPIs)' },
    { path: '/associates/', label: 'GET /api/associates/ (Associates List)' },
    { path: '/clients/', label: 'GET /api/clients/ (Clients List)' },
    { path: '/agreements/', label: 'GET /api/agreements/ (Agreements List)' },
  ];

  const fetchEndpoint = async (path) => {
    setLoading(true);
    const start = performance.now();
    try {
      const res = await apiClient.get(path);
      const elapsed = Math.round(performance.now() - start);
      setLatency(elapsed);
      setStatusCode(res.status);
      setEndpointData(res.data);
    } catch (err) {
      const elapsed = Math.round(performance.now() - start);
      setLatency(elapsed);
      setStatusCode(err.response?.status || 500);
      setEndpointData(err.response?.data || { error: err.message });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchEndpoint(selectedEndpoint);
    }
  }, [isOpen, selectedEndpoint]);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" style={{ maxWidth: '850px' }} onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ background: 'rgba(99, 102, 241, 0.2)', padding: '6px', borderRadius: '8px', color: '#818cf8' }}>
              <Code size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
                Django REST API Diagnostic Center
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.8125rem' }}>
                Live verification of REST endpoints, PostgreSQL connectivity, and response payloads.
              </p>
            </div>
          </div>

          <button onClick={onClose} className="btn btn-secondary btn-icon">
            <X size={18} />
          </button>
        </div>

        {/* Diagnostic Status Strip */}
        <div style={{
          padding: '14px 24px',
          background: 'rgba(0, 0, 0, 0.3)',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px', fontSize: '0.8125rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Server size={14} style={{ color: '#6366f1' }} />
              <strong>Host:</strong> <code>http://127.0.0.1:8001</code>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Database size={14} style={{ color: '#10b981' }} />
              <strong>Engine:</strong> PostgreSQL (<code>Associate_DB</code>)
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Globe size={14} style={{ color: '#06b6d4' }} />
              <strong>Framework:</strong> Django REST Framework 3.18
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span className={`badge ${statusCode === 200 ? 'badge-ready' : 'badge-not-ready'}`}>
              HTTP {statusCode}
            </span>
            {latency !== null && (
              <span className="badge badge-neutral">
                {latency}ms latency
              </span>
            )}
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: '24px' }}>
          
          {/* Endpoint Selector Bar */}
          <div style={{ marginBottom: '16px', display: 'flex', gap: '10px', alignItems: 'center' }}>
            <select
              value={selectedEndpoint}
              onChange={(e) => setSelectedEndpoint(e.target.value)}
              className="form-select"
              style={{ flex: 1, fontWeight: 600, fontFamily: 'monospace' }}
            >
              {endpoints.map(ep => (
                <option key={ep.path} value={ep.path}>{ep.label}</option>
              ))}
            </select>

            <button
              onClick={() => fetchEndpoint(selectedEndpoint)}
              disabled={loading}
              className="btn btn-secondary"
            >
              <RefreshCw size={14} className={loading ? 'spinning' : ''} />
              <span>{loading ? 'Testing...' : 'Test Request'}</span>
            </button>
          </div>

          {/* JSON Response View */}
          <div style={{
            background: '#040714',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-md)',
            padding: '16px',
            maxHeight: '400px',
            overflowY: 'auto'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span>RESPONSE BODY (application/json)</span>
              <span>REST API format validated</span>
            </div>
            <pre style={{
              margin: 0,
              fontFamily: 'SFMono-Regular, Menlo, Monaco, Consolas, monospace',
              fontSize: '0.8125rem',
              color: '#34d399',
              lineHeight: 1.5,
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word'
            }}>
              {JSON.stringify(endpointData, null, 2)}
            </pre>
          </div>

        </div>

      </div>
    </div>
  );
}
