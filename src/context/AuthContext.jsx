import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from '../lib/supabase';

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

const normalizeSupabaseUser = (supabaseUser) => {
  if (!supabaseUser) return null;

  const meta = supabaseUser.user_metadata || {};
  const emailPrefix = (supabaseUser.email || '').split('@')[0];
  const name = meta.name || meta.full_name || emailPrefix || 'Researcher';
  const role = meta.role || 'contributor';

  return {
    id: supabaseUser.id,
    email: supabaseUser.email,
    username: meta.username || emailPrefix,
    name,
    full_name: name,
    role: toUiRole(role),
    firstName: name.split(' ')[0] || 'Researcher',
    avatarUrl: meta.avatar_url || null,
  };
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
    setAuthLoading(true);
    try {
      const { data, error } = await supabase.auth.getSession();
      if (error) throw error;

      const normalized = normalizeSupabaseUser(data?.session?.user);
      if (!normalized) {
        setUser(null);
        setUserRole('solver');
        setSession(null);
        setIsAuthenticated(false);
        return null;
      }

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

    const { data } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      const normalized = normalizeSupabaseUser(nextSession?.user);

      if (!normalized) {
        setUser(null);
        setUserRole('solver');
        setSession(null);
        setIsAuthenticated(false);
        setAuthLoading(false);
        return;
      }

      setUser(normalized);
      setUserRole(normalized.role || 'solver');
      setSession({ user: normalized });
      setIsAuthenticated(true);
      setAuthLoading(false);
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, [loadCurrentUser]);

  const login = useCallback(async (email, password) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      const normalized = normalizeSupabaseUser(data?.user || data?.session?.user);
      if (!normalized) throw new Error('Login failed. Please try again.');

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
  }, []);

  const register = useCallback(async ({ name, email, password, role }) => {
    setAuthLoading(true);
    setAuthError(null);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            full_name: name,
            role: toApiRole(role),
          },
        },
      });
      if (error) throw error;
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
      await supabase.auth.signOut();
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
