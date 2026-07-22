import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router";
import { getSession, clearSession, setToken, cloudLogout, cloudRefreshToken } from "@/lib/cloudStore";

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
  type: "local";
}

export function useAuth(options?: { redirectOnUnauthenticated?: boolean; redirectPath?: string }) {
  const navigate = useNavigate();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>();
  const hasRedirected = useRef(false);

  const shouldRedirect = options?.redirectOnUnauthenticated ?? false;
  const redirectPath = options?.redirectPath ?? "/login";

  const checkSession = useCallback(() => {
    const session = getSession();
    if (session) {
      setUser({
        id: session.userId,
        name: session.name,
        email: session.email,
        role: session.role,
        type: "local",
      });
    } else {
      setUser(null);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    checkSession();
    return () => { if (timeoutRef.current) clearTimeout(timeoutRef.current); };
  }, [checkSession]);

  useEffect(() => {
    if (shouldRedirect && !isLoading && !user && !hasRedirected.current) {
      hasRedirected.current = true;
      navigate(redirectPath, { replace: true });
    }
  }, [shouldRedirect, isLoading, user, redirectPath, navigate]);

  const logout = useCallback(async () => {
    await cloudLogout().catch(() => {});
    clearSession();
    setUser(null);
    hasRedirected.current = false;
    navigate("/login", { replace: true });
  }, [navigate]);

  useEffect(() => {
    const i = setInterval(() => {
      if (getSession()) {
        cloudRefreshToken().then((r: any) => {
          if (r.success && r.token) setToken(r.token);
        }).catch(() => {});
      }
    }, 600000);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    const interval = setInterval(checkSession, 5000);
    return () => clearInterval(interval);
  }, [checkSession]);

  return { user, isLoading, logout, isAdmin: user?.role === "admin" || user?.role === "superadmin" };
}
