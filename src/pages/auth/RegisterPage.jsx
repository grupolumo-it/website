import { Link } from "react-router-dom";
import AuthLayout from "@/features/auth/components/AuthLayout.jsx";
import RegisterForm from "@/features/auth/components/RegisterForm.jsx";

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Crear cuenta"
      subtitle="Completa tus datos para comenzar."
      heroTitle="Crea tu cuenta y comienza tu experiencia con Lumo."
      heroText="Compra, descubre y disfruta de nuestros productos de una forma sencilla y segura."
    >
      <RegisterForm />

      <p className="text-center text-sm text-gray-500 pt-6">
        ¿Ya tienes una cuenta?
        <Link
          to="/login"
          className="ml-1 font-semibold text-lumo-navy hover:underline"
        >
          Iniciar sesión
        </Link>
      </p>
    </AuthLayout>
  );
}
