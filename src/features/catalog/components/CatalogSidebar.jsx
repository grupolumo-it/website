import { useState } from "react";
import { Link } from "react-router-dom";
import { getCategoryIconClass } from "@/features/categories/categoryIcons";
import { SHOW_COMING_SOON_FILTERS } from "@/features/catalog/catalogConfig";
import { RATING_OPTIONS } from "@/features/catalog/catalogFilters";

const RADIO = "accent-[var(--color-lumo-navy)] w-4 h-4";

const PRICE_INPUT =
  "w-full min-w-0 border border-lumo-gray-200 rounded-full px-4 py-2 text-sm bg-white outline-none focus:border-lumo-navy focus:ring-2 focus:ring-lumo-navy/10";

function toNumber(value) {
  if (value === "" || value === null) return null;
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : null;
}

// Estrellas de una calificación mínima: 4.5 -> ★★★★½
function Stars({ value }) {
  return (
    <span className="inline-flex gap-0.5 text-amber-500 text-xs" aria-hidden="true">
      {[1, 2, 3, 4, 5].map((n) =>
        value >= n ? (
          <i key={n} className="fa-solid fa-star" />
        ) : value >= n - 0.5 ? (
          <i key={n} className="fa-solid fa-star-half-stroke" />
        ) : (
          <i key={n} className="fa-regular fa-star" />
        )
      )}
    </span>
  );
}

function FilterGroup({ title, soon = false, children }) {
  return (
    <div className={`py-4 border-t border-lumo-gray-200 first:border-t-0 ${soon ? "opacity-60" : ""}`}>
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-lumo-navy">{title}</h3>
        {soon && (
          <span className="text-[10px] font-semibold text-lumo-gray-500 bg-white px-2 py-0.5 rounded-full">
            Próximamente
          </span>
        )}
      </div>
      {children}
    </div>
  );
}

