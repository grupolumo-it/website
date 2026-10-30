import { useCallback, useEffect, useState } from "react";
import { listStoresForAdmin } from "@/features/stores/storeService";

/** Tiendas para el panel de administración: { stores, loading, error, reload }. */
export function useAdminStores() {
  const [version, setVersion] = useState(0);
  const key = String(version);

  const [result, setResult] = useState({ key: null, stores: [], error: null });

  useEffect(() => {
    let cancelled = false;

    listStoresForAdmin()
      .then((stores) => {
        if (!cancelled) setResult({ key, stores, error: null });
      })
      .catch((error) => {
        console.error("Error obteniendo las tiendas:", error);
        if (!cancelled) {
          setResult({ key, stores: [], error: "No fue posible cargar los vendedores." });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [key]);

  const reload = useCallback(() => setVersion((current) => current + 1), []);

  const loading = result.key !== key;

  return {
    // Mientras recarga se siguen mostrando los datos anteriores
    stores: result.stores,
    error: loading ? null : result.error,
    loading,
    reload,
  };
}
