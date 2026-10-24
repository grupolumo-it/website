import { Fragment } from "react";
import { Link } from "react-router-dom";
import { Bell, ChevronRight, ExternalLink } from "lucide-react";
import PanelSearch from "@/layouts/components/dashboard/PanelSearch.jsx";
import PanelUserMenu from "@/layouts/components/dashboard/PanelUserMenu.jsx";

/**
 * Encabezado de los paneles: logo, ruta de navegación, buscador,
 * "Ver tienda", notificaciones y usuario.
 *
 * crumbs: [{ label, to? }]. El último es la pantalla actual (sin enlace).
 */
export default function DashboardHeader({
  homePath,
  crumbs,
  searchPlaceholder,
  searchPath,
  menuLinks,
}) {
  return (
    <header className="bg-white border-b border-lumo-gray-200 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-4">

        {/* Logo + ruta de navegación */}
        <div className="flex items-center gap-4 min-w-0">
          <Link to={homePath} className="flex items-center gap-3 flex-shrink-0">
            <span className="w-9 h-9 rounded-xl bg-lumo-blue text-white font-bold flex items-center justify-center">
              L
            </span>
            <span className="text-lg font-bold text-lumo-navy">Lumo</span>
          </Link>

          <span className="hidden sm:block h-6 w-px bg-lumo-gray-200" />

          <nav aria-label="Ruta" className="hidden sm:flex items-center gap-2 text-sm min-w-0">
            {crumbs.map((crumb, index) => {
              const isLast = index === crumbs.length - 1;

              return (
                <Fragment key={crumb.label}>
                  {index > 0 && (
                    <ChevronRight size={14} className="text-lumo-gray-300 flex-shrink-0" />
                  )}

                  {isLast || !crumb.to ? (
                    <span
                      aria-current={isLast ? "page" : undefined}
                      className={isLast ? "font-semibold text-lumo-navy truncate" : "text-lumo-gray-500"}
                    >
                      {crumb.label}
                    </span>
                  ) : (
                    <Link to={crumb.to} className="text-lumo-gray-500 hover:text-lumo-navy transition-colors">
                      {crumb.label}
                    </Link>
                  )}
                </Fragment>
              );
            })}
          </nav>
        </div>

        {/* Buscador */}
        <div className="hidden md:flex flex-1 justify-center px-4">
          <PanelSearch placeholder={searchPlaceholder} targetPath={searchPath} />
        </div>

        {/* Acciones */}
        <div className="ml-auto md:ml-0 flex items-center gap-3">

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-2 text-sm font-medium text-lumo-gray-600 hover:text-lumo-navy transition-colors"
          >
            <ExternalLink size={16} />
            Ver tienda
          </a>

          <span className="hidden sm:block h-6 w-px bg-lumo-gray-200" />

          {/* Las notificaciones llegarán más adelante */}
          <button
            type="button"
            disabled
            title="Notificaciones (próximamente)"
            aria-label="Notificaciones (próximamente)"
            className="w-9 h-9 rounded-lg bg-lumo-gray-50 text-lumo-gray-500 flex items-center justify-center cursor-default"
          >
            <Bell size={18} />
          </button>

          <span className="hidden sm:block h-6 w-px bg-lumo-gray-200" />

          <PanelUserMenu links={menuLinks} />

        </div>
      </div>
    </header>
  );
}
