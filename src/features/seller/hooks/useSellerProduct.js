import { useEffect, useState } from "react";
import { getSellerProduct } from "@/features/seller/sellerProductService";

/** Un producto para editar: { product, loading, error }. */
export function useSellerProduct(productId) {
  const [result, setResult] = useState({ productId: null, product: null, error: null });

  useEffect(() => {
    let cancelled = false;

    getSellerProduct(productId)
      .then((product) => {
        if (!cancelled) setResult({ productId, product, error: null });
      })
      .catch((error) => {
        console.error("Error obteniendo el producto:", error);
        if (!cancelled) {
          setResult({ productId, product: null, error: "No fue posible cargar el producto." });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [productId]);

  const loading = result.productId !== productId;

  return {
    product: loading ? null : result.product,
    error: loading ? null : result.error,
    loading,
  };
}
