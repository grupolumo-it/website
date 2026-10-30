import { Link } from "react-router-dom";

// Páginas a mostrar: la primera, la última y las cercanas a la actual ("..." en medio)
function getPageItems(page, totalPages) {
  const wanted = new Set([1, totalPages, page - 1, page, page + 1]);
  const pages = [...wanted].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);

  const items = [];
  pages.forEach((p, index) => {
    if (index > 0 && p - pages[index - 1] > 1) items.push("gap-" + p);
    items.push(p);
  });

  return items;
}

const ARROW =
  "w-9 h-9 rounded-full bg-lumo-gray-100 text-lumo-navy flex items-center justify-center transition hover:bg-lumo-gray-200";

/**
 * Paginación con enlaces. getPageUrl(page) devuelve la dirección de cada página.
 * No se muestra si hay una sola.
 */
export default function Pagination({ page, totalPages, getPageUrl }) {
  if (totalPages <= 1) return null;

  return (
    <nav aria-label="Paginación" className="flex items-center justify-center gap-2 mt-12">

      {page > 1 ? (
        <Link to={getPageUrl(page - 1)} aria-label="Página anterior" className={ARROW}>
          <i className="fa-solid fa-chevron-left text-xs" aria-hidden="true" />
        </Link>
      ) : (
        <span aria-hidden="true" className={`${ARROW} opacity-40`}>
          <i className="fa-solid fa-chevron-left text-xs" />
        </span>
      )}

      {getPageItems(page, totalPages).map((item) =>
        typeof item === "string" ? (
          <span key={item} className="w-6 text-center text-lumo-gray-400">…</span>
        ) : (
          <Link
            key={item}
            to={getPageUrl(item)}
            aria-current={item === page ? "page" : undefined}
            className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold transition ${
              item === page
                ? "bg-lumo-navy text-white"
                : "text-lumo-gray-600 hover:bg-lumo-gray-100"
            }`}
          >
            {item}
          </Link>
        )
      )}

      {page < totalPages ? (
        <Link to={getPageUrl(page + 1)} aria-label="Página siguiente" className={ARROW}>
          <i className="fa-solid fa-chevron-right text-xs" aria-hidden="true" />
        </Link>
      ) : (
        <span aria-hidden="true" className={`${ARROW} opacity-40`}>
          <i className="fa-solid fa-chevron-right text-xs" />
        </span>
      )}

    </nav>
  );
}
