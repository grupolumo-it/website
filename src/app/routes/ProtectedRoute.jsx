import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";

/**
 * Envuelve un grupo de rutas privadas.
 * - Sin sesión: redirige a /login y recuerda a dónde quería ir.
 * - Con sesión pero sin el rol necesario: redirige al inicio.
 *
 * <Route element={<ProtectedRoute />}>                              cualquier usuario con sesión
 * <Route element={<ProtectedRoute allowedRoles={[ROLES.ADMIN]} />}> solo administradores
 *
 * Importante: esto solo controla qué pantallas se muestran. La seguridad real
 * de los datos la dan las políticas RLS de Supabase.
 */
export default function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, role, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <section className="max-w-6xl mx-auto px-6 py-16">
        <p className="text-gray-500">Cargando...</p>
      </section>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}
