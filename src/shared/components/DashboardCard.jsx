import { Link } from "react-router-dom";

const BASE =
  "block bg-white rounded-2xl border border-lumo-gray-200 p-6 shadow-soft";

/**
 * Tarjeta de acceso de las páginas de Resumen de los paneles.
 * - to: ruta a la que lleva
 * - comingSoon: sección aún no construida (se ve apagada y no se puede abrir)
 * - badge: texto breve destacado arriba a la derecha (ej. "3 pendientes")
 */
export default function DashboardCard({ to, icon: Icon, title, description, badge, comingSoon = false }) {
  const content = (
    <>
      <div className="flex items-start justify-between">
        <Icon size={22} className="text-lumo-gray-500" />

        {comingSoon && (
          <span className="text-xs font-semibold text-lumo-gray-500 bg-lumo-gray-100 px-3 py-1 rounded-full">
            Próximamente
          </span>
        )}

        {!comingSoon && badge && (
          <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-3 py-1 rounded-full">
            {badge}
          </span>
        )}
      </div>

      <h2 className="mt-5 text-2xl font-light text-lumo-navy">{title}</h2>

      {description && (
        <p className="mt-2 text-sm text-lumo-gray-500">{description}</p>
      )}
    </>
  );

  if (comingSoon || !to) {
    return (
      <div aria-disabled="true" className={`${BASE} opacity-60 cursor-not-allowed`}>
        {content}
      </div>
    );
  }

  return (
    <Link
      to={to}
      className={`${BASE} transition hover:-translate-y-0.5 hover:shadow-lg hover:border-lumo-navy/30`}
    >
      {content}
    </Link>
  );
}
