import { Link, NavLink, Outlet } from "react-router-dom";

const NAV_BASE = "text-sm font-medium transition-colors border-b-2 py-5";

/**
 * Marco del panel de administración. Solo los ADMIN llegan aquí
 * (lo controla ProtectedRoute en AppRoutes).
 * Para agregar una sección: un NavLink aquí y una ruta hija en AppRoutes.
 */
export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-50">

      <header className="bg-white border-b border-lumo-gray-200">
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">

          <div className="flex items-center gap-8">
            <Link to="/admin" className="text-xl font-bold text-lumo-navy">
              Lumo
              <span className="ml-2 text-sm font-medium text-lumo-gray-500">Administración</span>
            </Link>

            <nav className="flex gap-6">
              <NavLink
                to="/admin/badges"
                className={({ isActive }) =>
                  `${NAV_BASE} ${isActive ? "text-lumo-navy border-lumo-navy" : "text-lumo-gray-500 border-transparent hover:text-lumo-navy"}`
                }
              >
                Etiquetas
              </NavLink>
            </nav>
          </div>

          <div className="flex items-center gap-5 text-sm">
            <Link to="/seller" className="font-medium text-lumo-gray-500 hover:text-lumo-navy">
              Panel de vendedor
            </Link>
            <Link to="/" className="font-medium text-lumo-navy hover:underline">
              Ver tienda
            </Link>
          </div>

        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <Outlet />
      </main>

    </div>
  );
}
