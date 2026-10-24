import { Package, PackagePlus, Users } from "lucide-react";
import DashboardCard from "@/shared/components/DashboardCard.jsx";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { getDisplayName } from "@/features/auth/userDisplay";

export default function SellerHomePage() {
  const { user } = useAuth();

  return (
    <div>

      <h1 className="text-3xl font-bold text-lumo-navy">Bienvenido de nuevo</h1>
      <p className="text-sm text-lumo-gray-500 mt-1 mb-8">Hola, {getDisplayName(user)}</p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <DashboardCard
          to="/seller/products"
          icon={Package}
          title="Ver mis productos"
          description="Consulta, edita, publica u oculta lo que vendes."
        />

        <DashboardCard
          to="/seller/products/new"
          icon={PackagePlus}
          title="Nuevo producto"
          description="Agrega un producto con sus imágenes, precio y categorías."
        />

        <DashboardCard
          icon={Users}
          title="Mis clientes"
          description="Conoce a quienes compran en tu tienda."
          comingSoon
        />
      </div>

    </div>
  );
}
