import { Link, NavLink, Outlet } from "react-router-dom";
import { useMySeller } from "@/features/seller/hooks/useMySeller";

const NAV_BASE = "text-sm font-medium transition-colors border-b-2 py-5";

function Shell({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">{children}</div>
    </div>
  );
}

const STATUS_MESSAGES = {
  PENDING: "Tu solicitud de tienda está en revisión. Te avisaremos cuando sea aprobada.",
  SUSPENDED: "Tu tienda está suspendida. Contacta a un administrador de Lumo.",
  REJECTED: "Tu solicitud de tienda fue rechazada. Contacta a un administrador de Lumo.",
  INACTIVE: "Tu tienda está inactiva. Contacta a un administrador de Lumo.",
};

/**
 * Marco del panel de vendedor. Carga la tienda del usuario y solo muestra
 * las pantallas hijas si la tienda está ACTIVA. Las hijas la reciben con
 * useOutletContext(): const { seller } = useOutletContext();
 */
export default function SellerLayout() {
  const { seller, loading, error } = useMySeller();

  if (loading) {
    return (
      <Shell>
        <p className="text-gray-500">Cargando tu tienda...</p>
      </Shell>
    );
  }

  if (error || !seller || seller.status !== "ACTIVE") {
    return (
      <Shell>
        <h1 className="text-2xl font-bold text-lumo-navy">Panel de vendedor</h1>
        <p className="text-gray-500 mt-3">
          {error ||
            (seller
              ? STATUS_MESSAGES[seller.status]
              : "Tu cuenta todavía no tiene una tienda registrada.")}
        </p>
        <Link to="/" className="inline-block mt-6 text-sm font-semibold text-lumo-navy hover:underline">
          ← Volver a la tienda
        </Link>
      </Shell>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">

      <header className="bg-white border-b border-lumo-gray-200">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">

          <div className="flex items-center gap-8">
            <Link to="/seller/products" className="text-xl font-bold text-lumo-navy">
              Lumo
              <span className="ml-2 text-sm font-medium text-lumo-gray-500">Panel de vendedor</span>
            </Link>

            <nav className="flex gap-6">
              <NavLink
                to="/seller/products"
                end
                className={({ isActive }) =>
                  `${NAV_BASE} ${isActive ? "text-lumo-navy border-lumo-navy" : "text-lumo-gray-500 border-transparent hover:text-lumo-navy"}`
                }
              >
                Mis productos
              </NavLink>

              <NavLink
                to="/seller/products/new"
                className={({ isActive }) =>
                  `${NAV_BASE} ${isActive ? "text-lumo-navy border-lumo-navy" : "text-lumo-gray-500 border-transparent hover:text-lumo-navy"}`
                }
              >
                Nuevo producto
              </NavLink>
            </nav>
          </div>

          <div className="flex items-center gap-5 text-sm">
            <span className="hidden sm:inline text-lumo-gray-500">{seller.store_name}</span>
            <Link to="/" className="font-medium text-lumo-navy hover:underline">
              Ver tienda
            </Link>
          </div>

        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <Outlet context={{ seller }} />
      </main>

    </div>
  );
}
