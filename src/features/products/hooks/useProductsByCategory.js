import { useEffect, useState } from "react";
import { getProductsByCategorySlug } from "@/features/products/productService";

/**
 * Carga una categoría y sus productos por slug.
 * Devuelve { category, products, loading, error }.
 */
export function useProductsByCategory(slug) {
  // Se guarda el slug al que pertenece el resultado: así "loading" es
  // verdadero cada vez que el slug cambia (de una categoría a otra).
  const [result, setResult] = useState({
    slug: null,
    category: null,
    products: [],
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    getProductsByCategorySlug(slug)
      .then(({ category, products }) => {
        if (!cancelled) setResult({ slug, category, products, error: null });
      })
      .catch((error) => {
        console.error("Error obteniendo productos de la categoría:", error);
        if (!cancelled) {
          setResult({
            slug,
            category: null,
            products: [],
            error: "No fue posible cargar los productos.",
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [slug]);

  const loading = result.slug !== slug;

  return {
    category: loading ? null : result.category,
    products: loading ? [] : result.products,
    error: loading ? null : result.error,
    loading,
  };
}
