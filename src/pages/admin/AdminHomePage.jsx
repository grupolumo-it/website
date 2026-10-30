import { Store, Tag } from "lucide-react";
import DashboardCard from "@/shared/components/DashboardCard.jsx";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { getDisplayName } from "@/features/auth/userDisplay";
import { useAdminStores } from "@/features/stores/hooks/useAdminStores";

export default function AdminHomePage() {
  const { user } = useAuth();
  const { stores } = useAdminStores();

  const pending = stores.filter((store) => store.status === "PENDING").length;

  return (
    <div>

      <h1 className="text-3xl font-bold text-lumo-navy">Bienvenido de nuevo</h1>
      <p className="text-sm text-lumo-gray-500 mt-1 mb-8">Hola, {getDisplayName(user)}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DashboardCard
          to="/admin/sellers"
          icon={Store}
          title="Vendedores"
          description="Aprueba o rechaza solicitudes de tienda y administra a los vendedores."
          badge={pending > 0 ? (pending === 1 ? "1 pendiente" : `${pending} pendientes`) : undefined}
        />

        <DashboardCard
          to="/admin/badges"
          icon={Tag}
          title="Etiquetas de productos"
          description="Define las etiquetas que los vendedores pueden elegir."
        />
      </div>

    </div>
  );
}
