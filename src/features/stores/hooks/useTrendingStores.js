import { useEffect, useState } from "react";
import { getTrendingStores } from "@/features/stores/storeService";

/** Tiendas destacadas: { stores, loading, error }. */
export function useTrendingStores(limit = 3) {
  const [state, setState] = useState({ stores: [], loading: true, error: null });

  useEffect(() => {
    let cancelled = false;

    getTrendingStores(limit)
      .then((stores) => {
        if (!cancelled) setState({ stores, loading: false, error: null });
      })
      .catch((error) => {
        console.error("Error obteniendo tiendas en tendencia:", error);
        if (!cancelled) {
          setState({ stores: [], loading: false, error: "No fue posible cargar las tiendas." });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [limit]);

  return state;
}
