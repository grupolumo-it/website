import { useState } from "react";
import FormField from "@/shared/components/FormField.jsx";
import PasswordField from "@/features/auth/components/PasswordField.jsx";
import PasswordRequirement from "@/features/auth/components/PasswordRequirement.jsx";
import { registerUser } from "@/features/auth/authService";
import { validatePassword } from "@/features/auth/passwordRules";

const INITIAL_FORM = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

export default function RegisterForm() {
  const [form, setForm] = useState(INITIAL_FORM);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const { hasMinLength, hasLetter, hasNumber, isValid } = validatePassword(
    form.password
  );

  const passwordsMatch =
    form.password.length > 0 && form.password === form.confirmPassword;

  // Devuelve el onChange de un campo: update("email") -> (event) => ...
  const update = (field) => (event) =>
    setForm((current) => ({ ...current, [field]: event.target.value }));

  async function handleRegister(event) {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    if (!isValid) {
      setError(
        "La contraseña debe tener mínimo 8 caracteres, una letra y un número."
      );
      setLoading(false);
      return;
    }

    if (!passwordsMatch) {
      setError("Las contraseñas no coinciden.");
      setLoading(false);
      return;
    }

    try {
      await registerUser(
        form.email,
        form.password,
        form.firstName,
        form.lastName
      );

      setMessage(
        "Cuenta creada correctamente. Revisa tu correo para confirmar tu cuenta."
      );
      setForm(INITIAL_FORM);
    } catch (err) {
      console.error("ERROR REGISTRO:", err);
      setError(err.message || "No fue posible crear la cuenta.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleRegister} className="space-y-5">

      {/* NOMBRE + APELLIDO */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <FormField
          id="firstName"
          label="Nombre"
          value={form.firstName}
          onChange={update("firstName")}
          required
          placeholder="Tu nombre"
        />

        <FormField
          id="lastName"
          label="Apellido"
          value={form.lastName}
          onChange={update("lastName")}
          required
          placeholder="Tu apellido"
        />
      </div>

      {/* EMAIL */}
      <FormField
        id="email"
        label="Correo electrónico"
        type="email"
        value={form.email}
        onChange={update("email")}
        required
        placeholder="correo@ejemplo.com"
      />

      {/* CONTRASEÑA */}
      <PasswordField
        id="password"
        label="Contraseña"
        value={form.password}
        onChange={update("password")}
        placeholder="Mínimo 8 caracteres"
      >
        <div className="mt-3 space-y-1.5">
          <PasswordRequirement valid={hasMinLength} text="Mínimo 8 caracteres" />
          <PasswordRequirement valid={hasLetter} text="Al menos una letra" />
          <PasswordRequirement valid={hasNumber} text="Al menos un número" />
        </div>
      </PasswordField>

      {/* CONFIRMAR CONTRASEÑA */}
      <PasswordField
        id="confirmPassword"
        label="Confirmar contraseña"
        value={form.confirmPassword}
        onChange={update("confirmPassword")}
        placeholder="Repite tu contraseña"
      >
        {form.confirmPassword.length > 0 && (
          <div className="mt-2">
            <PasswordRequirement
              valid={passwordsMatch}
              text={
                passwordsMatch
                  ? "Las contraseñas coinciden"
                  : "Las contraseñas no coinciden"
              }
            />
          </div>
        )}
      </PasswordField>

      {/* ERROR */}
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3">
          <p className="text-sm text-red-600">{error}</p>
        </div>
      )}

      {/* ÉXITO */}
      {message && (
        <div className="rounded-xl bg-green-50 border border-green-100 px-4 py-3">
          <p className="text-sm text-green-600">{message}</p>
        </div>
      )}

      {/* BOTÓN */}
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 rounded-xl bg-lumo-navy hover:bg-lumo-navy-light text-white font-semibold transition disabled:bg-gray-300 disabled:cursor-not-allowed"
      >
        {loading ? "Creando cuenta..." : "Crear cuenta"}
      </button>

    </form>
  );
}
