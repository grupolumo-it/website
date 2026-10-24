import { useEffect, useState } from "react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { getMySeller } from "@/features/seller/sellerService";

/** Tienda del usuario con sesión: { seller, loading, error }. */
export function useMySeller() {
  const { user } = useAuth();
  const userId = user?.id ?? null;

  const [result, setResult] = useState({ userId: null, seller: null, error: null });

  useEffect(() => {
    if (!userId) return;

    let cancelled = false;

    getMySeller(userId)
      .then((seller) => {
        if (!cancelled) setResult({ userId, seller, error: null });
      })
      .catch((error) => {
        console.error("Error obteniendo la tienda:", error);
        if (!cancelled) {
          setResult({ userId, seller: null, error: "No fue posible cargar tu tienda." });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [userId]);

  const loading = Boolean(userId) && result.userId !== userId;

  return {
    seller: loading ? null : result.seller,
    error: loading ? null : result.error,
    loading,
  };
}
