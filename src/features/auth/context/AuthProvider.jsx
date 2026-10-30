import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "@/features/auth/context/AuthContext";
import {
  getCurrentSession,
  getCurrentUserRole,
  loginUser,
  logoutUser,
  onAuthChange,
} from "@/features/auth/authService";

/**
 * Mantiene la sesión de Supabase y el rol del usuario disponibles en toda la app.
 * Se coloca una sola vez, en app/App.jsx.
 */
export default function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [sessionLoading, setSessionLoading] = useState(true);
  // Guardamos a qué usuario pertenece el rol, para saber cuándo hay que recargarlo
  const [roleState, setRoleState] = useState({ userId: null, role: null });

  const userId = session?.user?.id ?? null;

  useEffect(() => {
    let cancelled = false;

    // 1) Sesión guardada del navegador (al recargar la página)
    getCurrentSession()
      .then((current) => {
        if (!cancelled) setSession(current);
      })
      .catch((error) => console.error("Error obteniendo la sesión:", error))
      .finally(() => {
        if (!cancelled) setSessionLoading(false);
      });

    // 2) Cambios posteriores (login, logout, renovación del token)
    const unsubscribe = onAuthChange((newSession) => {
      setSession(newSession);
      setSessionLoading(false);
    });

    return () => {
      cancelled = true;
      unsubscribe();
    };
  }, []);

  // Rol del usuario: se consulta cuando cambia el usuario (no en cada renovación del token)
  useEffect(() => {
    if (!userId) return;

    let cancelled = false;

    getCurrentUserRole()
      .then((role) => {
        if (!cancelled) setRoleState({ userId, role });
      })
      .catch((error) => {
        console.error("Error obteniendo el rol:", error);
        if (!cancelled) setRoleState({ userId, role: null });
      });

    return () => {
      cancelled = true;
    };
  }, [userId]);

  // Vuelve a consultar el rol (por ejemplo, justo después de que aprueban una tienda)
  const refreshRole = useCallback(async () => {
    if (!userId) return;

    try {
      const role = await getCurrentUserRole();
      setRoleState({ userId, role });
    } catch (error) {
      console.error("Error actualizando el rol:", error);
    }
  }, [userId]);

  const roleLoading = Boolean(userId) && roleState.userId !== userId;
  const role = userId && roleState.userId === userId ? roleState.role : null;
  const loading = sessionLoading || roleLoading;

  const value = useMemo(
    () => ({
      session,
      user: session?.user ?? null,
      role,
      refreshRole,
      isAuthenticated: Boolean(session),
      loading,
      login: loginUser,
      logout: logoutUser,
    }),
    [session, role, refreshRole, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
