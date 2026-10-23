import { useEffect, useMemo, useState } from "react";
import { AuthContext } from "@/features/auth/context/AuthContext";
import {
  getCurrentSession,
  loginUser,
  logoutUser,
  onAuthChange,
} from "@/features/auth/authService";

/**
 * Mantiene la sesión de Supabase disponible en toda la app.
 * Se coloca una sola vez, en app/App.jsx.
 */
export default function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    // 1) Sesión guardada del navegador (al recargar la página)
    getCurrentSession()
      .then((current) => {
        if (!cancelled) setSession(current);
      })
      .catch((error) => console.error("Error obteniendo la sesión:", error))
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    // 2) Cambios posteriores (login, logout, renovación del token)
    const unsubscribe = onAuthChange((newSession) => {
      setSession(newSession);
      setLoading(false);
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      isAuthenticated: Boolean(session),
      loading,
      login: loginUser,
      logout: logoutUser,
    }),
    [session, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
