import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { getMySeller } from "@/features/seller/sellerService";

/** Tienda del usuario con sesión: { seller, loading, error, reload }. */
export function useMySeller() {
  const { user } = useAuth();
  const userId = user?.id ?? null;

  const [version, setVersion] = useState(0);
  const key = `${userId}:${version}`;

  const [result, setResult] = useState({ key: null, seller: null, error: null });

  useEffect(() => {
    if (!userId) return;

    let cancelled = false;

    getMySeller(userId)
      .then((seller) => {
        if (!cancelled) setResult({ key, seller, error: null });
      })
      .catch((error) => {
        console.error("Error obteniendo la tienda:", error);
        if (!cancelled) {
          setResult({ key, seller: null, error: "No fue posible cargar tu tienda." });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [userId, key]);

  const reload = useCallback(() => setVersion((current) => current + 1), []);

  const loading = Boolean(userId) && result.key !== key;

  return {
    seller: loading ? null : result.seller,
    error: loading ? null : result.error,
    loading,
    reload,
  };
}
