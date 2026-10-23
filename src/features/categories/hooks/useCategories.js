import { useEffect, useState } from "react";
import { getCategories } from "@/features/categories/categoryService";

// Las categorías cambian poco: se piden una sola vez y se comparten entre
// todos los componentes (Header y Home). Si se agrega una categoría nueva,
// aparece al recargar la página.
let categoriesPromise = null;

function loadCategories() {
  if (!categoriesPromise) {
    categoriesPromise = getCategories().catch((error) => {
      categoriesPromise = null; // permite reintentar si falló
      throw error;
    });
  }

  return categoriesPromise;
}

export function useCategories() {
  const [state, setState] = useState({
    categories: [],
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;

    loadCategories()
      .then((categories) => {
        if (!cancelled) setState({ categories, loading: false, error: null });
      })
      .catch((error) => {
        console.error("Error obteniendo categorías:", error);
        if (!cancelled) {
          setState({
            categories: [],
            loading: false,
            error: "No fue posible cargar las categorías.",
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
