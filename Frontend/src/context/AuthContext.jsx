import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiService } from '../services/api';

export const DEMO_PERSONAS = [
  {
    roleKey: 'ADMIN',
    name: 'Alex Vanderbilt',
    email: 'admin@associate360.io',
    password: 'admin123',
    title: 'System Administrator',
    badge: 'Full Control',
    color: '#6366f1'
  },
  {
    roleKey: 'OPERATIONS',
    name: 'Karthik S.',
    email: 'operations@associate360.io',
    password: 'ops123',
    title: 'Operations Controller',
    badge: 'Control Tower',
    color: '#06b6d4'
  },
  {
    roleKey: 'COMPLIANCE',
    name: 'Claire Visser',
    email: 'compliance@associate360.io',
    password: 'comp123',
    title: 'Compliance Officer',
    badge: 'VOG & Legal',
    color: '#10b981'
  },
  {
    roleKey: 'FINANCE',
    name: 'Felix van Dijk',
    email: 'finance@associate360.io',
    password: 'fin123',
    title: 'Finance & Rates Lead',
    badge: 'Commercials',
    color: '#f59e0b'
  },
  {
    roleKey: 'MANAGEMENT',
    name: 'Maya de Boer',
    email: 'management@associate360.io',
    password: 'manage123',
    title: 'Managing Director',
    badge: 'Executive',
    color: '#ec4899'
  }
];

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('assoc_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('assoc_access_token'));
  const [loading, setLoading] = useState(false);

  // Authenticate user & store JWT tokens
  const login = async (identifier, password) => {
    setLoading(true);
    try {
      const data = await apiService.login(identifier, password);
      localStorage.setItem('assoc_access_token', data.access);
      localStorage.setItem('assoc_refresh_token', data.refresh);
      localStorage.setItem('assoc_user', JSON.stringify(data.user));
      setToken(data.access);
      setUser(data.user);
      return { success: true, user: data.user };
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Login failed. Please check credentials.';
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  };

  const loginWithDemo = async (roleKey) => {
    const persona = DEMO_PERSONAS.find(p => p.roleKey === roleKey);
    if (persona) {
      return await login(persona.email, persona.password);
    }
  };

  const logout = () => {
    localStorage.removeItem('assoc_access_token');
    localStorage.removeItem('assoc_refresh_token');
    localStorage.removeItem('assoc_user');
    setToken(null);
    setUser(null);
  };

  const value = {
    user,
    token,
    role: user?.role || 'OPERATIONS',
    isAuthenticated: !!token && !!user,
    loading,
    login,
    loginWithDemo,
    logout,
    demoPersonas: DEMO_PERSONAS
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
