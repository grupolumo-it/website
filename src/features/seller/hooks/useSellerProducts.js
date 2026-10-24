import { useCallback, useEffect, useState } from "react";
import { listSellerProducts } from "@/features/seller/sellerProductService";

/** Productos de la tienda: { products, loading, error, reload }. */
export function useSellerProducts(sellerId) {
  const [version, setVersion] = useState(0);
  const key = `${sellerId}:${version}`;

  const [result, setResult] = useState({ key: null, products: [], error: null });

  useEffect(() => {
    let cancelled = false;

    listSellerProducts(sellerId)
      .then((products) => {
        if (!cancelled) setResult({ key, products, error: null });
      })
      .catch((error) => {
        console.error("Error obteniendo productos del vendedor:", error);
        if (!cancelled) {
          setResult({ key, products: [], error: "No fue posible cargar tus productos." });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [sellerId, key]);

  const reload = useCallback(() => setVersion((current) => current + 1), []);

  const loading = result.key !== key;

  return {
    // Mientras recarga se siguen mostrando los productos anteriores
    products: result.products,
    error: loading ? null : result.error,
    loading,
    reload,
  };
}
