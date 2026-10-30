import { useEffect, useState } from "react";
import { getBrands } from "@/features/brands/brandService";

/** Marcas activas: { brands, loading, error }. Si falla, el catálogo sigue funcionando sin ese filtro. */
export function useBrands() {
  const [state, setState] = useState({ brands: [], loading: true, error: null });

  useEffect(() => {
    let cancelled = false;

    getBrands()
      .then((brands) => {
        if (!cancelled) setState({ brands, loading: false, error: null });
      })
      .catch((error) => {
        console.error("Error obteniendo marcas:", error);
        if (!cancelled) setState({ brands: [], loading: false, error: "No fue posible cargar las marcas." });
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
