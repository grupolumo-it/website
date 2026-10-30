import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { ROLES } from "@/features/auth/roles";
import { useMySeller } from "@/features/seller/hooks/useMySeller";
import StoreRequestForm from "@/features/stores/components/StoreRequestForm.jsx";

function Card({ title, children }) {
  return (
    <section className="max-w-2xl mx-auto px-6 py-16">
      <div className="bg-white rounded-2xl border border-lumo-gray-200 shadow-soft p-8">
        <h1 className="text-3xl font-bold text-lumo-navy">{title}</h1>
        {children}
      </div>
    </section>
  );
}

const STATUS_MESSAGES = {
  PENDING:
    "Tu solicitud está en revisión. Cuando un administrador la apruebe, podrás entrar a tu panel de vendedor.",
  REJECTED:
    "Tu solicitud no fue aprobada. Si crees que es un error, contacta a un administrador de Lumo.",
  SUSPENDED: "Tu tienda está suspendida. Contacta a un administrador de Lumo.",
  INACTIVE: "Tu tienda está inactiva. Contacta a un administrador de Lumo.",
};

/**
 * Solicitud para abrir una tienda en Lumo (solo clientes con sesión iniciada).
 * Según el estado de la solicitud muestra el formulario o el avance.
 */
export default function BecomeSellerPage() {
  const { role, refreshRole } = useAuth();
  const { seller, loading, error, reload } = useMySeller();

  const isSellerRole = role === ROLES.SELLER || role === ROLES.ADMIN;
  const approved = seller?.status === "ACTIVE";

  // Tienda recién aprobada: actualizamos el rol sin obligar a cerrar sesión
  useEffect(() => {
    if (approved && role === ROLES.CLIENT) refreshRole();
  }, [approved, role, refreshRole]);

  if (loading) {
    return (
      <Card title="Vender en Lumo">
        <p className="text-gray-500 mt-3">Cargando...</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card title="Vender en Lumo">
        <p className="text-red-600 mt-3">{error}</p>
      </Card>
    );
  }

  if (isSellerRole) {
    return (
      <Card title="Ya puedes vender en Lumo">
        <p className="text-gray-500 mt-3">
          Tu cuenta tiene acceso al panel de vendedor.
        </p>
        <Link
          to="/seller"
          className="inline-block mt-6 px-6 py-3 rounded-xl bg-lumo-navy hover:bg-lumo-blue text-white text-sm font-semibold transition"
        >
          Ir a mi panel
        </Link>
      </Card>
    );
  }

  if (approved) {
    return (
      <Card title="¡Tu tienda fue aprobada!">
        <p className="text-gray-500 mt-3">Estamos activando tu acceso...</p>
      </Card>
    );
  }

  if (seller) {
    return (
      <Card title={seller.store_name}>
        <p className="text-gray-500 mt-3">{STATUS_MESSAGES[seller.status]}</p>
        <Link
          to="/"
          className="inline-block mt-6 text-sm font-semibold text-lumo-navy hover:underline"
        >
          ← Volver a la tienda
        </Link>
      </Card>
    );
  }

  return (
    <Card title="Vende en Lumo">
      <p className="text-gray-500 mt-3 mb-8">
        Cuéntanos sobre tu tienda. Un administrador revisará tu solicitud y, cuando la apruebe,
        podrás publicar tus productos desde tu panel de vendedor.
      </p>

      <StoreRequestForm onSuccess={reload} />
    </Card>
  );
}
