import { useContext } from "react";
import { AuthContext } from "@/features/auth/context/AuthContext";

/**
 * Acceso a la sesión desde cualquier componente:
 * const { user, isAuthenticated, loading, login, logout } = useAuth();
 */
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  }

  return context;
}
