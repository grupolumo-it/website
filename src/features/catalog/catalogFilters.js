// Lógica del catálogo: lee y escribe los filtros en la URL, filtra, ordena y pagina.
// Todo el estado vive en la URL (/catalog?categoria=...&marca=...&min=...), así que
// los enlaces se pueden compartir y el botón "atrás" funciona.

export const PAGE_SIZE = 12;

export const SORT_OPTIONS = [
  { value: "recientes", label: "Más recientes" },
  { value: "precio-asc", label: "Precio: menor a mayor" },
  { value: "precio-desc", label: "Precio: mayor a menor" },
  { value: "calificacion", label: "Mejor calificados" },
];

export const DEFAULT_SORT = "recientes";

export const RATING_OPTIONS = [4.5, 4];

/** Convierte los parámetros de la URL en un objeto de filtros. */
export function parseCatalogParams(searchParams) {
  const number = (key) => {
    const raw = searchParams.get(key);
    if (raw === null || raw === "") return null;
    const value = Number(raw);
    return Number.isFinite(value) && value >= 0 ? value : null;
  };

  const sort = searchParams.get("orden");

  return {
    category: searchParams.get("categoria") || null,
    brand: searchParams.get("marca") || null,
    minPrice: number("min"),
    maxPrice: number("max"),
    minRating: number("calificacion"),
    sort: SORT_OPTIONS.some((option) => option.value === sort) ? sort : DEFAULT_SORT,
    page: Math.max(1, Math.floor(number("pagina") ?? 1)),
  };
}

/** Convierte un objeto de filtros en parámetros de URL (solo los que tienen valor). */
export function buildSearchParams(params) {
  const search = new URLSearchParams();

  if (params.category) search.set("categoria", params.category);
  if (params.brand) search.set("marca", params.brand);
  if (params.minPrice !== null && params.minPrice !== undefined) search.set("min", String(params.minPrice));
  if (params.maxPrice !== null && params.maxPrice !== undefined) search.set("max", String(params.maxPrice));
  if (params.minRating !== null && params.minRating !== undefined) search.set("calificacion", String(params.minRating));
  if (params.sort && params.sort !== DEFAULT_SORT) search.set("orden", params.sort);
  if (params.page > 1) search.set("pagina", String(params.page));

  return search;
}

export function catalogUrl(params) {
  const query = buildSearchParams(params).toString();
  return query ? `/catalog?${query}` : "/catalog";
}

export function hasActiveFilters(params) {
  return Boolean(
    params.brand ||
      params.minPrice !== null ||
      params.maxPrice !== null ||
      params.minRating !== null
  );
}

export function filterProducts(products, params, brandSlugById) {
  return products.filter((product) => {
    if (params.category && !product.categories.some((category) => category.slug === params.category)) {
      return false;
    }
    if (params.brand && brandSlugById[product.brandId] !== params.brand) return false;
    if (params.minPrice !== null && product.price < params.minPrice) return false;
    if (params.maxPrice !== null && product.price > params.maxPrice) return false;
    if (params.minRating !== null && product.rating < params.minRating) return false;

    return true;
  });
}

export function sortProducts(products, sort) {
  const list = [...products];

  switch (sort) {
    case "precio-asc":
      return list.sort((a, b) => a.price - b.price);
    case "precio-desc":
      return list.sort((a, b) => b.price - a.price);
    case "calificacion":
      return list.sort((a, b) => b.rating - a.rating || b.reviews - a.reviews);
    default:
      return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
}

export function paginate(items, page, pageSize = PAGE_SIZE) {
  const totalPages = Math.max(1, Math.ceil(items.length / pageSize));
  const current = Math.min(page, totalPages);

  return {
    items: items.slice((current - 1) * pageSize, current * pageSize),
    page: current,
    totalPages,
  };
}
