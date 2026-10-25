import { Link } from "react-router-dom";
import UserMenu from "@/layouts/components/UserMenu.jsx";

export default function HeaderActions() {
  return (
    <div id="header-actions-container" className="flex items-center space-x-6">
      <nav id="header-nav-main" className="hidden lg:flex items-center">
        <Link
          id="nav-link-marketplace"
          to="/"
          className="text-lumo-gray-600 hover:text-lumo-navy px-3 py-2 text-sm font-semibold transition-colors"
        >
          Marketplace
        </Link>
      </nav>

      <div id="buttons-right-container" className="flex items-center space-x-5">
        <button
          id="btn-header-search-mobile"
          type="button"
          aria-label="Abrir búsqueda"
          className="md:hidden text-lumo-gray-600 hover:text-lumo-navy transition-colors"
        >
          <i className="fa-solid fa-magnifying-glass text-lg" aria-hidden="true" />
        </button>

        <button
          id="btn-header-cart"
          type="button"
          aria-label="Carrito de compras"
          className="text-lumo-gray-600 hover:text-lumo-navy transition-colors relative"
        >
          <i className="fa-solid fa-cart-shopping text-lg" aria-hidden="true" />
        </button>

        <button
          id="btn-header-tracking"
          type="button"
          aria-label="Seguimiento de pedidos"
          className="text-lumo-gray-600 hover:text-lumo-navy transition-colors"
        >
          <i className="fa-solid fa-truck-fast text-lg" aria-hidden="true" />
        </button>

        <UserMenu showLabel />
      </div>
    </div>
  );
}
