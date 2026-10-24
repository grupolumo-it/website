import { useLocation } from "react-router-dom";
import { Store } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout.jsx";

// Ruta de navegación del encabezado según la pantalla en la que estamos
function getCrumbs(pathname) {
  const path = pathname.replace(/\/+$/, "");
  const root = { label: "Admin", to: "/admin" };

  if (path === "/admin/badges") return [root, { label: "Etiquetas" }];

  return [root, { label: "Resumen" }];
}

/**
 * Panel de administración. Solo los ADMIN llegan aquí (lo controla ProtectedRoute).
 * Para agregar una sección: una ruta hija en AppRoutes, su ruta en getCrumbs
 * y una tarjeta en AdminHomePage.
 */
export default function AdminLayout() {
  const { pathname } = useLocation();

  return (
    <DashboardLayout
      homePath="/admin"
      crumbs={getCrumbs(pathname)}
      searchPlaceholder="Buscar etiquetas..."
      searchPath="/admin/badges"
      menuLinks={[{ to: "/seller", label: "Panel de vendedor", Icon: Store }]}
    />
  );
}
