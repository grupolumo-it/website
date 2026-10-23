import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";

/**
 * Envuelve un grupo de rutas que requieren sesión iniciada.
 * Sin sesión, redirige a /login y recuerda a dónde quería ir.
 *
 * <Route element={<ProtectedRoute />}> ...rutas privadas... </Route>
 */
export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();
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

  return <Outlet />;
}
