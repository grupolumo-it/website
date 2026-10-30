import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Pagination from "@/shared/components/Pagination.jsx";
import ProductGrid from "@/features/products/components/ProductGrid.jsx";
import CatalogSidebar from "@/features/catalog/components/CatalogSidebar.jsx";
import {
  SORT_OPTIONS,
  catalogUrl,
  filterProducts,
  hasActiveFilters,
  paginate,
  parseCatalogParams,
  sortProducts,
} from "@/features/catalog/catalogFilters";
import { useBrands } from "@/features/brands/hooks/useBrands";
import { useCategories } from "@/features/categories/hooks/useCategories";
import { useProducts } from "@/features/products/hooks/useProducts";

/**
 * Catálogo: categorías, filtros, orden y paginación.
 * Todo el estado vive en la dirección (/catalog?categoria=...&marca=...),
 * así que se puede compartir y el botón "atrás" funciona.
 *
 * Filtra en el navegador sobre todos los productos activos: va bien con cientos de
 * productos. Cuando el catálogo crezca mucho, se mueve el filtrado al servidor.
 */
export default function CatalogPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const params = parseCatalogParams(searchParams);

  const { products, loading, error } = useProducts();
  const { categories } = useCategories();
  const { brands } = useBrands();

  const [showFilters, setShowFilters] = useState(false);

  // Marcas que tienen al menos un producto, y su slug por id para filtrar
  const availableBrands = brands.filter((brand) =>
    products.some((product) => product.brandId === brand.id)
  );
  const brandSlugById = Object.fromEntries(brands.map((brand) => [brand.id, brand.slug]));

  const filtered = filterProducts(products, params, brandSlugById);
  const sorted = sortProducts(filtered, params.sort);
  const { items, page, totalPages } = paginate(sorted, params.page);

  const activeCategory = categories.find((category) => category.slug === params.category);
  const filtersActive = hasActiveFilters(params);

  // Cada cambio de filtro, orden o categoría vuelve a la página 1
  const update = (changes) => navigate(catalogUrl({ ...params, page: 1, ...changes }));

  // Al cambiar de página, volvemos arriba
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [page]);

  return (
    <section className="max-w-7xl mx-auto px-6 py-10">

      {/* Botón de filtros (solo en pantallas pequeñas) */}
      <button
        type="button"
        onClick={() => setShowFilters((current) => !current)}
        className="lg:hidden mb-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-lumo-gray-200 bg-white text-sm font-semibold text-lumo-navy cursor-pointer"
      >
        <i className="fa-solid fa-sliders" aria-hidden="true" />
        {showFilters ? "Ocultar filtros" : "Categorías y filtros"}
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-[17rem_1fr] gap-8">

        <div className={showFilters ? "block" : "hidden lg:block"}>
          <CatalogSidebar
            categories={categories}
            activeCategory={params.category}
            getCategoryUrl={(slug) => catalogUrl({ ...params, category: slug, page: 1 })}
            brands={availableBrands}
            applied={{
              brand: params.brand,
              minPrice: params.minPrice,
              maxPrice: params.maxPrice,
              minRating: params.minRating,
            }}
            hasFilters={filtersActive}
            onApply={(filters) => update(filters)}
            onClear={() =>
              update({ brand: null, minPrice: null, maxPrice: null, minRating: null })
            }
          />
        </div>

        <div>

          {/* Ruta de navegación */}
          <nav className="flex items-center gap-2 text-sm text-lumo-gray-500 mb-4">
            <Link to="/catalog" className="hover:text-lumo-navy transition-colors">
              Catálogo
            </Link>

            {activeCategory && (
              <>
                <i className="fa-solid fa-chevron-right text-[10px]" aria-hidden="true" />
                <span className="font-medium text-lumo-navy">{activeCategory.name}</span>
              </>
            )}
          </nav>

          {/* Título y orden */}
          <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-semibold text-lumo-navy">Descubre</h1>
              <p className="text-lumo-gray-500 mt-1">
                Explora productos premium de Lumo y de nuestros vendedores.
              </p>
              {!loading && !error && (
                <p className="text-xs text-lumo-gray-400 mt-2">
                  {sorted.length === 1 ? "1 producto" : `${sorted.length} productos`}
                </p>
              )}
            </div>

            <label className="inline-flex items-center gap-3 rounded-full bg-lumo-gray-100 border border-lumo-gray-200 px-5 py-2.5 text-xs text-lumo-gray-500">
              Ordenar por:
              <select
                value={params.sort}
                onChange={(event) => update({ sort: event.target.value })}
                className="bg-transparent text-sm font-semibold text-lumo-navy outline-none cursor-pointer"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {/* Resultados */}
          {loading && <p className="text-lumo-gray-500">Cargando productos...</p>}

          {error && <p className="text-red-500">{error}</p>}

          {!loading && !error && items.length === 0 && (
            <div className="bg-white rounded-2xl border border-lumo-gray-200 p-12 text-center">
              <p className="text-lumo-gray-500">
                {products.length === 0
                  ? "Todavía no hay productos publicados."
                  : "No encontramos productos con esos filtros."}
              </p>

              {products.length > 0 && (
                <Link
                  to="/catalog"
                  className="inline-block mt-4 text-sm font-semibold text-lumo-navy hover:underline"
                >
                  Ver todo el catálogo
                </Link>
              )}
            </div>
          )}

          {items.length > 0 && (
            <>
              <ProductGrid products={items} columnsClass="lg:grid-cols-3" />

              <Pagination
                page={page}
                totalPages={totalPages}
                getPageUrl={(target) => catalogUrl({ ...params, page: target })}
              />
            </>
          )}

        </div>
      </div>

    </section>
  );
}
