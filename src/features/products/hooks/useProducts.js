import { useEffect, useState } from "react";
import { getProducts } from "@/features/products/productService";

/** Todos los productos activos: { products, loading, error }. */
export function useProducts() {
  const [state, setState] = useState({ products: [], loading: true, error: null });

  useEffect(() => {
    let cancelled = false;

    getProducts()
      .then((products) => {
        if (!cancelled) setState({ products, loading: false, error: null });
      })
      .catch((error) => {
        console.error("Error obteniendo el catálogo:", error);
        if (!cancelled) {
          setState({ products: [], loading: false, error: "No fue posible cargar el catálogo." });
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
