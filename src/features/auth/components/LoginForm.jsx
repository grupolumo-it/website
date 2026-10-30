import { useState } from "react";
import FormField from "@/shared/components/FormField.jsx";
import PasswordField from "@/features/auth/components/PasswordField.jsx";
import { useAuth } from "@/features/auth/hooks/useAuth";

function translateError(error) {
  const message = error?.message || "";

  if (message.includes("Invalid login credentials")) {
    return "Correo o contraseña incorrectos.";
  }

  if (message.includes("Email not confirmed")) {
    return "Debes confirmar tu correo antes de iniciar sesión.";
  }

  return "No fue posible iniciar sesión. Inténtalo de nuevo.";
}

/**
 * Formulario de login. No navega por sí mismo: al iniciar sesión,
 * LoginPage detecta el cambio de sesión y redirige.
 */
export default function LoginForm() {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleLogin(event) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      await login(email, password);
    } catch (err) {
      console.error("ERROR LOGIN:", err);
      setError(translateError(err));
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleLogin} className="space-y-5">

      <FormField
        id="email"
        label="Correo electrónico"
        type="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
        placeholder="correo@ejemplo.com"
      />

      <PasswordField
        id="password"
        label="Contraseña"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder="Tu contraseña"
      />

      {error && (
        <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 rounded-xl bg-lumo-navy hover:bg-lumo-blue text-white font-semibold transition disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {loading ? "Ingresando..." : "Iniciar sesión"}
      </button>

    </form>
  );
}
