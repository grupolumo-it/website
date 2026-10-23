import { Link } from "react-router-dom";
import { LogOut, ShoppingCart, Truck, User } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";

const buttons = [
  { Icon: ShoppingCart, label: "Carrito" },
  { Icon: Truck, label: "Pedidos" },
];

function getDisplayName(user) {
  return user.user_metadata?.first_name || user.email?.split("@")[0] || "Cuenta";
}

export default function HeaderActions() {
  const { user, isAuthenticated, loading, logout } = useAuth();

  async function handleLogout() {
    try {
      await logout();
    } catch (error) {
      console.error("Error cerrando sesión:", error);
    }
  }

  return (
    <div className="flex items-center space-x-5">

      {buttons.map(({ Icon, label }) => (
        <button
          key={label}
          aria-label={label}
          className="text-lumo-gray-600 hover:text-lumo-navy transition-colors cursor-pointer"
        >
          <Icon size={20} />
        </button>
      ))}

      {/* Mientras se verifica la sesión no mostramos nada para evitar parpadeos */}
      {!loading && !isAuthenticated && (
        <Link
          to="/login"
          className="flex items-center space-x-2 text-lumo-gray-600 hover:text-lumo-navy"
        >
          <User size={20} />
          <span className="hidden xl:inline text-sm font-medium">
            Iniciar sesión
          </span>
        </Link>
      )}

      {!loading && isAuthenticated && (
        <>
          <span className="flex items-center space-x-2 text-lumo-gray-600">
            <User size={20} />
            <span className="hidden xl:inline text-sm font-medium">
              {getDisplayName(user)}
            </span>
          </span>

          <button
            onClick={handleLogout}
            aria-label="Cerrar sesión"
            className="text-lumo-gray-600 hover:text-lumo-navy transition-colors cursor-pointer"
          >
            <LogOut size={20} />
          </button>
        </>
      )}

    </div>
  );
}
