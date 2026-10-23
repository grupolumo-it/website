import { Link, Navigate, useLocation } from "react-router-dom";
import AuthLayout from "@/features/auth/components/AuthLayout.jsx";
import LoginForm from "@/features/auth/components/LoginForm.jsx";
import { useAuth } from "@/features/auth/hooks/useAuth";

export default function LoginPage() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Si venía de una ruta protegida, vuelve allí; si no, al inicio.
  const redirectTo = location.state?.from?.pathname || "/";

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return (
    <AuthLayout
      title="Iniciar sesión"
      subtitle="Ingresa con tu correo y contraseña."
      heroTitle="Qué bueno verte de nuevo."
      heroText="Inicia sesión para continuar con tus compras y revisar tus pedidos."
    >
      <LoginForm />

      <p className="text-center text-sm text-gray-500 pt-6">
        ¿Aún no tienes cuenta?
        <Link
          to="/register"
          className="ml-1 font-semibold text-lumo-navy hover:underline"
        >
          Crear cuenta
        </Link>
      </p>
    </AuthLayout>
  );
}
