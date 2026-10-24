import { Link, useLocation } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import DashboardLayout from "@/layouts/DashboardLayout.jsx";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { ROLES } from "@/features/auth/roles";
import { useMySeller } from "@/features/seller/hooks/useMySeller";

function Shell({ children }) {
  return (
    <div className="min-h-screen bg-lumo-gray-50">
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

// Ruta de navegación del encabezado según la pantalla en la que estamos
function getCrumbs(pathname) {
  const path = pathname.replace(/\/+$/, "");
  const root = { label: "Seller", to: "/seller" };
  const products = { label: "Mis productos", to: "/seller/products" };

  if (path === "/seller/products") return [root, { label: "Mis productos" }];
  if (path === "/seller/products/new") return [root, products, { label: "Nuevo producto" }];
  if (/^\/seller\/products\/[^/]+\/edit$/.test(path)) return [root, products, { label: "Editar producto" }];

  return [root, { label: "Resumen" }];
}

/**
 * Panel de vendedor. Carga la tienda del usuario y solo muestra las pantallas
 * hijas si la tienda está ACTIVA. Las hijas la reciben con useOutletContext():
 * const { seller } = useOutletContext();
 */
export default function SellerLayout() {
  const { seller, loading, error } = useMySeller();
  const { role } = useAuth();
  const { pathname } = useLocation();

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

  // Un administrador puede pasar de un panel al otro
  const menuLinks =
    role === ROLES.ADMIN
      ? [{ to: "/admin", label: "Panel de administración", Icon: ShieldCheck }]
      : [];

  return (
    <DashboardLayout
      homePath="/seller"
      crumbs={getCrumbs(pathname)}
      searchPlaceholder="Buscar en tu tienda..."
      searchPath="/seller/products"
      menuLinks={menuLinks}
      outletContext={{ seller }}
    />
  );
}
