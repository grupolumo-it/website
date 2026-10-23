import { useEffect, useState } from "react";
import { getFeaturedProducts } from "@/features/products/productService";

export function useFeaturedProducts() {
  const [state, setState] = useState({
    products: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    getFeaturedProducts()
      .then((products) => {
        if (!cancelled) setState({ products, loading: false, error: null });
      })
      .catch((error) => {
        console.error("Error obteniendo productos destacados:", error);
        if (!cancelled) {
          setState({
            products: [],
            loading: false,
            error: "No fue posible cargar los productos.",
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
