import { useLocation } from "react-router-dom";
import { Store } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout.jsx";

const ROOT = { label: "Admin", to: "/admin" };

// Ruta de navegación del encabezado según la pantalla en la que estamos
function getCrumbs(path) {
  if (path === "/admin/sellers") return [ROOT, { label: "Vendedores" }];
  if (path === "/admin/badges") return [ROOT, { label: "Etiquetas" }];

  return [ROOT, { label: "Resumen" }];
}

// El buscador del encabezado busca dentro de la sección actual
function getSearch(path) {
  if (path === "/admin/badges") {
    return { placeholder: "Buscar etiquetas...", path: "/admin/badges" };
  }

  return { placeholder: "Buscar vendedores...", path: "/admin/sellers" };
}

/**
 * Panel de administración. Solo los ADMIN llegan aquí (lo controla ProtectedRoute).
 * Para agregar una sección: una ruta hija en AppRoutes, su ruta en getCrumbs,
 * su buscador en getSearch y una tarjeta en AdminHomePage.
 */
export default function AdminLayout() {
  const path = useLocation().pathname.replace(/\/+$/, "");
  const search = getSearch(path);

  return (
    <DashboardLayout
      homePath="/admin"
      crumbs={getCrumbs(path)}
      searchPlaceholder={search.placeholder}
      searchPath={search.path}
      menuLinks={[{ to: "/seller", label: "Panel de vendedor", Icon: Store }]}
    />
  );
}
