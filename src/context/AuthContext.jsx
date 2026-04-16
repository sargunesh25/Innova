import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../lib/api';

const AuthContext = createContext();

const toUiRole = (role) => {
  if (role === 'poster') return 'company';
  if (role === 'contributor') return 'solver';
  return role || 'solver';
};

const toApiRole = (role) => {
  if (role === 'company') return 'poster';
  if (role === 'solver') return 'contributor';
  return role || 'contributor';
};

const normalizeUser = (user) => {
  if (!user) return null;
  const name = user.name || user.full_name || user.username || '';
  return {
    ...user,
    name,
    firstName: name.split(' ')[0] || 'Researcher',
    role: toUiRole(user.role),
    avatarUrl: user.avatarUrl || user.avatar_url || user.avatar,
  };
};

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState('solver');
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  const loadCurrentUser = useCallback(async () => {
    try {
      const me = await api.get('/api/users/me');
      const normalized = normalizeUser(me);
      setUser(normalized);
      setUserRole(normalized?.role || 'solver');
      setSession({ user: normalized });
      setIsAuthenticated(true);
      return normalized;
    } catch (error) {
      if (error.status !== 401) {
        setAuthError(error.message);
      }
      setUser(null);
      setUserRole('solver');
      setSession(null);
      setIsAuthenticated(false);
      return null;
    } finally {
      setAuthLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCurrentUser();
  }, [loadCurrentUser]);

  const login = useCallback(async (email, password) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const response = await api.post('/api/auth/login', { email, password });
      const normalized = normalizeUser(response?.user || await loadCurrentUser());
      setUser(normalized);
      setUserRole(normalized?.role || 'solver');
      setSession({ user: normalized });
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      setAuthError(error.message);
      setIsAuthenticated(false);
      return { success: false, error: error.message };
    } finally {
      setAuthLoading(false);
    }
  }, [loadCurrentUser]);

  const register = useCallback(async ({ name, email, password, role }) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      await api.post('/api/auth/register', {
        name,
        email,
        password,
        role: toApiRole(role),
      });
      return { success: true };
    } catch (error) {
      setAuthError(error.message);
      return { success: false, error: error.message };
    } finally {
      setAuthLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post('/api/auth/logout', {});
    } finally {
      setUser(null);
      setUserRole('solver');
      setSession(null);
      setIsAuthenticated(false);
    }
  }, []);

  const updateUser = useCallback((updates) => {
    setUser((prev) => normalizeUser({ ...prev, ...updates }));
  }, []);

  const value = useMemo(() => ({
    isAuthenticated,
    userRole,
    user,
    session,
    authLoading,
    authError,
    login,
    register,
    logout,
    updateUser,
  }), [isAuthenticated, userRole, user, session, authLoading, authError, login, register, logout, updateUser]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
