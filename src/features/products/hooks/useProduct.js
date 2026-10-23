import { useEffect, useState } from "react";
import { getProductBySlug } from "@/features/products/productService";

/**
 * Carga un producto por su slug.
 * Devuelve { product, loading, error }.
 */
export function useProduct(slug) {
  // Guardamos también el slug al que pertenece el resultado: así sabemos que
  // estamos "cargando" cada vez que el slug cambia, sin setState sincrónico.
  const [result, setResult] = useState({ slug: null, product: null, error: null });

  useEffect(() => {
    let cancelled = false;

    getProductBySlug(slug)
      .then((product) => {
        if (!cancelled) setResult({ slug, product, error: null });
      })
      .catch((error) => {
        console.error("Error obteniendo producto:", error);
        if (!cancelled) {
          setResult({
            slug,
            product: null,
            error: "No fue posible cargar el producto.",
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const loading = result.slug !== slug;

  return {
    product: loading ? null : result.product,
    error: loading ? null : result.error,
    loading,
  };
}
