import { Store, Tag } from "lucide-react";
import DashboardCard from "@/shared/components/DashboardCard.jsx";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { getDisplayName } from "@/features/auth/userDisplay";

export default function AdminHomePage() {
  const { user } = useAuth();

  return (
    <div>

      <h1 className="text-3xl font-bold text-lumo-navy">Bienvenido de nuevo</h1>
      <p className="text-sm text-lumo-gray-500 mt-1 mb-8">Hola, {getDisplayName(user)}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DashboardCard
          to="/admin/badges"
          icon={Tag}
          title="Etiquetas de productos"
          description="Define las etiquetas que los vendedores pueden elegir."
        />

        <DashboardCard
          icon={Store}
          title="Vendedores"
          description="Aprueba o rechaza solicitudes de tienda."
          comingSoon
        />
      </div>

    </div>
  );
}