// ---------- Tarjeta de categorías ----------
function CategoriesCard({ categories, activeSlug, getCategoryUrl }) {
  const item = (active) =>
    `flex items-center gap-3 rounded-full px-4 py-2.5 text-sm transition ${
      active
        ? "bg-lumo-gray-200 text-lumo-navy font-semibold"
        : "text-lumo-gray-600 hover:bg-lumo-gray-200/60 hover:text-lumo-navy"
    }`;

  return (
    <div className="bg-lumo-gray-100 rounded-3xl p-5">
      <p className="text-xs font-semibold tracking-wide text-lumo-gray-500 mb-3 px-2">
        CATEGORÍAS
      </p>

      <ul className="space-y-1">
        <li>
          <Link to={getCategoryUrl(null)} className={item(!activeSlug)}>
            <i className="fa-solid fa-table-cells-large w-4 text-center" aria-hidden="true" />
            <span className="flex-1">Todas</span>
          </Link>
        </li>

        {categories.map((category) => {
          const active = activeSlug === category.slug;

          return (
            <li key={category.id}>
              <Link to={getCategoryUrl(category.slug)} className={item(active)}>
                <i
                  className={`${getCategoryIconClass(category.icon)} w-4 text-center`}
                  aria-hidden="true"
                />
                <span className="flex-1">{category.name}</span>
                <i
                  className={`fa-solid ${active ? "fa-chevron-down" : "fa-chevron-right"} text-[10px] text-lumo-gray-400`}
                  aria-hidden="true"
                />
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

// ---------- Tarjeta de filtros ----------
// Los cambios se aplican al pulsar "Aplicar filtros". Al cambiar los filtros
// aplicados, el padre le da otra "key" y el formulario se reinicia.
function FiltersCard({ brands, applied, hasFilters, onApply, onClear }) {
  const [draft, setDraft] = useState({
    brand: applied.brand ?? "",
    minPrice: applied.minPrice ?? "",
    maxPrice: applied.maxPrice ?? "",
    minRating: applied.minRating ?? "",
  });

  const set = (field) => (event) =>
    setDraft((current) => ({ ...current, [field]: event.target.value }));

  function handleSubmit(event) {
    event.preventDefault();

    let minPrice = toNumber(draft.minPrice);
    let maxPrice = toNumber(draft.maxPrice);

    // Si pusieron el mínimo mayor que el máximo, se intercambian
    if (minPrice !== null && maxPrice !== null && minPrice > maxPrice) {
      [minPrice, maxPrice] = [maxPrice, minPrice];
    }

    onApply({
      brand: draft.brand || null,
      minPrice,
      maxPrice,
      minRating: draft.minRating === "" ? null : Number(draft.minRating),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="bg-lumo-gray-100 rounded-3xl p-5">

      <div className="flex items-center justify-between mb-2 px-1">
        <h2 className="flex items-center gap-2 text-sm font-bold text-lumo-navy">
          <i className="fa-solid fa-sliders" aria-hidden="true" />
          Filtros
        </h2>

        {hasFilters && (
          <button
            type="button"
            onClick={onClear}
            className="text-xs text-lumo-gray-500 underline hover:text-lumo-navy cursor-pointer"
          >
            Limpiar
          </button>
        )}
      </div>

      {SHOW_COMING_SOON_FILTERS && (
        <FilterGroup title="Tipo de oferta" soon>
          {["Productos digitales", "Productos físicos", "Servicios"].map((label) => (
            <label key={label} className="flex items-center gap-3 py-1 text-sm text-lumo-gray-600">
              <input type="radio" disabled className={RADIO} />
              {label}
            </label>
          ))}
        </FilterGroup>
      )}

      {brands.length > 0 && (
        <FilterGroup title="Marcas">
          <label className="flex items-center gap-3 py-1 text-sm text-lumo-gray-600 cursor-pointer">
            <input
              type="radio"
              name="brand"
              value=""
              checked={draft.brand === ""}
              onChange={set("brand")}
              className={RADIO}
            />
            Todas
          </label>

          {brands.map((brand) => (
            <label key={brand.id} className="flex items-center gap-3 py-1 text-sm text-lumo-gray-600 cursor-pointer">
              <input
                type="radio"
                name="brand"
                value={brand.slug}
                checked={draft.brand === brand.slug}
                onChange={set("brand")}
                className={RADIO}
              />
              {brand.name}
            </label>
          ))}
        </FilterGroup>
      )}

      <FilterGroup title="Precio (COP)">
        <div className="flex items-center gap-2">
          <input
            type="number"
            min="0"
            placeholder="Mín"
            aria-label="Precio mínimo"
            value={draft.minPrice}
            onChange={set("minPrice")}
            className={PRICE_INPUT}
          />
          <span className="text-lumo-gray-400">—</span>
          <input
            type="number"
            min="0"
            placeholder="Máx"
            aria-label="Precio máximo"
            value={draft.maxPrice}
            onChange={set("maxPrice")}
            className={PRICE_INPUT}
          />
        </div>
      </FilterGroup>

      {SHOW_COMING_SOON_FILTERS && (
        <FilterGroup title="Puntos (PV)" soon>
          <input type="range" disabled className="w-full" aria-label="Puntos máximos" />
        </FilterGroup>
      )}

      <FilterGroup title="Calificación">
        <label className="flex items-center gap-3 py-1 text-sm text-lumo-gray-600 cursor-pointer">
          <input
            type="radio"
            name="rating"
            value=""
            checked={draft.minRating === ""}
            onChange={set("minRating")}
            className={RADIO}
          />
          Cualquiera
        </label>

        {RATING_OPTIONS.map((value) => (
          <label key={value} className="flex items-center gap-3 py-1 text-sm text-lumo-gray-600 cursor-pointer">
            <input
              type="radio"
              name="rating"
              value={value}
              checked={String(draft.minRating) === String(value)}
              onChange={set("minRating")}
              className={RADIO}
            />
            <Stars value={value} />
            <span>{value.toFixed(1)} o más</span>
          </label>
        ))}
      </FilterGroup>

      {SHOW_COMING_SOON_FILTERS && (
        <FilterGroup title="Solo envío gratis" soon>
          <input type="checkbox" disabled className={RADIO} aria-label="Solo envío gratis" />
        </FilterGroup>
      )}

      <button
        type="submit"
        className="w-full mt-2 py-3 rounded-full bg-lumo-navy hover:bg-lumo-blue text-white text-sm font-semibold transition cursor-pointer"
      >
        Aplicar filtros
      </button>

    </form>
  );
}

/**
 * Barra lateral del catálogo: categorías + filtros.
 * - applied: filtros ya aplicados { brand, minPrice, maxPrice, minRating }
 * - onApply(filters) / onClear(): cambian los filtros (el padre actualiza la URL)
 * - getCategoryUrl(slug | null): dirección del catálogo para esa categoría
 */
export default function CatalogSidebar({
  categories,
  activeCategory,
  getCategoryUrl,
  brands,
  applied,
  hasFilters,
  onApply,
  onClear,
}) {
  return (
    <aside className="space-y-6">
      <CategoriesCard
        categories={categories}
        activeSlug={activeCategory}
        getCategoryUrl={getCategoryUrl}
      />

      <FiltersCard
        key={JSON.stringify(applied)}
        brands={brands}
        applied={applied}
        hasFilters={hasFilters}
        onApply={onApply}
        onClear={onClear}
      />
    </aside>
  );
}
