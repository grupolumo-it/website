import { Outlet } from "react-router-dom";
import DashboardHeader from "@/layouts/components/dashboard/DashboardHeader.jsx";

/**
 * Marco común de los paneles (Seller y Admin): encabezado + contenido.
 * Cada panel lo usa desde su propio layout, indicando su ruta de navegación,
 * su buscador y sus accesos del menú de usuario.
 */
export default function DashboardLayout({ outletContext, ...headerProps }) {
  return (
    <div className="min-h-screen bg-lumo-gray-50">
      <DashboardHeader {...headerProps} />

      <main className="max-w-7xl mx-auto px-6 py-10">
        <Outlet context={outletContext} />
      </main>
    </div>
  );
}
