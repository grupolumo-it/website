import { useCallback, useEffect, useState } from "react";
import { getBadges } from "@/features/badges/badgeService";

/** Etiquetas de producto: { badges, loading, error, reload }. */
export function useBadges({ onlyActive = false } = {}) {
  const [version, setVersion] = useState(0);
  const key = `${onlyActive}:${version}`;

  const [result, setResult] = useState({ key: null, badges: [], error: null });

  useEffect(() => {
    let cancelled = false;

    getBadges({ onlyActive })
      .then((badges) => {
        if (!cancelled) setResult({ key, badges, error: null });
      })
      .catch((error) => {
        console.error("Error obteniendo etiquetas:", error);
        if (!cancelled) {
          setResult({ key, badges: [], error: "No fue posible cargar las etiquetas." });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [onlyActive, key]);

  const reload = useCallback(() => setVersion((current) => current + 1), []);

  const loading = result.key !== key;

  return {
    badges: result.badges,
    error: loading ? null : result.error,
    loading,
    reload,
  };
}
