import { Link } from "react-router-dom";

const SIDE_IMAGE =
  "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=1600";

/**
 * Marco común de las pantallas de autenticación:
 * panel con imagen a la izquierda y formulario a la derecha.
 */
export default function AuthLayout({
  title,
  subtitle,
  heroTitle,
  heroText,
  children,
}) {
  return (
    <main className="min-h-screen grid lg:grid-cols-2">

      {/* IMAGEN LATERAL */}
      <section
        className="hidden lg:flex relative min-h-screen bg-cover bg-center"
        style={{ backgroundImage: `url()` }}
      >
        <div className="absolute inset-0 bg-lumo-navy/60" />

        <div className="relative z-10 flex flex-col justify-between p-12 text-white w-full">

          {/* Logo */}
          <div>
            <Link to="/" className="inline-block">
              <h1 className="text-4xl font-bold hover:opacity-80 transition">
                Lumo
              </h1>
            </Link>

            <p className="mt-2 text-white/80">
              Todo lo que necesitas, en un solo lugar.
            </p>
          </div>

          {/* Texto central */}
          <div className="max-w-md">
            <h2 className="text-4xl font-bold leading-tight">{heroTitle}</h2>
            <p className="mt-4 text-white/80 text-lg">{heroText}</p>
          </div>

          {/* Pie */}
          <p className="text-sm text-white/60">
            © {new Date().getFullYear()} Lumo
          </p>

        </div>
      </section>

      {/* FORMULARIO */}
      <section className="min-h-screen flex items-center justify-center px-6 py-12 bg-gray-50">
        <div className="w-full max-w-lg">

          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-lumo-navy transition mb-8"
          >
            <span className="text-lg">←</span>
            Volver al inicio
          </Link>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-lumo-navy">{title}</h1>
            <p className="text-gray-500 mt-2">{subtitle}</p>
          </div>

          {children}

        </div>
      </section>

    </main>
  );
}
