"use client";

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  useCallback,
} from "react";
import {
  apiMe,
  apiLogin,
  apiRegister,
  apiLogout,
  apiGoogleAuth,
  apiAppleAuth,
  getAccessToken,
  clearAccessToken,
  setAccessToken,
  type AuthUser,
} from "@/lib/auth-client";

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  openAuth: (tab?: "login" | "register") => void;
  closeAuth: () => void;
  authOpen: boolean;
  authTab: "login" | "register";
  login: (email: string, password: string) => Promise<void>;
  register: (
    firstName: string,
    lastName: string,
    email: string,
    password: string,
  ) => Promise<void>;
  loginWithGoogle: (credential: string) => Promise<void>;
  loginWithApple: (
    idToken: string,
    firstName?: string,
    lastName?: string,
  ) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [authOpen, setAuthOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"login" | "register">("login");

  useEffect(() => {
    const handler = () => setUser(null);
    window.addEventListener("auth:session-expired", handler);
    return () => window.removeEventListener("auth:session-expired", handler);
  }, []);

  useEffect(() => {
    let cancelled = false;
    async function init() {
      try {
        const token = getAccessToken();
        if (!token) {
          setUser(null);
          return;
        }
        const me = await apiMe();
        if (!cancelled) setUser(me);
      } catch {
        clearAccessToken();
        if (!cancelled) setUser(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    init();
    return () => {
      cancelled = true;
    };
  }, []);

  const openAuth = useCallback((tab: "login" | "register" = "login") => {
    setAuthTab(tab);
    setAuthOpen(true);
  }, []);

  const closeAuth = useCallback(() => setAuthOpen(false), []);

  const login = useCallback(async (email: string, password: string) => {
    const data = await apiLogin(email, password);
    setAccessToken(data.accessToken);
    setUser(data.user);
    setAuthOpen(false);
  }, []);

  const register = useCallback(
    async (
      firstName: string,
      lastName: string,
      email: string,
      password: string,
    ) => {
      // After register, user must verify email — do NOT log them in or close modal.
      // The modal handles showing the verification pending state.
      await apiRegister(firstName, lastName, email, password);
    },
    [],
  );

  const loginWithGoogle = useCallback(async (credential: string) => {
    const data = await apiGoogleAuth(credential);
    setAccessToken(data.accessToken);
    setUser(data.user);
    setAuthOpen(false);
  }, []);

  const loginWithApple = useCallback(
    async (idToken: string, firstName?: string, lastName?: string) => {
      const data = await apiAppleAuth(idToken, firstName, lastName);
      setAccessToken(data.accessToken);
      setUser(data.user);
      setAuthOpen(false);
    },
    [],
  );

  const logout = useCallback(async () => {
    await apiLogout();
    setUser(null);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const me = await apiMe();
      setUser(me);
    } catch {
      setUser(null);
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      loading,
      openAuth,
      closeAuth,
      authOpen,
      authTab,
      login,
      register,
      loginWithGoogle,
      loginWithApple,
      logout,
      refreshUser,
    }),
    [
      user,
      loading,
      authOpen,
      authTab,
      openAuth,
      closeAuth,
      login,
      register,
      loginWithGoogle,
      loginWithApple,
      logout,
      refreshUser,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
