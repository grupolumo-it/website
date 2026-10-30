import { useTrendingStores } from "@/features/stores/hooks/useTrendingStores";

/** "Tiendas en Tendencia": datos reales de las tiendas activas. */
export default function TrendingStoresCard() {
  const { stores, loading, error } = useTrendingStores(3);

  return (
    <div className="bg-white border border-lumo-gray-200 rounded-3xl p-6 shadow-soft">

      <h3 className="flex items-center gap-3 text-sm font-semibold text-lumo-navy mb-4">
        <i className="fa-solid fa-store text-amber-500" aria-hidden="true" />
        Tiendas en Tendencia
      </h3>

      {loading && <p className="text-xs text-lumo-gray-500">Cargando tiendas...</p>}

      {error && <p className="text-xs text-red-500">{error}</p>}

      {!loading && !error && stores.length === 0 && (
        <p className="text-xs text-lumo-gray-500">
          Pronto verás aquí las tiendas más destacadas.
        </p>
      )}

      <ul className="divide-y divide-lumo-gray-100">
        {stores.map((store) => (
          <li key={store.id} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">

            {store.logo_url ? (
              <img
                src={store.logo_url}
                alt={store.store_name}
                className="w-9 h-9 rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <span className="w-9 h-9 rounded-full bg-lumo-blue/10 text-lumo-blue text-sm font-semibold flex items-center justify-center flex-shrink-0">
                {store.store_name.charAt(0).toUpperCase()}
              </span>
            )}

            <div className="min-w-0">
              <p className="text-sm font-semibold text-lumo-navy truncate">{store.store_name}</p>
              {store.description && (
                <p className="text-xs text-lumo-gray-500 truncate">{store.description}</p>
              )}
            </div>

          </li>
        ))}
      </ul>

    </div>
  );
}
