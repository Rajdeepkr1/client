import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import * as authApi from '../api/auth';
import { getToken, setToken as persistToken } from '../api/client';
import type { AuthUser } from '../types';

const USER_KEY = 'mern_notes_user';

interface AuthContextValue {
  user: AuthUser | null;
  isLoggedIn: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function readStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(readStoredUser());
  const [tokenPresent, setTokenPresent] = useState<boolean>(!!getToken());

  const persistSession = useCallback((token: string, nextUser: AuthUser) => {
    persistToken(token);
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    setUser(nextUser);
    setTokenPresent(true);
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const res = await authApi.login(email, password);
      persistSession(res.token, res.user);
    },
    [persistSession]
  );

  const register = useCallback(
    async (name: string, email: string, password: string) => {
      const res = await authApi.register(name, email, password);
      persistSession(res.token, res.user);
    },
    [persistSession]
  );

  const logout = useCallback(() => {
    persistToken(null);
    localStorage.removeItem(USER_KEY);
    setUser(null);
    setTokenPresent(false);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, isLoggedIn: tokenPresent, login, register, logout }),
    [user, tokenPresent, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
