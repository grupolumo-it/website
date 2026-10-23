import { useState } from "react";
import { Eye, EyeOff, Check, X } from "lucide-react";
import { Link } from "react-router-dom";
import { registerUser } from "../../services/authService";

export default function Register() {

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ============================================
  // VALIDACIONES DE CONTRASEÑA
  // ============================================

  const hasMinLength = password.length >= 8;
  const hasLetter = /[A-Za-z]/.test(password);
  const hasNumber = /\d/.test(password);

  const isPasswordValid =
    hasMinLength &&
    hasLetter &&
    hasNumber;

  const passwordsMatch =
    password.length > 0 &&
    password === confirmPassword;

  // ============================================
  // REGISTRO
  // ============================================

  async function handleRegister(event) {

    event.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    // Validar contraseña

    if (!isPasswordValid) {

      setError(
        "La contraseña debe tener mínimo 8 caracteres, una letra y un número."
      );

      setLoading(false);
      return;
    }

    // Validar confirmación

    if (!passwordsMatch) {

      setError("Las contraseñas no coinciden.");

      setLoading(false);
      return;
    }

    try {

      const data = await registerUser(
        email,
        password,
        firstName,
        lastName
      );

      console.log("REGISTRO:", data);

      setMessage(
        "Cuenta creada correctamente. Revisa tu correo para confirmar tu cuenta."
      );

      // Limpiar formulario

      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

    } catch (error) {

      console.error("ERROR REGISTRO:", error);

      setError(
        error.message || "No fue posible crear la cuenta."
      );

    } finally {

      setLoading(false);

    }
  }

  return (

    <main className="min-h-screen grid lg:grid-cols-2">

      {/* =========================================
          IMAGEN LATERAL
      ========================================= */}

      <section
        className="
          hidden
          lg:flex
          relative
          min-h-screen
          bg-cover
          bg-center
        "
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1600')"
        }}
      >

        {/* Overlay */}

        <div className="absolute inset-0 bg-[#1D2559]/60" />

        {/* Contenido sobre la imagen */}

        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">

          {/* LOGO */}

          <div>

            <Link
              to="/"
              className="inline-block"
            >

              <h1 className="text-4xl font-bold hover:opacity-80 transition">
                Lumo
              </h1>

            </Link>

            <p className="mt-2 text-white/80">
              Todo lo que necesitas, en un solo lugar.
            </p>

          </div>


          {/* TEXTO CENTRAL */}

          <div className="max-w-md">

            <h2 className="text-4xl font-bold leading-tight">
              Crea tu cuenta y comienza tu experiencia con Lumo.
            </h2>

            <p className="mt-4 text-white/80 text-lg">
              Compra, descubre y disfruta de nuestros productos
              de una forma sencilla y segura.
            </p>

          </div>


          {/* FOOTER */}

          <p className="text-sm text-white/60">
            © {new Date().getFullYear()} Lumo
          </p>

        </div>

      </section>


      {/* =========================================
          FORMULARIO
      ========================================= */}

      <section className="min-h-screen flex items-center justify-center px-6 py-12 bg-gray-50">

        <div className="w-full max-w-lg">


          {/* =====================================
              VOLVER AL INICIO
          ===================================== */}

          <Link
            to="/"
            className="
              inline-flex
              items-center
              gap-2
              text-sm
              text-gray-500
              hover:text-[#1D2559]
              transition
              mb-8
            "
          >

            <span className="text-lg">
              ←
            </span>

            Volver al inicio

          </Link>


          {/* ENCABEZADO */}

          <div className="mb-8">

            <h1 className="text-3xl font-bold text-[#1D2559]">
              Crear cuenta
            </h1>

            <p className="text-gray-500 mt-2">
              Completa tus datos para comenzar.
            </p>

          </div>


          {/* FORM */}

          <form
            onSubmit={handleRegister}
            className="space-y-5"
          >

            {/* =====================================
                NOMBRE + APELLIDO
            ===================================== */}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

              <div>

                <label
                  htmlFor="firstName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Nombre
                </label>

                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(event) =>
                    setFirstName(event.target.value)
                  }
                  required
                  placeholder="Tu nombre"
                  className="
                    w-full
                    border
                    border-gray-200
                    rounded-xl
                    px-4
                    py-3
                    bg-white
                    outline-none
                    focus:border-[#1D2559]
                    focus:ring-2
                    focus:ring-[#1D2559]/10
                  "
                />

              </div>


              <div>

                <label
                  htmlFor="lastName"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Apellido
                </label>

                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(event) =>
                    setLastName(event.target.value)
                  }
                  required
                  placeholder="Tu apellido"
                  className="
                    w-full
                    border
                    border-gray-200
                    rounded-xl
                    px-4
                    py-3
                    bg-white
                    outline-none
                    focus:border-[#1D2559]
                    focus:ring-2
                    focus:ring-[#1D2559]/10
                  "
                />

              </div>

            </div>


            {/* =====================================
                EMAIL
            ===================================== */}

            <div>

              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Correo electrónico
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                required
                placeholder="correo@ejemplo.com"
                className="
                  w-full
                  border
                  border-gray-200
                  rounded-xl
                  px-4
                  py-3
                  bg-white
                  outline-none
                  focus:border-[#1D2559]
                  focus:ring-2
                  focus:ring-[#1D2559]/10
                "
              />

            </div>


            {/* =====================================
                CONTRASEÑA
            ===================================== */}

            <div>

              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Contraseña
              </label>

              <div className="relative">

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  required
                  placeholder="Mínimo 8 caracteres"
                  className="
                    w-full
                    border
                    border-gray-200
                    rounded-xl
                    px-4
                    py-3
                    pr-12
                    bg-white
                    outline-none
                    focus:border-[#1D2559]
                    focus:ring-2
                    focus:ring-[#1D2559]/10
                  "
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(!showPassword)
                  }
                  className="
                    absolute
                    right-4
                    top-1/2
                    -translate-y-1/2
                    text-gray-400
                    hover:text-[#1D2559]
                  "
                >

                  {showPassword
                    ? <EyeOff size={20} />
                    : <Eye size={20} />
                  }

                </button>

              </div>


              {/* REQUISITOS */}

              <div className="mt-3 space-y-1.5">

                <PasswordRequirement
                  valid={hasMinLength}
                  text="Mínimo 8 caracteres"
                />

                <PasswordRequirement
                  valid={hasLetter}
                  text="Al menos una letra"
                />

                <PasswordRequirement
                  valid={hasNumber}
                  text="Al menos un número"
                />

              </div>

            </div>


            {/* =====================================
                CONFIRMAR CONTRASEÑA
            ===================================== */}

            <div>

              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Confirmar contraseña
              </label>

              <div className="relative">

                <input
                  id="confirmPassword"
                  type={
                    showConfirmPassword
                      ? "text"
                      : "password"
                  }
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  required
                  placeholder="Repite tu contraseña"
                  className="
                    w-full
                    border
                    border-gray-200
                    rounded-xl
                    px-4
                    py-3
                    pr-12
                    bg-white
                    outline-none
                    focus:border-[#1D2559]
                    focus:ring-2
                    focus:ring-[#1D2559]/10
                  "
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(
                      !showConfirmPassword
                    )
                  }
                  className="
                    absolute
                    right-4
                    top-1/2
                    -translate-y-1/2
                    text-gray-400
                    hover:text-[#1D2559]
                  "
                >

                  {showConfirmPassword
                    ? <EyeOff size={20} />
                    : <Eye size={20} />
                  }

                </button>

              </div>


              {/* COINCIDENCIA */}

              {confirmPassword.length > 0 && (

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

            </div>


            {/* =====================================
                ERROR
            ===================================== */}

            {error && (

              <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3">

                <p className="text-sm text-red-600">
                  {error}
                </p>

              </div>

            )}


            {/* =====================================
                SUCCESS
            ===================================== */}

            {message && (

              <div className="rounded-xl bg-green-50 border border-green-100 px-4 py-3">

                <p className="text-sm text-green-600">
                  {message}
                </p>

              </div>

            )}


            {/* =====================================
                BUTTON
            ===================================== */}

            <button
              type="submit"
              disabled={loading}
              className="
                w-full
                py-3.5
                rounded-xl
                bg-[#1D2559]
                hover:bg-[#303A80]
                text-white
                font-semibold
                transition
                disabled:bg-gray-300
                disabled:cursor-not-allowed
              "
            >

              {loading
                ? "Creando cuenta..."
                : "Crear cuenta"
              }

            </button>


            {/* =====================================
                LOGIN
            ===================================== */}

            <p className="text-center text-sm text-gray-500 pt-2">

              ¿Ya tienes una cuenta?

              <Link
                to="/login"
                className="
                  ml-1
                  font-semibold
                  text-[#1D2559]
                  hover:underline
                "
              >
                Iniciar sesión
              </Link>

            </p>

          </form>

        </div>

      </section>

    </main>
  );
}


// ============================================
// COMPONENTE: REQUISITO DE CONTRASEÑA
// ============================================

function PasswordRequirement({ valid, text }) {

  return (

    <div className="flex items-center gap-2 text-sm">

      {valid ? (

        <Check
          size={16}
          className="text-green-500"
        />

      ) : (

        <X
          size={16}
          className="text-gray-300"
        />

      )}

      <span
        className={
          valid
            ? "text-green-600"
            : "text-gray-400"
        }
      >
        {text}
      </span>

    </div>

  );
}

